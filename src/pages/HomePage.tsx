import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="welcome-card">
      <p className="eyebrow">TOOLS FOR YOUR NEXT PROJECT</p>
      <h1>Share tools. Build more.</h1>
      <p className="description">
        Find tools in your community, save on your next project, and put
        the equipment you already own to work.
      </p>

      <div className="hero-actions">
        <Link to="/tools" className="button button-primary">
          Browse Tools
        </Link>
        <Link to="/register" className="button button-secondary">
          Join ToolShare
        </Link>
      </div>
    </section>
  );
}