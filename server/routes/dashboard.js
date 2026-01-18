const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

/*
GET /api/dashboard
*/
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total tasks
    const totalTasks = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
      [userId]
    );

    // Completed tasks
    const completedTasks = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = 'Completed'",
      [userId]
    );

    // Overdue tasks
    const overdueTasks = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND is_overdue = TRUE",
      [userId]
    );

    // Tasks completed per day (last 7 days)
    const tasksPerDay = await pool.query(
      `
      SELECT DATE(updated_at) as day, COUNT(*) 
      FROM tasks
      WHERE user_id = $1
      AND status = 'Completed'
      AND updated_at >= NOW() - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day
      `,
      [userId]
    );

    const total = parseInt(totalTasks.rows[0].count);
    const completed = parseInt(completedTasks.rows[0].count);

    const completionRate =
      total === 0 ? "0%" : `${Math.round((completed / total) * 100)}%`;

    res.json({
      totalTasks: total,
      completedTasks: completed,
      overdueTasks: parseInt(overdueTasks.rows[0].count),
      completionRate,
      completedPerDay: tasksPerDay.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
