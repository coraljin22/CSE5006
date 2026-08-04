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
        <div className="header-content">
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
                    id="heartGradient" gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="0"
                    x2="64"
                    y2="64"
                  >
                    <stop offset="0%" stopColor="#f292b3" />
                    <stop offset="34%" stopColor="#d55e86" />
                    <stop offset="68%" stopColor="#c82f62" />
                    <stop offset="100%" stopColor="#9c0e50" />
                  </linearGradient>
                </defs>

                <path
                  className="health-heart"
                  d="M32 56
                     C29 52, 8  40, 8  23
                     C8 13 , 15 7 , 24 7
                     C29 7 , 33 9 , 36 14
                     C39 9 , 44 7 , 49 7
                     C58 7 , 62 14, 64 23
                     C64 40, 43 52, 32 56
                     Z" fill="url(#heartGradient)" />
                <ellipse cx="26" cy="18" rx="10" ry="5" fill="white" opacity="0.18" />
                <rect x="29.5" y="20" width="5" height="22" rx="2.5" fill="#ffffff" />
                <rect x="21" y="28.5" width="22" height="5" rx="2.5" fill="#ffffff" />
              </svg>
            </div>

            <span className="brand-copy">
              <strong>HealthCoverSim</strong>
              <small>Private Health Quote Simulator</small>
            </span>
          </NavLink>

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

          <div className="header-status">
            <span className="status-dot" />
            Learning Simulator
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<QuoteListPage />} />

          <Route
            path="/quotes/new"
            element={<NewQuotePage />}
          />

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
          <p>
            HealthCoverSim is a learning simulator only. It does not
            provide financial advice.
          </p>

          <span>CSE5006 · Semester 2, 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;