import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const QUOTES_API = "http://localhost:3001/api/quotes";
const CALCULATE_API = "http://localhost:3001/api/calculate";

function QuoteDetailPage() {
  const { id } = useParams();

  const [quote, setQuote] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });

  useEffect(() => {
    const loadQuote = async () => {
      try {
        setLoading(true);
        setError("");

        // Retrieve the saved quote.
        const quoteResponse = await axios.get(
          `${QUOTES_API}/${id}`
        );

        const savedQuote = quoteResponse.data;
        setQuote(savedQuote);

        // Reuse the backend calculator to produce the breakdown.
        const calculationResponse = await axios.post(
          CALCULATE_API,
          {
            customer_name: savedQuote.customer_name,
            cover_type: savedQuote.cover_type,
            applicant1_age: savedQuote.applicant1_age,
            applicant1_cover_history:
              savedQuote.applicant1_cover_history,
            applicant2_age: savedQuote.applicant2_age,
            applicant2_cover_history:
              savedQuote.applicant2_cover_history,
            hospital_cover: savedQuote.hospital_cover,
            extras_cover: savedQuote.extras_cover,
            payment_frequency:
              savedQuote.payment_frequency,
            annual_discount:
              savedQuote.annual_discount,
            notes: savedQuote.notes || "",
          }
        );

        setCalculation(
          calculationResponse.data.calculation
        );
      } catch (requestError) {
        console.error(requestError);

        setError(
          requestError.response?.data?.error ||
            "Unable to load this quote."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [id]);

  if (loading) {
    return (
      <p className="status-message">
        Loading quote explanation...
      </p>
    );
  }

  if (error) {
    return (
      <section>
        <div className="alert error-alert">{error}</div>

        <Link to="/" className="button secondary-button">
          Back to Quotes
        </Link>
      </section>
    );
  }

  if (!quote || !calculation) {
    return null;
  }

  const isYearly =
    quote.payment_frequency === "Yearly";

  const hasApplicant2 =
    quote.cover_type === "Couple" ||
    quote.cover_type === "Family";

  return (
    <section className="detail-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Quote #{quote.id}
          </p>

          <h1>{quote.customer_name}</h1>

          <p className="page-description">
            Detailed health insurance quote explanation.
          </p>
        </div>

        <div className="detail-page-actions">
          <Link
            to={`/quotes/${quote.id}/edit`}
            className="button secondary-button"
          >
            Edit Quote
          </Link>

          <Link
            to="/"
            className="button primary-button"
          >
            Back to Quotes
          </Link>
        </div>
      </div>

      {/* Main premium summary */}
      <section className="detail-summary-card">
        <div className="detail-summary-heading">
          <div>
            <p className="eyebrow">
              Premium estimate
            </p>

            <h2>Estimated Health Cover Premium</h2>
          </div>

          <span className="cover-type-badge">
            {quote.cover_type}
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
      </section>

      <div className="detail-grid">
        {/* Customer and cover details */}
        <section className="detail-card">
          <h2>Quote Information</h2>

          <div className="detail-list">
            <div className="detail-row">
                <span>Quote ID</span>
                <strong>#{quote.id}</strong>
            </div>

            <div className="detail-row">
                <span>Created date</span>
                <strong>
                    {quote.created_at
                      ? new Date(quote.created_at).toLocaleString("en-AU")
                      : "Not available"}
                </strong>
            </div>

            <div className="detail-row">
              <span>Customer name</span>
              <strong>{quote.customer_name}</strong>
            </div>

            <div className="detail-row">
              <span>Cover type</span>
              <strong>{quote.cover_type}</strong>
            </div>

            <div className="detail-row">
              <span>Hospital cover</span>
              <strong>{quote.hospital_cover}</strong>
            </div>

            <div className="detail-row">
              <span>Extras cover</span>
              <strong>{quote.extras_cover}</strong>
            </div>

            <div className="detail-row">
              <span>Payment frequency</span>
              <strong>
                {quote.payment_frequency}
              </strong>
            </div>

            <div className="detail-row">
              <span>Annual discount</span>
              <strong>
                {isYearly
                  ? `${calculation.annual_discount}%`
                  : "Not applied"}
              </strong>
            </div>
          </div>
        </section>

        {/* Applicant information */}
        <section className="detail-card">
          <h2>Applicant Information</h2>

          <div className="applicant-detail-block">
            <h3>Primary Applicant</h3>

            <div className="detail-list">
              <div className="detail-row">
                <span>Age</span>
                <strong>
                  {quote.applicant1_age}
                </strong>
              </div>

              <div className="detail-row">
                <span>Hospital cover history</span>
                <strong>
                  {
                    quote.applicant1_cover_history
                  }
                </strong>
              </div>

              <div className="detail-row">
                <span>LHC loading</span>
                <strong>
                  {
                    calculation.applicant1_lhc_percentage
                  }
                  %
                </strong>
              </div>

              <div className="detail-row">
                <span>Hospital cost</span>
                <strong>
                  {formatCurrency(
                    calculation.applicant1_hospital_cost
                  )}
                </strong>
              </div>
            </div>
          </div>

          {hasApplicant2 && (
            <div className="applicant-detail-block">
              <h3>Secondary Applicant</h3>

              <div className="detail-list">
                <div className="detail-row">
                  <span>Age</span>
                  <strong>
                    {quote.applicant2_age}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>
                    Hospital cover history
                  </span>

                  <strong>
                    {
                      quote.applicant2_cover_history
                    }
                  </strong>
                </div>

                <div className="detail-row">
                  <span>LHC loading</span>

                  <strong>
                    {
                      calculation.applicant2_lhc_percentage
                    }
                    %
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Hospital cost</span>

                  <strong>
                    {formatCurrency(
                      calculation.applicant2_hospital_cost
                    )}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Full premium calculation */}
      <section className="detail-card full-detail-card">
        <h2>Premium Breakdown</h2>

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

          {quote.cover_type === "Family" && (
            <div className="breakdown-row">
              <span>Family upgrade fee</span>

              <strong>
                {formatCurrency(
                  calculation.family_fee
                )}
              </strong>
            </div>
          )}

          <div className="breakdown-row total-row">
            <span>Monthly premium</span>

            <strong>
              {formatCurrency(
                calculation.monthly_premium
              )}
            </strong>
          </div>

          <div className="breakdown-row">
            <span>Yearly before discount</span>

            <strong>
              {formatCurrency(
                calculation.yearly_before_discount
              )}
            </strong>
          </div>

          {isYearly && (
            <>
              <div className="breakdown-row">
                <span>
                  Annual discount (
                  {calculation.annual_discount}%)
                </span>

                <strong>
                  −
                  {formatCurrency(
                    calculation.discount_amount
                  )}
                </strong>
              </div>

              <div className="breakdown-row final-total-row">
                <span>Final yearly premium</span>

                <strong>
                  {formatCurrency(
                    calculation.yearly_premium
                  )}
                </strong>
              </div>
            </>
          )}
        </div>

        <div className="plain-explanation">
            <h3>How this quote was calculated</h3>

            <div className="explanation-item">
                <strong>1. Hospital premium</strong>
                <p>
                Hospital cover was calculated separately for each adult.
                Any applicable Lifetime Health Cover loading was added only
                to that applicant’s hospital premium.
                </p>
            </div>

            <div className="explanation-item">
                <strong>2. Extras premium</strong>
                <p>
                The selected extras price was multiplied by{" "}
                {calculation.adult_count} adult
                {calculation.adult_count === 1 ? "" : "s"}.
                </p>
            </div>

            {quote.cover_type === "Family" && (
                <div className="explanation-item">
                <strong>3. Family upgrade fee</strong>
                <p>
                    A $30 monthly Family upgrade fee was added once.
                    Children are not priced individually in this simulator.
                </p>
                </div>
            )}

            <div className="explanation-item">
                <strong>
                {quote.cover_type === "Family" ? "4" : "3"}. Yearly premium
                </strong>
                <p>
                The monthly premium was multiplied by 12 to calculate the
                yearly premium before discount.
                {isYearly
                    ? ` A ${calculation.annual_discount}% annual-payment discount was then applied.`
                    : " No annual discount was applied because Monthly payment was selected."}
                </p>
            </div>
        </div>


        <div className="lhc-statement">
          Lifetime Health Cover loading applies only to
          hospital cover. It does not apply to extras
          cover.
        </div>

        {calculation.warnings.length > 0 ? (
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
        ) : (
          <div className="success-box">
            <strong>No calculation warnings.</strong>
            <p>
                The supplied information was sufficient to calculate this estimate without an LHC uncertainty warning.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}

export default QuoteDetailPage;