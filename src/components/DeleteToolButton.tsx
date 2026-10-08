import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";


interface DeleteToolButtonProps {
  toolId: string;
  toolName: string;
  onDeleted: (id: string) => void;
}

export default function DeleteToolButton({
  toolId,
  toolName,
  onDeleted,
}: DeleteToolButtonProps) {
  const { token, logout } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");

    if (!token) {
      logout();
      return;
    }

    setDeleting(true);

    try {
      await apiRequest<{ message: string }>(
        `/tools/${encodeURIComponent(toolId)}`,
        {
          method: "DELETE",
          token,
        }
      );

      onDeleted(toolId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete this listing."
      );
      setDeleting(false);
    }
  }

  return (
    <div className="delete-listing">
      {confirming ? (
        <>
          <p>Delete “{toolName}”? This cannot be undone.</p>

          <div className="listing-actions">
            <button
              type="button"
              className="button button-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>

            <button
              type="button"
              className="button button-secondary"
              disabled={deleting}
              onClick={() => {
                setConfirming(false);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="button button-danger"
          onClick={() => setConfirming(true)}
        >
          Delete Listing
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