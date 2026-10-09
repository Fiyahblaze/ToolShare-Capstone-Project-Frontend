import { Link } from "react-router-dom";
import { ArrowRight, Coins, Users, Wrench } from "lucide-react";
import ToolIllustration from "../components/ToolIllustration";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="welcome-card home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">TOOLS FOR YOUR NEXT PROJECT</p>

          <h1>Share tools. Build more.</h1>

          <p className="description">
            Find tools in your community, save on your next project,
            and put the equipment you already own to work.
          </p>

          <div className="hero-actions">
            <Link to="/tools" className="button button-primary">
              Browse Tools
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link to="/register" className="button button-secondary">
              Join ToolShare
            </Link>
          </div>

          <p className="hero-note">
            Less buying. More building. Tools worth sharing.
          </p>
        </div>

        <div className="hero-tool-display">
          <ToolIllustration />

          <div className="hero-tool-caption">
            <span className="eyebrow">MAKE YOUR NEXT PROJECT POSSIBLE</span>
            <h2>The right tool, without owning every tool.</h2>
            <p>Browse community listings to find what you need.</p>
          </div>
        </div>
      </section>

      <section className="home-benefits" aria-labelledby="benefits-heading">
        <div className="home-section-heading">
          <p className="eyebrow">A LITTLE SHARING GOES A LONG WAY</p>
          <h2 id="benefits-heading">Good for your project. Good for your community.</h2>
        </div>

        <div className="benefit-grid">
          <article className="benefit-card">
            <span className="benefit-icon">
              <Coins size={25} aria-hidden="true" />
            </span>
            <h3>Spend less on equipment</h3>
            <p>
              Find tools for occasional projects without paying the
              full cost of buying them.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon">
              <Wrench size={25} aria-hidden="true" />
            </span>
            <h3>Put your tools to work</h3>
            <p>
              Offer equipment you already own for free or at a daily
              rate you choose.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon">
              <Users size={25} aria-hidden="true" />
            </span>
            <h3>Keep sharing organized</h3>
            <p>
              Manage your listings and track incoming and outgoing
              requests from one dashboard.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}