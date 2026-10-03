export default function TaskTable({ tasks, loading, error, onSelectTask }) {
  if (loading) {
    return <div className="state-message">Loading tasks...</div>;
  }

  if (error) {
    return <div className="state-message error">Error: {error}</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div className="state-message">No tasks found.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="task-row" onClick={() => onSelectTask && onSelectTask(task)}>
              <td className="task-id">#{task.id}</td>
              <td>
                <div className="task-title">{task.title}</div>
                <div className="task-desc">{task.description}</div>
              </td>
              <td>
                <span className={`status-badge status-${(task.status || 'open').toLowerCase()}`}>
                  {task.status || 'OPEN'}
                </span>
              </td>
              <td>
                <span className={`priority-badge priority-${(task.priority || 'medium').toLowerCase()}`}>
                  {task.priority || 'MEDIUM'}
                </span>
              </td>
              <td>{task.assignee || '\u2014'}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button className="btn-open-task" onClick={() => onSelectTask && onSelectTask(task)}>
                  Modify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
