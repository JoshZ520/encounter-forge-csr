import { encounterStatusValues, isReadyEncounterValid } from "./encounterValidation";

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
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {encounterStatusValues.map((status) => {
          const isSelected = value === status;
          const isReady = status === "ready";
          const readyDisabled = isReady && !canBeReady;

          return (
            <button
              key={status}
              type="button"
              onClick={() => onChange(status)}
              disabled={disabled || readyDisabled}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: isSelected ? "2px solid #0f766e" : "1px solid #cbd5e1",
                background: isSelected ? "#ccfbf1" : "white",
                opacity: disabled || readyDisabled ? 0.6 : 1,
                cursor: disabled || readyDisabled ? "not-allowed" : "pointer",
              }}
            >
              {status === "draft" ? "Draft" : "Ready"}
            </button>
          );
        })}
      </div>

      {value === "ready" && monsterCount === 0 ? (
        <p style={{ color: "#b45309", margin: 0 }}>
          Add at least one monster before marking an encounter ready.
        </p>
      ) : null}
    </div>
  );
}
