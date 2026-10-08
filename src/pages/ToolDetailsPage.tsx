import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Wrench } from "lucide-react";
import { apiRequest } from "../services/api";
import type { Tool, ToolResponse } from "../types/tool";
import RequestToolPanel from "../components/RequestToolPanel";


export default function ToolDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTool() {
      setLoading(true);
      setError("");
      setTool(null);
      setImageFailed(false);

      try {
        if (!id) {
          throw new Error("Tool ID is missing.");
        }

        const data = await apiRequest<ToolResponse>(
          `/tools/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        if (!controller.signal.aborted) {
          setTool(data.tool);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load this tool."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTool();

    return () => controller.abort();
  }, [id, attempt]);

  return (
    <section className="tool-details-page">
      <Link to="/tools" className="back-link">
        ← Back to Tools
      </Link>

      {loading ? (
        <p role="status">Loading tool...</p>
      ) : error ? (
        <div className="content-card">
          <p className="form-error" role="alert">{error}</p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try Again
          </button>
        </div>
      ) : tool ? (
        <article className="tool-details">
          <div className="tool-image tool-details-image">
            {tool.imageUrl && !imageFailed ? (
              <img
                src={tool.imageUrl}
                alt={tool.name}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Wrench size={80} aria-hidden="true" />
            )}
          </div>

          <div className="tool-details-body">
            <p className="eyebrow">{tool.category}</p>
            <h1>{tool.name}</h1>

            <span
              className={`availability ${
                tool.available ? "available" : "unavailable"
              }`}
            >
              {tool.available ? "Available" : "Unavailable"}
            </span>

            <p className="tool-description">{tool.description}</p>

            <dl className="tool-facts">
              <div>
                <dt>Daily Rate</dt>
                <dd>
                  {tool.dailyRate === 0
                    ? "Free"
                    : `$${tool.dailyRate.toFixed(2)}`}
                </dd>
              </div>

              <div>
                <dt>Condition</dt>
                <dd>{tool.condition}</dd>
              </div>

              <div>
                <dt>Location</dt>
                <dd>{tool.location}</dd>
              </div>

              <div>
                <dt>Owner</dt>
                <dd>
                  {typeof tool.owner === "object" && tool.owner !== null
                    ? tool.owner.name
                    : "ToolShare member"}
                </dd>
              </div>
            </dl>

            <RequestToolPanel key={tool._id} tool={tool} />
          </div>
        </article>
      ) : (
        <p>Tool not found.</p>
      )}
    </section>
  );
}