import { useMemo, useState } from "react";
import { challengeRatingValues } from "./encounterValidation";
import type { EncounterMonsterSnapshot } from "./snapshotMapper";

interface MonsterSnapshotCardProps {
  monster: EncounterMonsterSnapshot;
  index?: number;
  editable?: boolean;
  onChange?: (monster: EncounterMonsterSnapshot) => void;
  onRemove?: () => void;
}

function StatBadge({ label, value }: { label: string; value?: number }) {
  if (value === undefined) {
    return null;
  }

  return (
    <span style={{ padding: "4px 8px", borderRadius: 999, background: "#e2e8f0", fontSize: 12 }}>
      {label} {value}
    </span>
  );
}

export function MonsterSnapshotCard({ monster, index, editable, onChange, onRemove }: MonsterSnapshotCardProps) {
  const [isExpanded, setIsExpanded] = useState(Boolean(editable));
  const crValue = monster.cr as any;

  const headerLabel = useMemo(() => {
    const parts = [monster.quantity, "x", monster.name || "Untitled monster"];
    return parts.join(" ");
  }, [monster.name, monster.quantity]);

  function updateMonster(partial: Partial<EncounterMonsterSnapshot>) {
    onChange?.({ ...monster, ...partial });
  }

  return (
    <article style={{ display: "grid", gap: 12, padding: 16, borderRadius: 14, border: "1px solid #cbd5e1", background: "#f8fafc" }}>
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          width: "100%",
          border: 0,
          background: "transparent",
          padding: 0,
          color: "inherit",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <strong>{headerLabel}</strong>
          <span style={{ color: "#475569", fontSize: 13 }}>
            {monster.isManual ? "Manual snapshot" : `Catalog snapshot${monster.sourceMonsterId ? ` · ${monster.sourceMonsterId}` : ""}`}
          </span>
        </div>
        <span style={{ color: "#475569", fontSize: 12 }}>{isExpanded ? "Collapse" : "Expand"}</span>
      </button>

      {isExpanded ? (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatBadge label="CR" value={Number.parseFloat(monster.cr)} />
            <StatBadge label="AC" value={monster.ac} />
            <StatBadge label="HP" value={monster.hp} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Name</span>
              <input
                value={monster.name}
                onChange={(event) => updateMonster({ name: event.target.value })}
                disabled={!editable}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Quantity</span>
              <input
                type="number"
                min={1}
                max={99}
                value={monster.quantity}
                onChange={(event) => updateMonster({ quantity: Number(event.target.value) })}
                disabled={!editable}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>CR</span>
              <select
                value={crValue}
                onChange={(event) => updateMonster({ cr: event.target.value as any })}
                disabled={!editable}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              >
                {challengeRatingValues.map((challengeRating) => (
                  <option key={challengeRating} value={challengeRating}>
                    {challengeRating}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>AC</span>
              <input
                type="number"
                value={monster.ac ?? ""}
                onChange={(event) => updateMonster({ ac: event.target.value ? Number(event.target.value) : undefined })}
                disabled={!editable}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>HP</span>
              <input
                type="number"
                value={monster.hp ?? ""}
                onChange={(event) => updateMonster({ hp: event.target.value ? Number(event.target.value) : undefined })}
                disabled={!editable}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Speed</span>
              <input
                value={monster.speed ?? ""}
                onChange={(event) => updateMonster({ speed: event.target.value || undefined })}
                disabled={!editable}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Notes</span>
            <textarea
              value={monster.notes ?? ""}
              onChange={(event) => updateMonster({ notes: event.target.value })}
              disabled={!editable}
              rows={3}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Description</span>
            <textarea
              value={monster.description ?? ""}
              onChange={(event) => updateMonster({ description: event.target.value || undefined })}
              disabled={!editable}
              rows={3}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={monster.isManual}
              onChange={(event) => updateMonster({ isManual: event.target.checked })}
              disabled={!editable}
            />
            Manual entry
          </label>

          {monster.coreStats ? (
            <div style={{ display: "grid", gap: 8 }}>
              <strong>Ability scores</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <StatBadge label="STR" value={monster.coreStats.str} />
                <StatBadge label="DEX" value={monster.coreStats.dex} />
                <StatBadge label="CON" value={monster.coreStats.con} />
                <StatBadge label="INT" value={monster.coreStats.int} />
                <StatBadge label="WIS" value={monster.coreStats.wis} />
                <StatBadge label="CHA" value={monster.coreStats.cha} />
              </div>
            </div>
          ) : null}

          {editable ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ color: "#475569", fontSize: 13 }}>Snapshot {typeof index === "number" ? index + 1 : ""}</span>
              <button
                type="button"
                onClick={onRemove}
                style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ef4444", background: "#fff1f2", color: "#b91c1c" }}
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
