const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(
  __dirname,
  "database",
  "healthcover.db"
);

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Failed to connect to SQLite database:", error.message);
    return;
  }

  console.log("Connected to the HealthCoverSim SQLite database.");
});

module.exports = db;