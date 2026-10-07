import { Link, NavLink, Outlet } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Layout() {
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
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/register" className="button button-primary">
              Sign Up
            </NavLink>
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