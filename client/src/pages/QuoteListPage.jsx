import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const API_URL = "http://localhost:3001/api/quotes";

function QuoteListPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setQuotes(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError(
        "Unable to load quotes. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDelete = async (id, customerName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the quote for ${customerName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      setQuotes((currentQuotes) =>
        currentQuotes.filter((quote) => quote.id !== id)
      );
    } catch (requestError) {
      console.error(requestError);
      alert("Unable to delete this quote.");
    }
  };

  const filteredQuotes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return quotes;
    }

    return quotes.filter((quote) => {
      return [
        quote.customer_name,
        quote.cover_type,
        quote.hospital_cover,
        quote.extras_cover,
        quote.payment_frequency,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [quotes, searchTerm]);

  const statistics = useMemo(() => {
    const totalQuotes = quotes.length;

    const totalMonthlyPremium = quotes.reduce(
      (sum, quote) => sum + Number(quote.monthly_premium || 0),
      0
    );

    const averageMonthlyPremium =
      totalQuotes > 0 ? totalMonthlyPremium / totalQuotes : 0;

    const yearlyQuotes = quotes.filter(
      (quote) => quote.payment_frequency === "Yearly"
    ).length;

    const familyQuotes = quotes.filter(
      (quote) => quote.cover_type === "Family"
    ).length;

    return {
      totalQuotes,
      averageMonthlyPremium,
      yearlyQuotes,
      familyQuotes,
    };
  }, [quotes]);

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });

  const getInitials = (name) => {
    if (!name) {
      return "?";
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const getCoverBadgeClass = (coverType) => {
    if (coverType === "Family") {
      return "badge badge-family";
    }

    if (coverType === "Couple") {
      return "badge badge-couple";
    }

    return "badge badge-single";
  };

  const getPaymentBadgeClass = (paymentFrequency) => {
    return paymentFrequency === "Yearly"
      ? "badge badge-yearly"
      : "badge badge-monthly";
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading saved quotations...</p>
      </div>
    );
  }

  return (
    <section className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow dashboard-eyebrow">
            Health insurance quotation system
          </p>

          <h1>Customer Quote Dashboard</h1>

          <p>
            Create, compare and manage estimated private health
            insurance quotations from one clear workspace.
          </p>
        </div>

        <Link to="/quotes/new" className="button dashboard-create-button">
          <span aria-hidden="true">＋</span>
          Create New Quote
        </Link>
      </section>

      {error && <div className="alert error-alert">{error}</div>}

      {!error && (
        <>
          <section className="dashboard-stat-grid">
            <article className="dashboard-stat-card stat-card-default">
              <div className="dashboard-stat-icon">📄</div>

              <div>
                <span>Total Quotes</span>
                <strong>{statistics.totalQuotes}</strong>
                <small>Saved quotation records</small>
              </div>
            </article>

            <article className="dashboard-stat-card stat-card-default">
              <div className="dashboard-stat-icon">💰</div>

              <div>
                <span>Average Monthly</span>
                <strong>
                  {formatCurrency(statistics.averageMonthlyPremium)}
                </strong>
                <small>Across all saved quotes</small>
              </div>

              <div className="stat-watermark average-watermark" aria-hidden="true">
              </div>
            </article>

            <article className="dashboard-stat-card stat-card-default">
              <div className="dashboard-stat-icon">📅</div>

              <div>
                <span>Yearly Payment</span>
                <strong>{statistics.yearlyQuotes}</strong>
                <small>Quotes using annual payment</small>
              </div>
            </article>

            <article className="dashboard-stat-card stat-card-default">
              <div className="dashboard-stat-icon">👨‍👩‍👧‍👦</div>

              <div>
                <span>Family Cover</span>
                <strong>{statistics.familyQuotes}</strong>
                <small>Quotes with family upgrade</small>
              </div>

              <div className="stat-watermark family-watermark" aria-hidden="true">
              </div>
            </article>
          </section>

          <section className="dashboard-table-card">
            <div className="dashboard-table-header">
              <div>
                <p className="eyebrow">Saved records</p>
                <h2>Customer Quotations</h2>
                <p>
                  Review quote details, update cover selections or
                  remove outdated records.
                </p>
              </div>

              <div className="quote-search">
                <span aria-hidden="true">⌕</span>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search customer or cover..."
                  aria-label="Search quotations"
                />
              </div>
            </div>

            {quotes.length === 0 ? (
              <div className="empty-state enhanced-empty-state">
                <div className="empty-state-icon">📋</div>
                <h2>No quotes found</h2>
                <p>
                  Create your first health cover quotation to start
                  building the dashboard.
                </p>

                <Link
                  to="/quotes/new"
                  className="button primary-button"
                >
                  Create First Quote
                </Link>
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="empty-state enhanced-empty-state">
                <div className="empty-state-icon">🔎</div>
                <h2>No matching quotes</h2>
                <p>
                  Try searching with another customer name, cover type
                  or payment frequency.
                </p>

                <button
                  type="button"
                  className="button secondary-button"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="table-container dashboard-table-container">
                <table className="quote-table dashboard-quote-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Cover Type</th>
                      <th>Hospital</th>
                      <th>Extras</th>
                      <th>Monthly Premium</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredQuotes.map((quote) => (
                      <tr key={quote.id}>
                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">
                              {getInitials(quote.customer_name)}
                            </div>

                            <div>
                              <strong>{quote.customer_name}</strong>
                              <span>Quote #{quote.id}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={getCoverBadgeClass(
                              quote.cover_type
                            )}
                          >
                            {quote.cover_type}
                          </span>
                        </td>

                        <td>
                          <strong>{quote.hospital_cover}</strong>
                        </td>

                        <td>
                          <strong>{quote.extras_cover}</strong>
                        </td>

                        <td>
                          <div className="premium-table-value">
                            <strong>
                              {formatCurrency(
                                quote.monthly_premium
                              )}
                            </strong>
                            <span>per month</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={getPaymentBadgeClass(
                              quote.payment_frequency
                            )}
                          >
                            {quote.payment_frequency}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/quotes/${quote.id}`}
                              className="button view-button small-button"
                            >
                              <FaEye />
                            </Link>

                            <Link
                              to={`/quotes/${quote.id}/edit`}
                              className="button secondary-button small-button"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="button danger-button small-button"
                              onClick={() =>
                                handleDelete(
                                  quote.id,
                                  quote.customer_name
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default QuoteListPage;