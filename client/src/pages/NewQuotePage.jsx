import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CALCULATE_API = "http://localhost:3001/api/calculate";
const QUOTES_API = "http://localhost:3001/api/quotes";

const INITIAL_FORM = {
  customer_name: "",
  cover_type: "Single",
  applicant1_age: "",
  applicant1_cover_history: "Yes",
  applicant2_age: "",
  applicant2_cover_history: "Yes",
  hospital_cover: "None",
  extras_cover: "None",
  payment_frequency: "Monthly",
  annual_discount: 0,
  notes: "",
};

function NewQuotePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [calculation, setCalculation] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);

  const requiresApplicant2 =
    formData.cover_type === "Couple" ||
    formData.cover_type === "Family";

  const isYearly = formData.payment_frequency === "Yearly";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentForm) => {
      const updatedForm = {
        ...currentForm,
        [name]: value,
      };

      if (name === "cover_type" && value === "Single") {
        updatedForm.applicant2_age = "";
        updatedForm.applicant2_cover_history = "Yes";
      }

      if (name === "payment_frequency" && value === "Monthly") {
        updatedForm.annual_discount = 0;
      }

      return updatedForm;
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    // Any input change invalidates the previous calculation.
    setCalculation(null);
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required.";
    }

    const applicant1Age = Number(formData.applicant1_age);

    if (formData.applicant1_age === "") {
      newErrors.applicant1_age = "Applicant 1 age is required.";
    } else if (
      !Number.isInteger(applicant1Age) ||
      applicant1Age < 18 ||
      applicant1Age > 100
    ) {
      newErrors.applicant1_age =
        "Age must be a whole number between 18 and 100.";
    }

    if (requiresApplicant2) {
      const applicant2Age = Number(formData.applicant2_age);

      if (formData.applicant2_age === "") {
        newErrors.applicant2_age =
          "Applicant 2 age is required for Couple or Family cover.";
      } else if (
        !Number.isInteger(applicant2Age) ||
        applicant2Age < 18 ||
        applicant2Age > 100
      ) {
        newErrors.applicant2_age =
          "Age must be a whole number between 18 and 100.";
      }
    }

    const discount = Number(formData.annual_discount);

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > 10
    ) {
      newErrors.annual_discount =
        "Annual discount must be between 0 and 10.";
    }

    if (formData.notes.length > 500) {
      newErrors.notes =
        "Notes cannot contain more than 500 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const buildRequestData = () => ({
    customer_name: formData.customer_name.trim(),
    cover_type: formData.cover_type,
    applicant1_age: Number(formData.applicant1_age),
    applicant1_cover_history:
      formData.applicant1_cover_history,

    applicant2_age: requiresApplicant2
      ? Number(formData.applicant2_age)
      : null,

    applicant2_cover_history: requiresApplicant2
      ? formData.applicant2_cover_history
      : null,

    hospital_cover: formData.hospital_cover,
    extras_cover: formData.extras_cover,
    payment_frequency: formData.payment_frequency,

    annual_discount: isYearly
      ? Number(formData.annual_discount)
      : 0,

    notes: formData.notes.trim(),
  });

  const handleCalculate = async () => {
    if (!validateForm()) {
      setCalculation(null);
      return;
    }

    try {
      setCalculating(true);
      setServerError("");

      const response = await axios.post(
        CALCULATE_API,
        buildRequestData()
      );

      setCalculation(response.data.calculation);
    } catch (error) {
      console.error("Calculation failed:", error);

      setServerError(
        error.response?.data?.error ||
          "Unable to calculate the premium. Check that the backend server is running."
      );

      setCalculation(null);
    } finally {
      setCalculating(false);
    }
  };

  const handleSave = async () => {
    if (!calculation) {
      setServerError(
        "Please calculate the premium before saving the quote."
      );
      return;
    }

    try {
      setSaving(true);
      setServerError("");

      await axios.post(QUOTES_API, buildRequestData());

      navigate("/");
    } catch (error) {
      console.error("Save failed:", error);

      setServerError(
        error.response?.data?.error ||
          "Unable to save the quote. Check that the backend server is running."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Create quotation</p>
          <h1>New Health Cover Quote</h1>
          <p className="page-description">
            Enter the customer and cover details, calculate the
            premium, and then save the quote.
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

      <div className="quote-form">
        {/* Customer details */}
        <section className="form-section">
          <div className="form-section-heading">
            <span className="section-number">1</span>

            <div>
              <h2>Customer Details</h2>
              <p>Enter the customer requesting the quote.</p>
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
        </section>

        {/* Cover details */}
        <section className="form-section">
          <div className="form-section-heading">
            <span className="section-number">2</span>

            <div>
              <h2>Cover Details</h2>
              <p>Select the requested insurance cover.</p>
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
                <option value="None">None</option>
                <option value="Basic">Basic — $90/adult</option>
                <option value="Bronze">
                  Bronze — $120/adult
                </option>
                <option value="Silver">
                  Silver — $160/adult
                </option>
                <option value="Gold">Gold — $220/adult</option>
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
                <option value="Basic">Basic — $25/adult</option>
                <option value="Standard">
                  Standard — $45/adult
                </option>
                <option value="Premium">
                  Premium — $70/adult
                </option>
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
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {isYearly && (
              <div className="form-group">
                <label htmlFor="annual_discount">
                  Annual-Payment Discount %
                </label>

                <input
                  id="annual_discount"
                  name="annual_discount"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.annual_discount}
                  onChange={handleChange}
                  className={
                    errors.annual_discount
                      ? "input-error"
                      : ""
                  }
                />

                {errors.annual_discount ? (
                  <span className="field-error">
                    {errors.annual_discount}
                  </span>
                ) : (
                  <span className="field-help">
                    Enter a value from 0% to 10%.
                  </span>
                )}
              </div>
            )}

            {formData.cover_type === "Family" && (
              <div className="form-information">
                Family cover automatically includes a $30 monthly
                upgrade fee. Children’s ages are not required.
              </div>
            )}
          </div>
        </section>

        {/* Applicant 1 */}
        <section className="form-section">
          <div className="form-section-heading">
            <span className="section-number">3</span>

            <div>
              <h2>Applicant 1</h2>
              <p>Enter the primary applicant’s details.</p>
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
                max="100"
                step="1"
                value={formData.applicant1_age}
                onChange={handleChange}
                placeholder="18–100"
                className={
                  errors.applicant1_age
                    ? "input-error"
                    : ""
                }
              />

              {errors.applicant1_age && (
                <span className="field-error">
                  {errors.applicant1_age}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="applicant1_cover_history">
                Hospital Cover History
                <span className="required-mark">*</span>
              </label>

              <select
                id="applicant1_cover_history"
                name="applicant1_cover_history"
                value={
                  formData.applicant1_cover_history
                }
                onChange={handleChange}
              >
                <option value="Yes">
                  Yes — had hospital cover before
                </option>
                <option value="No">
                  No — no previous hospital cover
                </option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
          </div>
        </section>

        {/* Applicant 2 */}
        {requiresApplicant2 && (
          <section className="form-section">
            <div className="form-section-heading">
              <span className="section-number">4</span>

              <div>
                <h2>Applicant 2</h2>
                <p>
                  Required for {formData.cover_type} cover.
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
                  max="100"
                  step="1"
                  value={formData.applicant2_age}
                  onChange={handleChange}
                  placeholder="18–100"
                  className={
                    errors.applicant2_age
                      ? "input-error"
                      : ""
                  }
                />

                {errors.applicant2_age && (
                  <span className="field-error">
                    {errors.applicant2_age}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="applicant2_cover_history">
                  Hospital Cover History
                  <span className="required-mark">*</span>
                </label>

                <select
                  id="applicant2_cover_history"
                  name="applicant2_cover_history"
                  value={
                    formData.applicant2_cover_history
                  }
                  onChange={handleChange}
                >
                  <option value="Yes">
                    Yes — had hospital cover before
                  </option>
                  <option value="No">
                    No — no previous hospital cover
                  </option>
                  <option value="Not sure">
                    Not sure
                  </option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Notes */}
        <section className="form-section">
          <div className="form-section-heading">
            <span className="section-number">
              {requiresApplicant2 ? "5" : "4"}
            </span>

            <div>
              <h2>Additional Notes</h2>
              <p>Optional information about the quote.</p>
            </div>
          </div>

          <div className="form-group">
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
        </section>

        {/* Calculate button */}
        <div className="calculate-actions">
          <button
            type="button"
            className="button calculate-button"
            onClick={handleCalculate}
            disabled={calculating}
          >
            {calculating
              ? "Calculating..."
              : "Calculate Premium"}
          </button>
        </div>

        {/* Calculation result */}
        {calculation && (
          <section className="calculation-card">
            <div className="calculation-heading">
              <div>
                <p className="eyebrow">Estimated premium</p>
                <h2>Quote Calculation</h2>
              </div>

              <span className="calculation-status">
                Calculation complete
              </span>
            </div>

            <div className="premium-summary">
              <div className="premium-summary-item">
                <span>Monthly Premium</span>
                <strong>
                  {formatCurrency(
                    calculation.monthly_premium
                  )}
                </strong>
              </div>

              <div className="premium-summary-item">
                <span>Yearly Before Discount</span>
                <strong>
                  {formatCurrency(
                    calculation.yearly_before_discount
                  )}
                </strong>
              </div>

              {isYearly && (
                <div className="premium-summary-item highlighted">
                  <span>Final Yearly Premium</span>
                  <strong>
                    {formatCurrency(
                      calculation.yearly_premium
                    )}
                  </strong>
                </div>
              )}
            </div>

            <div className="calculation-breakdown">
              <div className="breakdown-row">
                <span>Hospital premium</span>
                <strong>
                  {formatCurrency(
                    calculation.total_hospital_cost
                  )}
                </strong>
              </div>

              <div className="breakdown-row">
                <span>Extras premium</span>
                <strong>
                  {formatCurrency(
                    calculation.total_extras_cost
                  )}
                </strong>
              </div>

              <div className="breakdown-row">
                <span>Applicant 1 LHC loading</span>
                <strong>
                  {
                    calculation.applicant1_lhc_percentage
                  }
                  %
                </strong>
              </div>

              {requiresApplicant2 && (
                <div className="breakdown-row">
                  <span>Applicant 2 LHC loading</span>
                  <strong>
                    {
                      calculation.applicant2_lhc_percentage
                    }
                    %
                  </strong>
                </div>
              )}

              {formData.cover_type === "Family" && (
                <div className="breakdown-row">
                  <span>Family upgrade fee</span>
                  <strong>
                    {formatCurrency(
                      calculation.family_fee
                    )}
                  </strong>
                </div>
              )}

              {isYearly && (
                <>
                  <div className="breakdown-row">
                    <span>Annual discount</span>
                    <strong>
                      {calculation.annual_discount}%
                    </strong>
                  </div>

                  <div className="breakdown-row">
                    <span>Discount amount</span>
                    <strong>
                      −
                      {formatCurrency(
                        calculation.discount_amount
                      )}
                    </strong>
                  </div>
                </>
              )}
            </div>

            <div className="lhc-statement">
              Lifetime Health Cover loading applies only to
              hospital cover. It does not apply to extras cover.
            </div>

            {calculation.warnings.length > 0 && (
              <div className="warning-box">
                <h3>Warnings</h3>

                <ul>
                  {calculation.warnings.map(
                    (warning, index) => (
                      <li key={`${warning}-${index}`}>
                        {warning}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Final actions */}
        <div className="form-actions">
          <Link to="/" className="button secondary-button">
            Cancel
          </Link>

          <button
            type="button"
            className="button primary-button"
            onClick={handleSave}
            disabled={!calculation || saving}
          >
            {saving ? "Saving Quote..." : "Save Quote"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewQuotePage;