import { useState, useEffect, useCallback } from 'react';
import { fetchTasks } from '../api';

export function useTasks(query, status, priority, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const refresh = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchTasks({ query, status, priority, page, pageSize })
      .then((data) => {
        setTasks(data.items || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query, status, priority, page, pageSize, reloadTrigger]);

  return { tasks, total, loading, error, refresh };
}

