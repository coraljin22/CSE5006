const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "HealthCoverSim API is running",
  });
});

app.get("/api/quotes", (req, res) => {
  const sql = `
    SELECT *
    FROM quotes
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (error, rows) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to retrieve quotes.",
        details: error.message,
      });
    }

    res.json(rows);
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HealthCoverSim API running at http://localhost:${PORT}`);
});