package com.internal.tasktracker;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/tasks")
    public ResponseEntity<?> searchTasks(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize) {

        String query = q == null ? "" : q.trim();
        String searchTerm = "%" + query.toLowerCase() + "%";

        String normalizedStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                normalizedStatus = TaskStatus.valueOf(status.trim().toUpperCase()).name();
            } catch (IllegalArgumentException e) {
                normalizedStatus = status.trim().toUpperCase();
            }
        }

        String normalizedPriority = null;
        if (priority != null && !priority.trim().isEmpty()) {
            normalizedPriority = priority.trim().toUpperCase();
        }

        System.out.println("[TaskController] q=\"" + query + "\" status=" + normalizedStatus
                + " priority=" + normalizedPriority + " page=" + page + " pageSize=" + pageSize);

        List<Task> allResults = taskRepository.searchTasks(searchTerm, normalizedStatus, normalizedPriority);

        int start = Math.max(0, (page - 1) * pageSize);
        int end = Math.min(start + pageSize, allResults.size());
        List<Task> pageResults = (start < allResults.size())
                ? allResults.subList(start, end)
                : Collections.emptyList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("items", pageResults);
        response.put("total", allResults.size());
        response.put("page", page);
        response.put("pageSize", pageSize);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/tasks/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Task not found with id: " + id));
        }
        return ResponseEntity.ok(optionalTask.get());
    }

    @PatchMapping("/api/tasks/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Task not found with id: " + id));
        }

        Task task = optionalTask.get();

        if (updates.containsKey("status")) {
            String newStatus = (String) updates.get("status");
            if (newStatus != null) {
                try {
                    TaskStatus.valueOf(newStatus.toUpperCase());
                    task.setStatus(newStatus.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Invalid status value: " + newStatus));
                }
            }
        }

        if (updates.containsKey("priority")) {
            String newPriority = (String) updates.get("priority");
            if (newPriority != null) {
                task.setPriority(newPriority.toUpperCase());
            }
        }

        if (updates.containsKey("title")) {
            String newTitle = (String) updates.get("title");
            if (newTitle != null && !newTitle.trim().isEmpty()) {
                task.setTitle(newTitle.trim());
            }
        }

        if (updates.containsKey("description")) {
            task.setDescription((String) updates.get("description"));
        }

        if (updates.containsKey("assignee")) {
            task.setAssignee((String) updates.get("assignee"));
        }

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @PostMapping("/api/tasks")
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Task title cannot be blank"));
        }

        String description = (String) body.get("description");
        String status = (String) body.getOrDefault("status", "OPEN");
        String priority = (String) body.getOrDefault("priority", "MEDIUM");
        String assignee = (String) body.get("assignee");

        if (status == null || status.trim().isEmpty()) status = "OPEN";
        if (priority == null || priority.trim().isEmpty()) priority = "MEDIUM";

        try {
            TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status: " + status));
        }

        Task task = new Task();
        task.setTitle(title.trim());
        task.setDescription(description != null ? description.trim() : null);
        task.setStatus(status.toUpperCase());
        task.setPriority(priority.toUpperCase());
        task.setAssignee(assignee != null ? assignee.trim() : null);
        task.setArchived(false);
        task.setCreatedAt(java.time.LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }
}


