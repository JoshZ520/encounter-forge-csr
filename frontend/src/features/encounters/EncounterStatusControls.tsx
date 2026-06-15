import { encounterStatusValues, isReadyEncounterValid } from "./encounterValidation";
import "./EncounterComponents.css";

interface EncounterStatusControlsProps {
  value: "draft" | "ready";
  monsterCount: number;
  onChange: (value: "draft" | "ready") => void;
  disabled?: boolean;
}

export function EncounterStatusControls({
  value,
  monsterCount,
  onChange,
  disabled,
}: EncounterStatusControlsProps) {
  const canBeReady = isReadyEncounterValid({
    title: "",
    partySize: 1,
    partyLevel: 1,
    environment: "Dungeon",
    difficulty: "Medium",
    targetCR: "1",
    notes: "",
    status: "ready",
    monsters: Array.from({ length: monsterCount }, () => ({
      isManual: true,
      name: "Placeholder",
      quantity: 1,
      cr: "1",
      notes: "",
    })),
  });

  return (
    <div className="encounter-status-controls">
      <div className="encounter-status-controls-options">
        {encounterStatusValues.map((status) => {
          const isSelected = value === status;
          const isReady = status === "ready";
          const readyDisabled = isReady && !canBeReady;
          const buttonClassName = [
            "encounter-status-controls-button",
            isSelected ? "encounter-status-controls-button-selected" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={status}
              type="button"
              onClick={() => onChange(status)}
              disabled={disabled || readyDisabled}
              className={buttonClassName}
            >
              {status === "draft" ? "Draft" : "Ready"}
            </button>
          );
        })}
      </div>

      {value === "ready" && monsterCount === 0 ? (
        <p className="encounter-status-controls-warning">
          Add at least one monster before marking an encounter ready.
        </p>
      ) : null}
    </div>
  );
}
