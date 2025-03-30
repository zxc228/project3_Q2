const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { id, email, password, role, studies } = req.body;
  

  if (!id || !email || !password || !role) {
    return res.status(400).json({ error: "Fill in all required fields (id, email, password, role)" });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO "User" (id, email, passwordhash, role, studies) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, studies`,
      [id, email, hashedPassword, role, studies || null]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Enter email and password" });
  }

  try {
    const result = await pool.query(`SELECT * FROM "User" WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const user = result.rows[0];

    // Compare the password with the hash from the database
    const valid = await bcrypt.compare(password, user.passwordhash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studies: user.studies,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
});

module.exports = router;