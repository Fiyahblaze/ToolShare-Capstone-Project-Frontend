import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="content-card">
      <p className="eyebrow">404 — PAGE NOT FOUND</p>
      <h1>Let’s get you back on track.</h1>
      <p className="description">
        The page you’re looking for could not be found.
      </p>
      <Link to="/" className="button button-primary">
        Back to Home
      </Link>
    </section>
  );
}