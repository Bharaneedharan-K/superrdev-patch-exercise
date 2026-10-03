import { useState, useEffect } from 'react';
import { updateTask, createTask } from '../api';

export default function TaskModal({ task, isCreate, onClose, onTaskUpdated }) {
  const [status, setStatus] = useState('OPEN');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignee, setAssignee] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isCreate) {
      setTitle('');
      setDescription('');
      setStatus('OPEN');
      setPriority('MEDIUM');
      setAssignee('');
    } else if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'OPEN');
      setPriority(task.priority || 'MEDIUM');
      setAssignee(task.assignee || '');
    }
  }, [task, isCreate]);

  if (!task && !isCreate) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isCreate) {
        await createTask({
          title,
          description,
          status,
          priority,
          assignee,
        });
      } else {
        await updateTask(task.id, {
          title,
          description,
          status,
          priority,
          assignee,
        });
      }
      setSaving(false);
      onTaskUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isCreate ? 'Add New Task' : `Modify Task #${task.id}`}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="modal-error">Error: {error}</div>}

        <form onSubmit={handleSave} className="modal-body">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assignee</label>
            <input
              type="text"
              className="form-input"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assignee name..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isCreate ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
