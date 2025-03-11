require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/authMiddleware");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect routes
app.use("/auth", authRoutes);

//  Example of protected endpoint
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users WHERE id = $1", [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving data" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
