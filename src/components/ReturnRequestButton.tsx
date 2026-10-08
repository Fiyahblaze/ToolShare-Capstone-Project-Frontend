import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import type {
  RentalRequest,
  RentalResponse,
} from "../types/rentalRequest";

interface ReturnRequestButtonProps {
  request: RentalRequest;
  onChanged: () => void;
}

export default function ReturnRequestButton({
  request,
  onChanged,
}: ReturnRequestButtonProps) {
  const { token, logout } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleReturn() {
    setBusy(true);
    setError("");

    try {
      if (!token) {
        logout();
        return;
      }

      await apiRequest<RentalResponse>(
        `/requests/${request._id}/return`,
        {
          method: "PATCH",
          token,
        }
      );

      setConfirming(false);
      onChanged();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to confirm the return."
      );
    } finally {
      setBusy(false);
    }
  }

  if (request.status !== "approved") {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  if (request.startDate.slice(0, 10) > today) {
    return (
      <p className="description">
        Return confirmation becomes available on the rental start date.
      </p>
    );
  }

  return (
    <div className="borrower-actions">
      {confirming ? (
        <>
          <p>Have you received your tool back from the borrower?</p>

          <div className="button-group">
            <button
              type="button"
              className="button button-primary"
              disabled={busy}
              onClick={() => void handleReturn()}
            >
              {busy ? "Confirming..." : "Yes, Tool Returned"}
            </button>

            <button
              type="button"
              className="button button-secondary"
              disabled={busy}
              onClick={() => {
                setConfirming(false);
                setError("");
              }}
            >
              Go Back
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            setConfirming(true);
            setError("");
          }}
        >
          Confirm Return
        </button>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}