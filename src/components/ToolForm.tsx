import { useState, type FormEvent } from "react";
import type { ToolFormValues } from "../types/tool";

const categories = [
  "Power Tools",
  "Hand Tools",
  "Garden Tools",
  "Ladders",
  "Cleaning Equipment",
  "Other",
];

const conditions = ["New", "Like New", "Good", "Fair"];

const defaultValues: ToolFormValues = {
  name: "",
  description: "",
  category: "Power Tools",
  condition: "Good",
  dailyRate: 0,
  location: "",
  imageUrl: "",
  available: true,
};

interface ToolFormProps {
  initialValues?: ToolFormValues;
  submitting: boolean;
  error: string;
  submitLabel: string;
  onSubmit: (values: ToolFormValues) => Promise<void>;
}

export default function ToolForm({
  initialValues = defaultValues,
  submitting,
  error,
  submitLabel,
  onSubmit,
}: ToolFormProps) {
  const [values, setValues] = useState<ToolFormValues>(initialValues);
  const [validationError, setValidationError] = useState("");

  function updateField<K extends keyof ToolFormValues>(
    field: K,
    value: ToolFormValues[K]
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (
      !values.name.trim() ||
      !values.description.trim() ||
      !values.location.trim()
    ) {
      setValidationError("Enter a name, description, and location.");
      return;
    }

    if (!Number.isFinite(values.dailyRate) || values.dailyRate < 0) {
      setValidationError("Daily rate must be zero or greater.");
      return;
    }

    const imageUrl = values.imageUrl.trim();

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid image URL");
        }
      } catch {
        setValidationError("Enter an image URL starting with http or https.");
        return;
      }
    }

    await onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      imageUrl,
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <fieldset className="tool-form-fields" disabled={submitting}>
        <div className="form-field">
          <label htmlFor="tool-name">Tool Name</label>
          <input
            id="tool-name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="tool-description">Description</label>
          <textarea
            id="tool-description"
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={4}
            maxLength={2000}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="tool-category">Category</label>
            <select
              id="tool-category"
              value={values.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="tool-condition">Condition</label>
            <select
              id="tool-condition"
              value={values.condition}
              onChange={(event) =>
                updateField("condition", event.target.value)
              }
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="tool-rate">Daily Rate ($)</label>
          <input
            id="tool-rate"
            type="number"
            min="0"
            step="0.01"
            value={values.dailyRate}
            onChange={(event) =>
              updateField("dailyRate", event.target.valueAsNumber)
            }
            required
            aria-describedby="rate-help"
          />
          <small id="rate-help">Enter 0 to offer the tool for free.</small>
        </div>

        <div className="form-field">
          <label htmlFor="tool-location">Location</label>
          <input
            id="tool-location"
            placeholder="Philadelphia, PA"
            value={values.location}
            onChange={(event) =>
              updateField("location", event.target.value)
            }
            maxLength={150}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="tool-image">Image URL (optional)</label>
          <input
            id="tool-image"
            type="url"
            placeholder="https://example.com/tool.jpg"
            value={values.imageUrl}
            onChange={(event) =>
              updateField("imageUrl", event.target.value)
            }
            maxLength={2000}
          />
        </div>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={values.available}
            onChange={(event) =>
              updateField("available", event.target.checked)
            }
          />
          Available for rental
        </label>
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