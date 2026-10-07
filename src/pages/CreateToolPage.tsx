import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ToolForm from "../components/ToolForm";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type { ToolFormValues, ToolResponse } from "../types/tool";

export default function CreateToolPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(values: ToolFormValues) {
    setError("");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setSubmitting(true);

    try {
      const data = await apiRequest<ToolResponse>("/tools", {
        method: "POST",
        token,
        body: JSON.stringify(values),
      });

      navigate(`/tools/${data.tool._id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your listing."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="listing-page">
      <Link to="/tools" className="back-link">
        ← Back to Tools
      </Link>

      <div className="content-card listing-form-card">
        <p className="eyebrow">PUT YOUR TOOLS TO WORK</p>
        <h1>Create a listing.</h1>
        <p className="description">
          Share the details so neighbors can find the right tool.
        </p>

        <ToolForm
          submitting={submitting}
          error={error}
          submitLabel="Create Listing"
          onSubmit={handleCreate}
        />
      </div>
    </section>
  );
}