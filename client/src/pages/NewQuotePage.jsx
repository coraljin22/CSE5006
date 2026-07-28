import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/api/quotes";

const initialFormData = {
  customer_name: "",
  cover_type: "Single",
  applicant1_age: "",
  applicant1_lhc: 0,
  applicant2_age: "",
  applicant2_lhc: 0,
  hospital_cover: "Basic",
  extras_cover: "None",
  payment_frequency: "Monthly",
  notes: "",
};

function NewQuotePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requiresSecondApplicant =
    formData.cover_type === "Couple" ||
    formData.cover_type === "Family";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required.";
    } else if (formData.customer_name.trim().length < 2) {
      newErrors.customer_name =
        "Customer name must contain at least 2 characters.";
    }

    const applicant1Age = Number(formData.applicant1_age);

    if (!formData.applicant1_age) {
      newErrors.applicant1_age = "Applicant 1 age is required.";
    } else if (
      !Number.isInteger(applicant1Age) ||
      applicant1Age < 18 ||
      applicant1Age > 120
    ) {
      newErrors.applicant1_age =
        "Applicant 1 age must be a whole number between 18 and 120.";
    }

    if (requiresSecondApplicant) {
      const applicant2Age = Number(formData.applicant2_age);

      if (!formData.applicant2_age) {
        newErrors.applicant2_age =
          "Applicant 2 age is required for Couple or Family cover.";
      } else if (
        !Number.isInteger(applicant2Age) ||
        applicant2Age < 18 ||
        applicant2Age > 120
      ) {
        newErrors.applicant2_age =
          "Applicant 2 age must be a whole number between 18 and 120.";
      }
    }

    if (
      formData.notes.length > 500
    ) {
      newErrors.notes =
        "Notes cannot contain more than 500 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const quoteData = {
      customer_name: formData.customer_name.trim(),
      cover_type: formData.cover_type,
      applicant1_age: Number(formData.applicant1_age),
      applicant1_lhc: Number(formData.applicant1_lhc),
      applicant2_age: requiresSecondApplicant
        ? Number(formData.applicant2_age)
        : null,
      applicant2_lhc: requiresSecondApplicant
        ? Number(formData.applicant2_lhc)
        : 0,
      hospital_cover: formData.hospital_cover,
      extras_cover: formData.extras_cover,
      payment_frequency: formData.payment_frequency,

      // These values will be calculated automatically in Part 3.
      monthly_premium: 0,
      yearly_premium: 0,
      discount: 0,

      notes: formData.notes.trim(),
    };

    try {
      setSubmitting(true);
      setServerError("");

      await axios.post(API_URL, quoteData);

      navigate("/");
    } catch (error) {
      console.error("Failed to create quote:", error);

      setServerError(
        error.response?.data?.error ||
          "Unable to create the quote. Please make sure the backend server is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Create quotation</p>
          <h1>New Health Cover Quote</h1>
          <p className="page-description">
            Enter the customer and cover details below.
          </p>
        </div>

        <Link to="/" className="button secondary-button">
          Back to Quotes
        </Link>
      </div>

      {serverError && (
        <div className="alert error-alert">
          {serverError}
        </div>
      )}

      <form className="quote-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">1</span>

            <div>
              <h2>Customer Details</h2>
              <p>Enter the name of the customer requesting the quote.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="customer_name">
                Customer Name
                <span className="required-mark">*</span>
              </label>

              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="For example, Coral Jin"
                className={
                  errors.customer_name ? "input-error" : ""
                }
              />

              {errors.customer_name && (
                <span className="field-error">
                  {errors.customer_name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">2</span>

            <div>
              <h2>Cover Details</h2>
              <p>Select the required health insurance cover.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cover_type">
                Cover Type
                <span className="required-mark">*</span>
              </label>

              <select
                id="cover_type"
                name="cover_type"
                value={formData.cover_type}
                onChange={handleChange}
              >
                <option value="Single">Single</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hospital_cover">
                Hospital Cover
                <span className="required-mark">*</span>
              </label>

              <select
                id="hospital_cover"
                name="hospital_cover"
                value={formData.hospital_cover}
                onChange={handleChange}
              >
                <option value="Basic">Basic</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="extras_cover">
                Extras Cover
                <span className="required-mark">*</span>
              </label>

              <select
                id="extras_cover"
                name="extras_cover"
                value={formData.extras_cover}
                onChange={handleChange}
              >
                <option value="None">None</option>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="payment_frequency">
                Payment Frequency
                <span className="required-mark">*</span>
              </label>

              <select
                id="payment_frequency"
                name="payment_frequency"
                value={formData.payment_frequency}
                onChange={handleChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">3</span>

            <div>
              <h2>Applicant 1</h2>
              <p>Enter the primary applicant information.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="applicant1_age">
                Age
                <span className="required-mark">*</span>
              </label>

              <input
                id="applicant1_age"
                name="applicant1_age"
                type="number"
                min="18"
                max="120"
                step="1"
                value={formData.applicant1_age}
                onChange={handleChange}
                placeholder="18–120"
                className={
                  errors.applicant1_age ? "input-error" : ""
                }
              />

              {errors.applicant1_age && (
                <span className="field-error">
                  {errors.applicant1_age}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="applicant1_lhc">
                LHC Loading
              </label>

              <select
                id="applicant1_lhc"
                name="applicant1_lhc"
                value={formData.applicant1_lhc}
                onChange={handleChange}
              >
                <option value="0">0%</option>
                <option value="2">2%</option>
                <option value="4">4%</option>
                <option value="6">6%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
                <option value="60">60%</option>
                <option value="70">70%</option>
              </select>

              <span className="field-help">
                Lifetime Health Cover loading percentage.
              </span>
            </div>
          </div>
        </div>

        {requiresSecondApplicant && (
          <div className="form-section">
            <div className="form-section-heading">
              <span className="section-number">4</span>

              <div>
                <h2>Applicant 2</h2>
                <p>
                  Required because {formData.cover_type} cover is selected.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="applicant2_age">
                  Age
                  <span className="required-mark">*</span>
                </label>

                <input
                  id="applicant2_age"
                  name="applicant2_age"
                  type="number"
                  min="18"
                  max="120"
                  step="1"
                  value={formData.applicant2_age}
                  onChange={handleChange}
                  placeholder="18–120"
                  className={
                    errors.applicant2_age ? "input-error" : ""
                  }
                />

                {errors.applicant2_age && (
                  <span className="field-error">
                    {errors.applicant2_age}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="applicant2_lhc">
                  LHC Loading
                </label>

                <select
                  id="applicant2_lhc"
                  name="applicant2_lhc"
                  value={formData.applicant2_lhc}
                  onChange={handleChange}
                >
                  <option value="0">0%</option>
                  <option value="2">2%</option>
                  <option value="4">4%</option>
                  <option value="6">6%</option>
                  <option value="8">8%</option>
                  <option value="10">10%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                  <option value="40">40%</option>
                  <option value="50">50%</option>
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                </select>

                <span className="field-help">
                  Lifetime Health Cover loading percentage.
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">
              {requiresSecondApplicant ? "5" : "4"}
            </span>

            <div>
              <h2>Additional Notes</h2>
              <p>Add optional information about this quote.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>

              <textarea
                id="notes"
                name="notes"
                rows="5"
                maxLength="500"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes..."
                className={errors.notes ? "input-error" : ""}
              />

              <div className="textarea-information">
                <span>
                  {errors.notes ? (
                    <span className="field-error">
                      {errors.notes}
                    </span>
                  ) : (
                    "Optional"
                  )}
                </span>

                <span>{formData.notes.length}/500</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/" className="button secondary-button">
            Cancel
          </Link>

          <button
            type="submit"
            className="button primary-button"
            disabled={submitting}
          >
            {submitting ? "Saving Quote..." : "Save Quote"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewQuotePage;