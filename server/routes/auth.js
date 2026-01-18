const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id",
    [name, email, hash]
  );

  res.json({ message: "User registered" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!result.rows.length) return res.sendStatus(401);

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.sendStatus(401);

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;
