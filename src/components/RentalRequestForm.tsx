import { useState, type FormEvent } from "react";
import type { RentalFormValues } from "../types/rentalRequest";

interface RentalRequestFormProps {
  initialValues?: RentalFormValues;
  submitting: boolean;
  error: string;
  submitLabel: string;
  onSubmit: (values: RentalFormValues) => Promise<void>;
}

const defaultValues: RentalFormValues = {
  startDate: "",
  endDate: "",
  message: "",
};

export default function RentalRequestForm({
  initialValues = defaultValues,
  submitting,
  error,
  submitLabel,
  onSubmit,
}: RentalRequestFormProps) {
  const [values, setValues] = useState(initialValues);
  const [validationError, setValidationError] = useState("");

  // Match the backend's date-only validation using UTC.
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!values.startDate || !values.endDate) {
      setValidationError("Choose a start date and an end date.");
      return;
    }

    if (values.startDate < today) {
      setValidationError("Start date cannot be in the past.");
      return;
    }

    if (values.endDate < values.startDate) {
      setValidationError("End date must be on or after the start date.");
      return;
    }

    await onSubmit({
      ...values,
      message: values.message.trim(),
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <fieldset className="tool-form-fields" disabled={submitting}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="rental-start">Start Date</label>
            <input
              id="rental-start"
              type="date"
              min={today}
              value={values.startDate}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="rental-end">End Date</label>
            <input
              id="rental-end"
              type="date"
              min={values.startDate || today}
              value={values.endDate}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="rental-message">Message to Owner (optional)</label>
          <textarea
            id="rental-message"
            rows={3}
            maxLength={500}
            value={values.message}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="Tell the owner about your project."
          />
        </div>
      </fieldset>

      {(validationError || error) && (
        <p className="form-error" role="alert">
          {validationError || error}
        </p>
      )}

      <button
        type="submit"
        className="button button-primary"
        disabled={submitting}
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}