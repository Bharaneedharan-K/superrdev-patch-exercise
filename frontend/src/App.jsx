import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import PriorityFilter from './components/PriorityFilter';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [query, status, priority]);

  const { tasks, total, loading, error, refresh } = useTasks(query, status, priority, page, 10);

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Task Tracker</h1>
          <p className="subtitle">Internal task management</p>
        </div>
        <button className="btn-add-task" onClick={() => setIsCreatingTask(true)}>
          + Add Task
        </button>
      </header>

      <div className="controls">
        <SearchBar value={query} onChange={setQuery} />
        <StatusFilter value={status} onChange={setStatus} />
        <PriorityFilter value={priority} onChange={setPriority} />
      </div>

      <TaskTable
        tasks={tasks}
        loading={loading}
        error={error}
        onSelectTask={setSelectedTask}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      {(selectedTask || isCreatingTask) && (
        <TaskModal
          task={selectedTask}
          isCreate={isCreatingTask}
          onClose={() => {
            setSelectedTask(null);
            setIsCreatingTask(false);
          }}
          onTaskUpdated={refresh}
        />
      )}
    </div>
  );
}
