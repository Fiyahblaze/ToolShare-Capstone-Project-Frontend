import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Wrench } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/" className="brand brand-link">
            <Wrench size={26} aria-hidden="true" />
            ToolShare
          </Link>

          <div className="nav-links">
            <NavLink to="/tools">Browse Tools</NavLink>

            {loading ? (
              <span role="status">Checking session...</span>
            ) : user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log In</NavLink>
                <NavLink
                  to="/register"
                  className="button button-primary"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="page-container">
        <Outlet />
      </main>

      <footer className="site-footer">
        ToolShare · Tools for your projects. Connections in your community.
      </footer>
    </>
  );
}