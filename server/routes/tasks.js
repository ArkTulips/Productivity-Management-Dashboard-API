const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

/*
CREATE TASK

POST /api/tasks
*/
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, status, deadline, tags } = req.body;

    const newTask = await pool.query(
      `INSERT INTO tasks
      (user_id, title, description, priority, status, deadline, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        req.user.id,
        title,
        description,
        priority,
        status,
        deadline,
        tags
      ]
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
GET ALL TASKS (with search & filters)
GET /api/tasks
*/
router.get("/", auth, async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    let query = `SELECT * FROM tasks WHERE user_id = $1`;
    let values = [req.user.id];
    let index = 2;

    if (status) {
      query += ` AND status = $${index++}`;
      values.push(status);
    }

    if (priority) {
      query += ` AND priority = $${index++}`;
      values.push(priority);
    }

    if (search) {
      query += ` AND (title ILIKE $${index} OR description ILIKE $${index})`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const tasks = await pool.query(query, values);

    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
GET SINGLE TASK
GET /api/tasks/:id
*/
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await pool.query(
      `SELECT * FROM tasks WHERE id=$1 AND user_id=$2`,
      [req.params.id, req.user.id]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
UPDATE TASK
PUT /api/tasks/:id
*/
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, priority, status, deadline, tags } = req.body;

    const updated = await pool.query(
      `UPDATE tasks SET
      title=$1,
      description=$2,
      priority=$3,
      status=$4,
      deadline=$5,
      tags=$6,
      updated_at=NOW()
      WHERE id=$7 AND user_id=$8
      RETURNING *`,
      [
        title,
        description,
        priority,
        status,
        deadline,
        tags,
        req.params.id,
        req.user.id
      ]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
DELETE TASK
DELETE /api/tasks/:id
*/
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await pool.query(
      `DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
