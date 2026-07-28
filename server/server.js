const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "HealthCoverSim API is running",
  });
});

// GET all quotes
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

    res.status(200).json(rows);
  });
});

// GET one quote by ID
app.get("/api/quotes/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM quotes
    WHERE id = ?
  `;

  db.get(sql, [id], (error, row) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to retrieve quote.",
        details: error.message,
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "Quote not found.",
      });
    }

    res.status(200).json(row);
  });
});

// POST create a new quote
app.post("/api/quotes", (req, res) => {
  const {
    customer_name,
    cover_type,
    applicant1_age,
    applicant1_lhc = 0,
    applicant2_age = null,
    applicant2_lhc = 0,
    hospital_cover,
    extras_cover,
    payment_frequency,
    monthly_premium = 0,
    yearly_premium = 0,
    discount = 0,
    notes = "",
  } = req.body;

  if (
    !customer_name ||
    !cover_type ||
    applicant1_age === undefined ||
    applicant1_age === null ||
    !hospital_cover ||
    !extras_cover ||
    !payment_frequency
  ) {
    return res.status(400).json({
      error: "Missing required fields.",
    });
  }

  if (
    typeof applicant1_age !== "number" ||
    applicant1_age < 18 ||
    applicant1_age > 120
  ) {
    return res.status(400).json({
      error: "Applicant 1 age must be between 18 and 120.",
    });
  }

  if (
    applicant2_age !== null &&
    (typeof applicant2_age !== "number" ||
      applicant2_age < 18 ||
      applicant2_age > 120)
  ) {
    return res.status(400).json({
      error: "Applicant 2 age must be between 18 and 120.",
    });
  }

  const sql = `
    INSERT INTO quotes (
      customer_name,
      cover_type,
      applicant1_age,
      applicant1_lhc,
      applicant2_age,
      applicant2_lhc,
      hospital_cover,
      extras_cover,
      payment_frequency,
      monthly_premium,
      yearly_premium,
      discount,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customer_name.trim(),
    cover_type,
    applicant1_age,
    applicant1_lhc,
    applicant2_age,
    applicant2_lhc,
    hospital_cover,
    extras_cover,
    payment_frequency,
    monthly_premium,
    yearly_premium,
    discount,
    notes,
  ];

  db.run(sql, values, function (error) {
    if (error) {
      return res.status(500).json({
        error: "Failed to create quote.",
        details: error.message,
      });
    }

    const newQuoteId = this.lastID;

    db.get(
      "SELECT * FROM quotes WHERE id = ?",
      [newQuoteId],
      (selectError, newQuote) => {
        if (selectError) {
          return res.status(500).json({
            error: "Quote was created, but could not be retrieved.",
            details: selectError.message,
          });
        }

        res.status(201).json({
          message: "Quote created successfully.",
          quote: newQuote,
        });
      }
    );
  });
});

// PUT update an existing quote
app.put("/api/quotes/:id", (req, res) => {
  const { id } = req.params;

  const {
    customer_name,
    cover_type,
    applicant1_age,
    applicant1_lhc = 0,
    applicant2_age = null,
    applicant2_lhc = 0,
    hospital_cover,
    extras_cover,
    payment_frequency,
    monthly_premium = 0,
    yearly_premium = 0,
    discount = 0,
    notes = "",
  } = req.body;

  if (
    !customer_name ||
    !cover_type ||
    applicant1_age === undefined ||
    applicant1_age === null ||
    !hospital_cover ||
    !extras_cover ||
    !payment_frequency
  ) {
    return res.status(400).json({
      error: "Missing required fields.",
    });
  }

  if (
    typeof applicant1_age !== "number" ||
    applicant1_age < 18 ||
    applicant1_age > 120
  ) {
    return res.status(400).json({
      error: "Applicant 1 age must be between 18 and 120.",
    });
  }

  if (
    applicant2_age !== null &&
    (typeof applicant2_age !== "number" ||
      applicant2_age < 18 ||
      applicant2_age > 120)
  ) {
    return res.status(400).json({
      error: "Applicant 2 age must be between 18 and 120.",
    });
  }

  const checkSql = `
    SELECT id
    FROM quotes
    WHERE id = ?
  `;

  db.get(checkSql, [id], (checkError, existingQuote) => {
    if (checkError) {
      return res.status(500).json({
        error: "Failed to check quote.",
        details: checkError.message,
      });
    }

    if (!existingQuote) {
      return res.status(404).json({
        error: "Quote not found.",
      });
    }

    const updateSql = `
      UPDATE quotes
      SET
        customer_name = ?,
        cover_type = ?,
        applicant1_age = ?,
        applicant1_lhc = ?,
        applicant2_age = ?,
        applicant2_lhc = ?,
        hospital_cover = ?,
        extras_cover = ?,
        payment_frequency = ?,
        monthly_premium = ?,
        yearly_premium = ?,
        discount = ?,
        notes = ?
      WHERE id = ?
    `;

    const values = [
      customer_name.trim(),
      cover_type,
      applicant1_age,
      applicant1_lhc,
      applicant2_age,
      applicant2_lhc,
      hospital_cover,
      extras_cover,
      payment_frequency,
      monthly_premium,
      yearly_premium,
      discount,
      notes,
      id,
    ];

    db.run(updateSql, values, function (updateError) {
      if (updateError) {
        return res.status(500).json({
          error: "Failed to update quote.",
          details: updateError.message,
        });
      }

      db.get(
        "SELECT * FROM quotes WHERE id = ?",
        [id],
        (selectError, updatedQuote) => {
          if (selectError) {
            return res.status(500).json({
              error: "Quote was updated, but could not be retrieved.",
              details: selectError.message,
            });
          }

          res.status(200).json({
            message: "Quote updated successfully.",
            quote: updatedQuote,
          });
        }
      );
    });
  });
});

// DELETE a quote
app.delete("/api/quotes/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM quotes
    WHERE id = ?
  `;

  db.run(sql, [id], function (error) {
    if (error) {
      return res.status(500).json({
        error: "Failed to delete quote.",
        details: error.message,
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Quote not found.",
      });
    }

    res.status(200).json({
      message: "Quote deleted successfully.",
    });
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`HealthCoverSim API running at http://localhost:${PORT}`);
});