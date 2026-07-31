const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Allowed values
const VALID_COVER_TYPES = ["Single", "Couple", "Family"];
const VALID_COVER_HISTORY = ["Yes", "No", "Not sure"];
const VALID_HOSPITAL_COVERS = [
  "None",
  "Basic",
  "Bronze",
  "Silver",
  "Gold",
];
const VALID_EXTRAS_COVERS = ["None", "Basic", "Standard", "Premium"];
const VALID_PAYMENT_FREQUENCIES = ["Monthly", "Yearly"];

/**
 * Convert a value to a number.
 * Returns null when the value is empty or invalid.
 */
function parseNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

/**
 * Validate and normalise quote data.
 */
function validateQuote(body) {
  const customerName =
    typeof body.customer_name === "string"
      ? body.customer_name.trim()
      : "";

  const coverType = body.cover_type;
  const applicant1Age = parseNumber(body.applicant1_age);
  const applicant1CoverHistory = body.applicant1_cover_history;

  let applicant2Age = parseNumber(body.applicant2_age);
  let applicant2CoverHistory = body.applicant2_cover_history || null;

  const hospitalCover = body.hospital_cover;
  const extrasCover = body.extras_cover;
  const paymentFrequency = body.payment_frequency;

  let annualDiscount = parseNumber(body.annual_discount);
  const monthlyPremium = parseNumber(body.monthly_premium) ?? 0;
  const yearlyPremium = parseNumber(body.yearly_premium) ?? 0;

  const notes =
    typeof body.notes === "string" ? body.notes.trim() : "";

  // Customer name
  if (!customerName) {
    return {
      error: "Customer name is required.",
    };
  }

  // Cover type
  if (!VALID_COVER_TYPES.includes(coverType)) {
    return {
      error: "Cover type must be Single, Couple, or Family.",
    };
  }

  // Applicant 1 age
  if (
    applicant1Age === null ||
    !Number.isInteger(applicant1Age) ||
    applicant1Age < 18 ||
    applicant1Age > 100
  ) {
    return {
      error: "Applicant 1 age must be a whole number between 18 and 100.",
    };
  }

  // Applicant 1 cover history
  if (!VALID_COVER_HISTORY.includes(applicant1CoverHistory)) {
    return {
      error:
        "Applicant 1 hospital cover history must be Yes, No, or Not sure.",
    };
  }

  // Single cover should not contain Applicant 2 information
  if (coverType === "Single") {
    applicant2Age = null;
    applicant2CoverHistory = null;
  }

  // Couple and Family require Applicant 2
  if (coverType === "Couple" || coverType === "Family") {
    if (
      applicant2Age === null ||
      !Number.isInteger(applicant2Age) ||
      applicant2Age < 18 ||
      applicant2Age > 100
    ) {
      return {
        error:
          "Applicant 2 age is required and must be a whole number between 18 and 100.",
      };
    }

    if (!VALID_COVER_HISTORY.includes(applicant2CoverHistory)) {
      return {
        error:
          "Applicant 2 hospital cover history must be Yes, No, or Not sure.",
      };
    }
  }

  // Hospital cover
  if (!VALID_HOSPITAL_COVERS.includes(hospitalCover)) {
    return {
      error:
        "Hospital cover must be None, Basic, Bronze, Silver, or Gold.",
    };
  }

  // Extras cover
  if (!VALID_EXTRAS_COVERS.includes(extrasCover)) {
    return {
      error:
        "Extras cover must be None, Basic, Standard, or Premium.",
    };
  }

  // Payment frequency
  if (!VALID_PAYMENT_FREQUENCIES.includes(paymentFrequency)) {
    return {
      error: "Payment frequency must be Monthly or Yearly.",
    };
  }

  // Annual discount
  if (annualDiscount === null) {
    annualDiscount = 0;
  }

  if (
    !Number.isFinite(annualDiscount) ||
    annualDiscount < 0 ||
    annualDiscount > 10
  ) {
    return {
      error: "Annual discount must be between 0 and 10.",
    };
  }

  // Annual discount only applies to yearly payments
  if (paymentFrequency === "Monthly") {
    annualDiscount = 0;
  }

  return {
    data: {
      customer_name: customerName,
      cover_type: coverType,
      applicant1_age: applicant1Age,
      applicant1_cover_history: applicant1CoverHistory,
      applicant2_age: applicant2Age,
      applicant2_cover_history: applicant2CoverHistory,
      hospital_cover: hospitalCover,
      extras_cover: extrasCover,
      payment_frequency: paymentFrequency,
      annual_discount: annualDiscount,
      monthly_premium: monthlyPremium,
      yearly_premium: yearlyPremium,
      notes,
    },
  };
}

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

    return res.status(200).json(rows);
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

    return res.status(200).json(row);
  });
});

// POST create a new quote
app.post("/api/quotes", (req, res) => {
  const validation = validateQuote(req.body);

  if (validation.error) {
    return res.status(400).json({
      error: validation.error,
    });
  }

  const quote = validation.data;

  const sql = `
    INSERT INTO quotes (
      customer_name,
      cover_type,
      applicant1_age,
      applicant1_cover_history,
      applicant2_age,
      applicant2_cover_history,
      hospital_cover,
      extras_cover,
      payment_frequency,
      annual_discount,
      monthly_premium,
      yearly_premium,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    quote.customer_name,
    quote.cover_type,
    quote.applicant1_age,
    quote.applicant1_cover_history,
    quote.applicant2_age,
    quote.applicant2_cover_history,
    quote.hospital_cover,
    quote.extras_cover,
    quote.payment_frequency,
    quote.annual_discount,
    quote.monthly_premium,
    quote.yearly_premium,
    quote.notes,
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

        return res.status(201).json({
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

  const validation = validateQuote(req.body);

  if (validation.error) {
    return res.status(400).json({
      error: validation.error,
    });
  }

  const quote = validation.data;

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
        applicant1_cover_history = ?,
        applicant2_age = ?,
        applicant2_cover_history = ?,
        hospital_cover = ?,
        extras_cover = ?,
        payment_frequency = ?,
        annual_discount = ?,
        monthly_premium = ?,
        yearly_premium = ?,
        notes = ?
      WHERE id = ?
    `;

    const values = [
      quote.customer_name,
      quote.cover_type,
      quote.applicant1_age,
      quote.applicant1_cover_history,
      quote.applicant2_age,
      quote.applicant2_cover_history,
      quote.hospital_cover,
      quote.extras_cover,
      quote.payment_frequency,
      quote.annual_discount,
      quote.monthly_premium,
      quote.yearly_premium,
      quote.notes,
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

          return res.status(200).json({
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

    return res.status(200).json({
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