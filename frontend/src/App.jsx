
import { useEffect, useState } from 'react';

const API = '/api/tasks';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to load');
      setTasks(await res.json());
      setError('');
    } catch {
      setError('Backend unreachable');
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch(API, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ title }),
    });

    setTitle('');
    loadTasks();
  }

  async function toggleDone(task) {
    await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ done: !task.done }),
    });
    loadTasks();
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;

    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ title: editTitle }),
    });

    setEditingId(null);
    loadTasks();
  }

  async function removeTask(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTasks();
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Task List</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ margin: '8px 0' }}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t)}
            />

            {editingId === t.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(t.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: t.done ? 'line-through' : 'none',
                  }}
                >
                  {t.title}
                </span>

                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setEditTitle(t.title);
                  }}
                >
                  Edit
                </button>

                <button onClick={() => removeTask(t.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
