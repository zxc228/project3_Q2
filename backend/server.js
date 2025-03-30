require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/authMiddleware");
const pool = require("./config/db");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
// Connect routes
app.use("/api", authRoutes);


//  Example of protecexpressted endpoint
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users WHERE id = $1", [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving data" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
