# Patch Notes & Exercise Summary

## 1. Summary of Changes
- **SQL Operator Precedence Bug:** Added parentheses around title/description search conditions in `TaskRepository.java`, `db/queries/search_tasks.sql`, and `db/oracle/task_search_package.sql`. Previously, title matches bypassed status and archived filters.
- **Removed Artificial Delay:** Deleted `Thread.sleep()` in `TaskController.java` which added up to 1000ms latency to short/empty queries.
- **Priority Filter:** Added `priority` backend param (`:priority IS NULL OR priority = :priority`) and created `PriorityFilter.jsx` dropdown component.
- **Task Creation & Modification Flow:** Implemented `POST /api/tasks`, `PATCH /api/tasks/{id}`, and `GET /api/tasks/{id}` endpoints. Added "+ Add Task" button and updated `TaskTable.jsx` to show read-only status badges with a "Modify" action button opening `TaskModal.jsx`.
- **UI State Fix:** Reset pagination `page` state to 1 whenever filters change.

## 2. What I Chose Not to Change & Why
- **In-Memory Pagination:** Kept `allResults.subList(...)` for simplicity within the 90-minute timebox, as H2 dataset is small.
- **Full Redesign / Component Libraries:** Maintained clean Vanilla CSS styling without adding heavyweight UI frameworks like Tailwind or Material UI.

## 3. Biggest Remaining Risk
- **Backend Pagination & Scalability:** `TaskRepository.searchTasks()` loads all unarchived records into Spring memory before paginating. If the dataset grows to millions of rows, memory overhead and query execution time will degrade performance severely. Switching to Spring Data `Pageable` or native SQL `LIMIT/OFFSET` is recommended for production.

## 4. Tools & AI Used
- **GenAI / Antigravity AI:** Used AI to brainstorm code anomalies across SQL and Java, draft initial component snippets for `TaskModal.jsx`, and suggest SQL fixes. I manually reviewed, edited, debugged, and verified all backend endpoints (`POST`, `PATCH`) and tested the full application flow locally.
