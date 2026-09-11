import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-center">
      <div className="auth-card">
        <h1>Page not found</h1>

        <p className="muted">
          The page you requested does not exist.
        </p>

        <Link className="button button-primary" to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}