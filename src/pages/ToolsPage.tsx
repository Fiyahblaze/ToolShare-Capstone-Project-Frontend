import { useEffect, useState } from "react";
import ToolCard from "../components/ToolCard";
import { apiRequest } from "../services/api";
import type { Tool, ToolsResponse } from "../types/tool";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTools() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest<ToolsResponse>("/tools", {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setTools(data.tools);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load tools."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTools();

    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="tools-page">
      <div className="page-heading">
        <p className="eyebrow">BORROW LOCAL. BUILD MORE.</p>
        <h1>Find your next tool.</h1>
        <p className="description">
          Explore tools shared by people in your community.
        </p>
      </div>

      {loading ? (
        <p role="status">Loading tools...</p>
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
      ) : tools.length === 0 ? (
        <div className="content-card">
          <h2>No tools listed yet.</h2>
          <p>Check back soon for tools shared by your community.</p>
        </div>
      ) : (
        <div className="tool-grid">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}