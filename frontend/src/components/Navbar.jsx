import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <NavLink to="/dashboard">
          FocusFlow
        </NavLink>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/journal">Journal</NavLink>
      </nav>

      <div className="navbar-user">
        <span>{user?.name}</span>

        <button
          type="button"
          className="button button-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}