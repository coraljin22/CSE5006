import { Link, Route, Routes } from "react-router-dom";
import QuoteListPage from "./pages/QuoteListPage";
import NewQuotePage from "./pages/NewQuotePage";
import EditQuotePage from "./pages/EditQuotePage";
import QuoteDetailPage from "./pages/QuoteDetailPage";
import ExplanationPage from "./pages/ExplanationPage";

function App() {
  return (
    <div className="app">
      <header className="main-header">
        <div className="header-content">
          <Link to="/" className="logo">
            HealthCoverSim
          </Link>

          <nav className="main-nav">
            <Link to="/">Quotes</Link>
            <Link to="/quotes/new">New Quote</Link>
            <Link to="/explanation">Explanation Sheet</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<QuoteListPage />} />
          <Route path="/quotes/new" element={<NewQuotePage />} />
          <Route path="/quotes/:id" element={<QuoteDetailPage />} />
          <Route path="/quotes/:id/edit" element={<EditQuotePage />} />
          <Route path="/explanation" element={<ExplanationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;