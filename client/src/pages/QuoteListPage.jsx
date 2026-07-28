import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/api/quotes";

function QuoteListPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <p className="status-message">Loading quotes...</p>;
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Health insurance quotation system</p>
          <h1>Customer Quotes</h1>
          <p className="page-description">
            View, create, edit and remove saved health cover quotations.
          </p>
        </div>

        <Link to="/quotes/new" className="button primary-button">
          + New Quote
        </Link>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {!error && quotes.length === 0 ? (
        <div className="empty-state">
          <h2>No quotes found</h2>
          <p>Create your first health cover quotation.</p>
          <Link to="/quotes/new" className="button primary-button">
            Create Quote
          </Link>
        </div>
      ) : (
        !error && (
          <div className="table-container">
            <table className="quote-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td>#{quote.id}</td>
                    <td>{quote.customer_name}</td>
                    <td>{quote.cover_type}</td>
                    <td>{quote.hospital_cover}</td>
                    <td>{quote.extras_cover}</td>
                    <td>
                      ${Number(quote.monthly_premium || 0).toFixed(2)}
                    </td>
                    <td>{quote.payment_frequency}</td>
                    <td>
                      <div className="action-buttons">
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
                            handleDelete(quote.id, quote.customer_name)
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
        )
      )}
    </section>
  );
}

export default QuoteListPage;