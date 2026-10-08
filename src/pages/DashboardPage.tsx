import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ToolCard from "../components/ToolCard";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type { Tool, ToolsResponse } from "../types/tool";
import DeleteToolButton from "../components/DeleteToolButton";
import RentalRequestsPanel from "../components/RentalRequestsPanel";



export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMyTools() {
      setLoading(true);
      setError("");

      try {
        if (!token) {
          throw new Error("Please log in to view your listings.");
        }

        const data = await apiRequest<ToolsResponse>("/tools/mine", {
          token,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setTools(data.tools);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          if (error instanceof ApiError && error.status === 401) {
            logout();
            return;
          }

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load your listings."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMyTools();

    return () => controller.abort();
  }, [token, attempt, logout]);

  return (
    <section>
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">YOUR TOOLSHARE</p>
          <h1>Welcome, {user?.name}.</h1>
          <p className="description">
            Manage the tools you share with your community.
          </p>
        </div>

        <Link to="/tools/new" className="button button-primary">
          List a Tool
        </Link>
      </div>

      <h2>My Listings</h2>

      {loading ? (
        <p role="status">Loading your listings...</p>
      ) : error ? (
        <div className="content-card">
          <p className="form-error" role="alert">
            {error}
          </p>
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
          <h2>Your first listing starts here.</h2>
          <p>Share a tool you own so someone else can put it to use.</p>
          <Link to="/tools/new" className="button button-primary">
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="tool-grid">
          {tools.map((tool) => (
            <div key={tool._id} className="dashboard-tool">
              <ToolCard tool={tool} />

              <Link
                to={`/tools/${tool._id}/edit`}
                className="button button-secondary"
              >
                Edit Listing
              </Link>

              <DeleteToolButton
                 toolId={tool._id}
                 toolName={tool.name}
                 onDeleted={(id) => {
                   setTools((current) => current.filter((item) => item._id !== id));
  }}
/>
            </div>
          ))}
        </div>
           )}

      <RentalRequestsPanel direction="outgoing" />
      <RentalRequestsPanel direction="incoming" />
    </section>
  );
}