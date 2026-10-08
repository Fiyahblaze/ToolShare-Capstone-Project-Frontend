import { useState } from "react";
import { Link } from "react-router-dom";
import RentalRequestForm from "./RentalRequestForm";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type { Tool } from "../types/tool";
import type {
  RentalFormValues,
  RentalResponse,
} from "../types/rentalRequest";

export default function RequestToolPanel({ tool }: { tool: Tool }) {
  const { user, token, loading, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const ownerId =
    typeof tool.owner === "string" ? tool.owner : tool.owner?._id;

  async function handleRequest(values: RentalFormValues) {
    setError("");

    if (!token) {
      logout();
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest<RentalResponse>("/requests", {
        method: "POST",
        token,
        body: JSON.stringify({
          toolId: tool._id,
          ...values,
        }),
      });

      setSuccess(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p role="status">Checking your session...</p>;
  }

  if (user?._id === ownerId) {
    return (
      <section className="request-panel">
        <h2>This is your listing.</h2>
        <Link
          to={`/tools/${tool._id}/edit`}
          className="button button-secondary"
        >
          Edit Listing
        </Link>
      </section>
    );
  }

  if (!tool.available) {
    return (
      <section className="request-panel">
        <h2>Currently unavailable</h2>
        <p>This tool is not accepting new rental requests.</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="request-panel">
        <h2>Interested in this tool?</h2>
        <p>Log in to send a rental request to the owner.</p>
        <Link to="/login" className="button button-primary">
          Log In to Request
        </Link>
      </section>
    );
  }

  if (success) {
    return (
      <section className="request-panel">
        <h2 role="status">Your request was submitted.</h2>
        <p>The owner will review your requested dates.</p>
        <Link to="/dashboard" className="button button-primary">
          Go to Dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="request-panel">
      <h2>Request this tool</h2>
      <p>Choose your dates and send the owner a message.</p>

      <RentalRequestForm
        submitting={submitting}
        error={error}
        submitLabel="Send Rental Request"
        onSubmit={handleRequest}
      />
    </section>
  );
}