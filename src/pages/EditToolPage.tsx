import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToolForm from "../components/ToolForm";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type {
  Tool,
  ToolFormValues,
  ToolResponse,
} from "../types/tool";

export default function EditToolPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTool() {
      setLoading(true);
      setLoadError("");
      setTool(null);

      try {
        if (!id) {
          throw new Error("Tool ID is missing.");
        }

        const data = await apiRequest<ToolResponse>(
          `/tools/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const ownerId =
          typeof data.tool.owner === "string"
            ? data.tool.owner
            : data.tool.owner?._id;

        if (ownerId !== user?._id) {
          throw new Error("You can only edit your own listings.");
        }

        if (!controller.signal.aborted) {
          setTool(data.tool);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load this listing."
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
  }, [id, user?._id]);

  async function handleSave(values: ToolFormValues) {
    setSaveError("");

    if (!token) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    if (!id) {
      setSaveError("Tool ID is missing.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await apiRequest<ToolResponse>(
        `/tools/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify(values),
        }
      );

      navigate(`/tools/${data.tool._id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to update your listing."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="listing-page">
      <Link to="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      {loading ? (
        <p role="status">Loading your listing...</p>
      ) : loadError ? (
        <div className="content-card">
          <p className="form-error" role="alert">{loadError}</p>
        </div>
      ) : tool ? (
        <div className="content-card listing-form-card">
          <p className="eyebrow">MANAGE YOUR LISTING</p>
          <h1>Edit your tool.</h1>
          <p className="description">
            Keep your tool details and availability up to date.
          </p>

          <ToolForm
            key={tool._id}
            initialValues={{
              name: tool.name,
              description: tool.description,
              category: tool.category,
              condition: tool.condition,
              dailyRate: tool.dailyRate,
              location: tool.location,
              imageUrl: tool.imageUrl,
              available: tool.available,
            }}
            submitting={submitting}
            error={saveError}
            submitLabel="Save Changes"
            onSubmit={handleSave}
          />
        </div>
      ) : (
        <p>Listing not found.</p>
      )}
    </section>
  );
}