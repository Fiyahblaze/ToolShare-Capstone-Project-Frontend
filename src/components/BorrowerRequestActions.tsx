import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type { RentalRequest } from "../types/rentalRequest";

interface BorrowerRequestActionsProps {
  request: RentalRequest;
  onChanged: () => void;
}

export default function BorrowerRequestActions({
  request,
  onChanged,
}: BorrowerRequestActionsProps) {
  const { token, logout } = useAuth();
  const [confirming, setConfirming] = useState<
    "cancel" | "delete" | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!confirming) return;

    setError("");

    if (!token) {
      logout();
      return;
    }

    setBusy(true);

    try {
      const path =
        confirming === "cancel"
          ? `/requests/${request._id}/cancel`
          : `/requests/${request._id}`;

      await apiRequest<unknown>(path, {
        method: confirming === "cancel" ? "PATCH" : "DELETE",
        token,
      });

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
      setBusy(false);
    }
  }

  if (request.status !== "pending") {
    return null;
  }

  return (
    <div className="borrower-actions">
      {confirming ? (
        <>
          <p>
            {confirming === "cancel"
              ? "Cancel this request? It will remain in your history."
              : "Delete this request permanently? This cannot be undone."}
          </p>

          <div className="listing-actions">
            <button
              type="button"
              className="button button-danger"
              disabled={busy}
              onClick={handleConfirm}
            >
              {busy
                ? "Saving..."
                : confirming === "cancel"
                  ? "Confirm Cancel"
                  : "Confirm Delete"}
            </button>

            <button
              type="button"
              className="button button-secondary"
              disabled={busy}
              onClick={() => {
                setConfirming(null);
                setError("");
              }}
            >
              Keep Request
            </button>
          </div>
        </>
      ) : (
        <div className="listing-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setConfirming("cancel")}
          >
            Cancel Request
          </button>

          <button
            type="button"
            className="button button-danger"
            onClick={() => setConfirming("delete")}
          >
            Delete Request
          </button>
        </div>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}