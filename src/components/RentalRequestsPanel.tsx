import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ApiError, apiRequest } from "../services/api";
import OwnerRequestActions from "./OwnerRequestActions";
import BorrowerRequestActions from "./BorrowerRequestActions";
import ReturnRequestButton from "./ReturnRequestButton";

import type {
  RentalRequest,
  RentalRequestsResponse,
} from "../types/rentalRequest";

interface RentalRequestsPanelProps {
  direction: "incoming" | "outgoing";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RentalRequestsPanel({
  direction,
}: RentalRequestsPanelProps) {
  const { token, logout } = useAuth();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRequests() {
      setLoading(true);
      setError("");

      try {
        if (!token) {
          throw new Error("Please log in to view rental requests.");
        }

        const data = await apiRequest<RentalRequestsResponse>(
          `/requests/${direction}`,
          {
            token,
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          setRequests(data.requests);
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
              : "Unable to load rental requests."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadRequests();

    return () => controller.abort();
  }, [direction, token, logout, attempt]);

  return (
    <section className="rental-section">
      <h2>
        {direction === "incoming" ? "Incoming Requests" : "My Requests"}
      </h2>

      <p className="section-description">
        {direction === "incoming"
          ? "Requests from people who want to rent your tools."
          : "Rental requests you have sent to other tool owners."}
      </p>

      {loading ? (
        <p role="status">Loading requests...</p>
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
      ) : requests.length === 0 ? (
        <p className="empty-message">
          {direction === "incoming"
            ? "No requests for your tools yet."
            : "You haven’t submitted any rental requests yet."}
        </p>
      ) : (
        <div className="rental-list">
          {requests.map((request) => {
            const tool =
              typeof request.tool === "object" && request.tool !== null
                ? request.tool
                : null;

            const person =
              direction === "incoming"
                ? request.borrower
                : request.owner;

            const personName =
              typeof person === "object" && person !== null
                ? person.name
                : "ToolShare member";

            return (
              <article key={request._id} className="rental-card">
                <div className="rental-card-heading">
                  <h3>
                    {tool ? (
                      <Link to={`/tools/${tool._id}`}>
                        {tool.name}
                      </Link>
                    ) : (
                      "Tool unavailable"
                    )}
                  </h3>

                  <span className={`rental-status status-${request.status}`}>
                    {request.status}
                  </span>
                </div>

                <p>
                  {direction === "incoming" ? "Borrower" : "Owner"}:
                  {" "}{personName}
                </p>

                <p>
                  {formatDate(request.startDate)}
                  {" – "}
                  {formatDate(request.endDate)}
                </p>

                {direction === "incoming" && (
                 <>
                <OwnerRequestActions
                 request={request}
                 onChanged={() => setAttempt((value) => value + 1)}
                />

                <ReturnRequestButton
                request={request}
               onChanged={() => setAttempt((value) => value + 1)}
                />
                </>
              )}

                {direction === "outgoing" && (
                  <BorrowerRequestActions
                    request={request}
                    onChanged={() => setAttempt((value) => value + 1)}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}