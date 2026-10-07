import { useState } from "react";
import { MapPin, Wrench } from "lucide-react";
import type { Tool } from "../types/tool";

export default function ToolCard({ tool }: { tool: Tool }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="tool-card">
      <div className="tool-image">
        {tool.imageUrl && !imageFailed ? (
          <img
            src={tool.imageUrl}
            alt={tool.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Wrench size={48} aria-hidden="true" />
        )}
      </div>

      <div className="tool-card-body">
        <span className="eyebrow">{tool.category}</span>
        <h2>{tool.name}</h2>

        <p className="tool-location">
          <MapPin size={16} aria-hidden="true" />
          {tool.location}
        </p>

        <p>{tool.condition} condition</p>

        <div className="tool-card-bottom">
          <strong>
            {tool.dailyRate === 0
              ? "Free"
              : `$${tool.dailyRate.toFixed(2)} / day`}
          </strong>

          <span
            className={`availability ${
              tool.available ? "available" : "unavailable"
            }`}
          >
            {tool.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    </article>
  );
}