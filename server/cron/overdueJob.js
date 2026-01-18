const cron = require("node-cron");
const pool = require("../db");

cron.schedule("*/1 * * * *", async () => {
  try {
    await pool.query(`
      UPDATE tasks
      SET is_overdue = TRUE
      WHERE deadline < NOW()
      AND status != 'Completed'
      AND is_overdue = FALSE
    `);

    console.log(" :) Overdue tasks updated");
  } catch (err) {
    console.error(" :( Cron error:", err.message);
  }
});
