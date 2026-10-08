import { useState } from "react";
import RentalRequestForm from "./RentalRequestForm";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type {
  RentalFormValues,
  RentalRequest,
  RentalResponse,
} from "../types/rentalRequest";

interface EditRentalRequestProps {
  request: RentalRequest;
  onChanged: () => void;
}

export default function EditRentalRequest({
  request,
  onChanged,
}: EditRentalRequestProps) {
  const { token, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(values: RentalFormValues) {
    setError("");

    if (!token) {
      logout();
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest<RentalResponse>(
        `/requests/${request._id}`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify(values),
        }
      );

      setEditing(false);
      onChanged();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (request.status !== "pending") {
    return null;
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="button button-secondary"
        onClick={() => {
          setError("");
          setEditing(true);
        }}
      >
        Edit Request
      </button>
    );
  }

  return (
    <div className="request-edit-form">
      <h4>Edit your request</h4>

      <RentalRequestForm
        initialValues={{
          startDate: request.startDate.slice(0, 10),
          endDate: request.endDate.slice(0, 10),
          message: request.message,
        }}
        submitting={submitting}
        error={error}
        submitLabel="Save Request"
        onSubmit={handleSave}
      />

      <button
        type="button"
        className="button button-secondary"
        disabled={submitting}
        onClick={() => setEditing(false)}
      >
        Cancel Editing
      </button>
    </div>
  );
}