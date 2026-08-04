import { NavLink, Route, Routes } from "react-router-dom";
import QuoteListPage from "./pages/QuoteListPage";
import NewQuotePage from "./pages/NewQuotePage";
import EditQuotePage from "./pages/EditQuotePage";
import ExplanationPage from "./pages/ExplanationPage";
import QuoteDetailPage from "./pages/QuoteDetailPage";

function App() {
  const getNavigationClass = ({ isActive }) =>
    isActive ? "nav-link active-nav-link" : "nav-link";

  return (
    <div className="app">
      <header className="main-header">
        <div className="brand-header">
          <div className="brand-header-content">
            <NavLink to="/" className="brand-area">
              <div className="brand-logo" aria-hidden="true">
                <svg
                  className="health-logo-svg"
                  viewBox="0 0 64 64"
                  role="img"
                  aria-label="HealthCoverSim logo"
                >
                  <defs>
                    <linearGradient
                      id="heartGradient"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="64"
                      y2="64"
                    >
                      <stop offset="0%" stopColor="#ffb2cf" />
                      <stop offset="35%" stopColor="#ff7fb2" />
                      <stop offset="70%" stopColor="#ff4f91" />
                      <stop offset="100%" stopColor="#e61b72" />
                    </linearGradient>
                  </defs>

                  <path
                    d="
                      M32 56
                      C29 52, 8 40, 8 23
                      C8 13, 15 7, 24 7
                      C29 7, 33 9, 36 14
                      C39 9, 44 7, 49 7
                      C58 7, 64 14, 64 23
                      C64 40, 43 52, 32 56
                      Z
                    "
                    fill="url(#heartGradient)"
                  />

                  <ellipse
                    cx="26"
                    cy="18"
                    rx="10"
                    ry="5"
                    fill="white"
                    opacity="0.16"
                  />

                  <rect
                    x="29.5"
                    y="20"
                    width="5"
                    height="22"
                    rx="2.5"
                    fill="white"
                  />

                  <rect
                    x="21"
                    y="28.5"
                    width="22"
                    height="5"
                    rx="2.5"
                    fill="white"
                  />
                </svg>
              </div>

              <span className="brand-copy">
                <strong>HealthCoverSim</strong>
                <small>Private Health Quote Simulator</small>
              </span>
            </NavLink>
          </div>
        </div>

        <div className="navigation-bar">
          <nav className="main-nav" aria-label="Primary navigation">
            <NavLink to="/" end className={getNavigationClass}>
              <span aria-hidden="true">▦</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/quotes/new"
              className={getNavigationClass}
            >
              <span aria-hidden="true">＋</span>
              New Quote
            </NavLink>

            <NavLink
              to="/explanation"
              className={getNavigationClass}
            >
              <span aria-hidden="true">ⓘ</span>
              Explanation
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<QuoteListPage />} />
          <Route path="/quotes/new" element={<NewQuotePage />} />
          <Route
            path="/quotes/:id"
            element={<QuoteDetailPage />}
          />
          <Route
            path="/quotes/:id/edit"
            element={<EditQuotePage />}
          />
          <Route
            path="/explanation"
            element={<ExplanationPage />}
          />
        </Routes>
      </main>
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">

            <h3>HealthCoverSim</h3>

            <p>Private Health Quote Simulator</p>
          </div>

          <div className="footer-divider"></div>

          <p className="footer-note">
            Educational Use Only • Learning Simulator
          </p>

          <p className="footer-copyright">
            Developed by Coral Jin • © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;