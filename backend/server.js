
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);
}

// READ: Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT * FROM tasks ORDER BY id'
    );
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE: Add a task
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: 'title is required',
    });
  }

  try {
    const r = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE: Edit task title or completion status
app.put('/api/tasks/:id', async (req, res) => {
  const { title, done } = req.body;

  try {
    const r = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           done = COALESCE($2, done)
       WHERE id = $3
       RETURNING *`,
      [title, done, req.params.id]
    );

    if (r.rowCount === 0) {
      return res.status(404).json({
        error: 'task not found',
      });
    }

    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE: Remove a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const r = await pool.query(
      'DELETE FROM tasks WHERE id = $1',
      [req.params.id]
    );

    if (r.rowCount === 0) {
      return res.status(404).json({
        error: 'task not found',
      });
    }

    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start server after database initialization
init()
  .then(() => {
    app.listen(3000, () => {
      console.log('Backend listening on 3000');
    });
  })
  .catch((e) => {
    console.error('DB init failed:', e.message);
    process.exit(1);
  });
