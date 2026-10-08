import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";

import type {
  RentalRequest,
  RentalResponse,
} from "../types/rentalRequest";


interface OwnerRequestActionsProps {
  request: RentalRequest;
  onChanged: () => void;
}

export default function OwnerRequestActions({
  request,
  onChanged,
}: OwnerRequestActionsProps) {
  const { token, logout } = useAuth();
  const [busy, setBusy] = useState<"approve" | "decline" | null>(null);
  const [error, setError] = useState("");

  async function handleAction(action: "approve" | "decline") {
    setError("");

    if (!token) {
      logout();
      return;
    }

    setBusy(action);

    try {
      await apiRequest<RentalResponse>(
        `/requests/${request._id}/${action}`,
        {
          method: "PATCH",
          token,
        }
      );

      onChanged();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update this request."
      );
    } finally {
      setBusy(null);
    }
  }

  if (request.status !== "pending") {
    return null;
  }

  return (
    <div>
      <div className="listing-actions">
        <button
          type="button"
          className="button button-primary"
          disabled={busy !== null}
          onClick={() => handleAction("approve")}
        >
          {busy === "approve" ? "Approving..." : "Approve"}
        </button>

        <button
          type="button"
          className="button button-danger"
          disabled={busy !== null}
          onClick={() => handleAction("decline")}
        >
          {busy === "decline" ? "Declining..." : "Decline"}
        </button>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}