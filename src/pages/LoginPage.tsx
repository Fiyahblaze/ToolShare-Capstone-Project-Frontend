import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to log in."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p role="status">Checking your session...</p>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">WELCOME TO TOOLSHARE</p>
      <h1>Welcome back.</h1>
      <p className="description">
        Log in to manage your tools and rental requests.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={submitting}
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button button-primary"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="auth-switch">
        New to ToolShare? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}