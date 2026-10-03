# Handwritten Notes Index & Breakdown

Photos/scans of handwritten explanations are included in this directory:

Below is the transcript of the handwritten notes covering the 4 required sections for each issue: Location, Discovery, Root Cause, Fix Approach.

---

## 1. Filter Bypass & SQL Operator Precedence Bug
- **Location:** `backend/src/main/java/com/internal/tasktracker/TaskRepository.java` (Line 14-17), `db/queries/search_tasks.sql` (Line 11-13), `db/oracle/task_search_package.sql` (Line 53-55, 67-69)
- **How Discovered:** Filtering by status (e.g. `OPEN`) still showed `DONE` or `IN_PROGRESS` tasks whenever the search term matched task titles.
- **Root Cause:** In SQL, `AND` has higher operator precedence than `OR`. The query `WHERE archived = FALSE AND LOWER(title) LIKE :term OR LOWER(description) LIKE :term AND (:status IS NULL OR status = :status)` was evaluated as `(archived = FALSE AND LOWER(title) LIKE :term) OR (...)`. Any task title matching the search term bypassed the status filter and archived check.
- **Fix & Rationale:** Wrapped search term conditions in explicit parentheses: `AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term)`. Also added `useEffect` reset in `App.jsx` to reset `page` to 1 on filter changes.

---

## 2. Artificial Backend Delay Bottleneck
- **Location:** `backend/src/main/java/com/internal/tasktracker/TaskController.java` (Line 38-42)
- **How Discovered:** Empty or short search queries were taking > 1.0s to respond despite zero heavy operations.
- **Root Cause:** `Thread.sleep(queryWeight)` was artificially calculating `complexityScore = Math.max(0, 10 - query.length())` and sleeping up to `1000ms`.
- **Fix & Rationale:** Removed the artificial `Thread.sleep` block completely to restore sub-millisecond API response latency.

---

## 3. Missing Priority Filter Feature
- **Location:** `backend/src/main/java/com/internal/tasktracker/TaskController.java`, `TaskRepository.java`, `frontend/src/App.jsx`, `frontend/src/api.js`
- **How Discovered:** The UI table rendered task priorities (`HIGH`, `MEDIUM`, `LOW`), but there was no filter dropdown or API query parameter to filter tasks by priority.
- **Root Cause:** Missing priority query parameter and UI component.
- **Fix & Rationale:** Added `priority` parameter to `TaskController.java`, updated SQL query with `AND (:priority IS NULL OR priority = :priority)`, created `PriorityFilter.jsx` dropdown, and updated `useTasks` hook.

---

## 4. Unable to Open Task / Status Update API & UI
- **Location:** `backend/src/main/java/com/internal/tasktracker/TaskController.java`, `frontend/src/components/TaskTable.jsx`, `frontend/src/components/TaskModal.jsx`
- **How Discovered:** Clicking on tasks did not open details, and there was no way to update task status from the UI.
- **Root Cause:** Backend lacked `GET /api/tasks/{id}` and `PATCH /api/tasks/{id}` endpoints, and frontend lacked interactive row selection or status update handler.
- **Fix & Rationale:** Implemented `GET /api/tasks/{id}` and `PATCH /api/tasks/{id}` endpoints in Spring Boot with validation. Created `TaskModal.jsx` for viewing/editing full task details, and added interactive status dropdowns directly inside `TaskTable.jsx` cells for 1-click status updates.
