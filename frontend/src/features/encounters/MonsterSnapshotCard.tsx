import { useMemo, useState } from "react";
import { challengeRatingValues } from "./encounterValidation";
import type { EncounterMonsterSnapshot } from "./snapshotMapper";
import "./EncounterComponents.css";

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
    <span className="monster-snapshot-card-badge">
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
    <article className="monster-snapshot-card">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="monster-snapshot-card-toggle"
      >
        <div className="monster-snapshot-card-header-copy">
          <strong>{headerLabel}</strong>
          <span className="monster-snapshot-card-subtitle">
            {monster.isManual ? "Manual snapshot" : `Catalog snapshot${monster.sourceMonsterId ? ` · ${monster.sourceMonsterId}` : ""}`}
          </span>
        </div>
        <span className="monster-snapshot-card-expand-label">{isExpanded ? "Collapse" : "Expand"}</span>
      </button>

      {isExpanded ? (
        <div className="monster-snapshot-card-content">
          <div className="monster-snapshot-card-badges">
            <StatBadge label="CR" value={Number.parseFloat(monster.cr)} />
            <StatBadge label="AC" value={monster.ac} />
            <StatBadge label="HP" value={monster.hp} />
          </div>

          <div className="monster-snapshot-card-grid">
            <label className="monster-snapshot-card-field">
              <span>Name</span>
              <input
                value={monster.name}
                onChange={(event) => updateMonster({ name: event.target.value })}
                disabled={!editable}
                className="monster-snapshot-card-input"
              />
            </label>

            <label className="monster-snapshot-card-field">
              <span>Quantity</span>
              <input
                type="number"
                min={1}
                max={99}
                value={monster.quantity}
                onChange={(event) => updateMonster({ quantity: Number(event.target.value) })}
                disabled={!editable}
                className="monster-snapshot-card-input"
              />
            </label>

            <label className="monster-snapshot-card-field">
              <span>CR</span>
              <select
                value={crValue}
                onChange={(event) => updateMonster({ cr: event.target.value as any })}
                disabled={!editable}
                className="monster-snapshot-card-input"
              >
                {challengeRatingValues.map((challengeRating) => (
                  <option key={challengeRating} value={challengeRating}>
                    {challengeRating}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="monster-snapshot-card-grid">
            <label className="monster-snapshot-card-field">
              <span>AC</span>
              <input
                type="number"
                value={monster.ac ?? ""}
                onChange={(event) => updateMonster({ ac: event.target.value ? Number(event.target.value) : undefined })}
                disabled={!editable}
                className="monster-snapshot-card-input"
              />
            </label>

            <label className="monster-snapshot-card-field">
              <span>HP</span>
              <input
                type="number"
                value={monster.hp ?? ""}
                onChange={(event) => updateMonster({ hp: event.target.value ? Number(event.target.value) : undefined })}
                disabled={!editable}
                className="monster-snapshot-card-input"
              />
            </label>

            <label className="monster-snapshot-card-field">
              <span>Speed</span>
              <input
                value={monster.speed ?? ""}
                onChange={(event) => updateMonster({ speed: event.target.value || undefined })}
                disabled={!editable}
                className="monster-snapshot-card-input"
              />
            </label>
          </div>

          <label className="monster-snapshot-card-field">
            <span>Notes</span>
            <textarea
              value={monster.notes ?? ""}
              onChange={(event) => updateMonster({ notes: event.target.value })}
              disabled={!editable}
              rows={3}
              className="monster-snapshot-card-input"
            />
          </label>

          <label className="monster-snapshot-card-field">
            <span>Description</span>
            <textarea
              value={monster.description ?? ""}
              onChange={(event) => updateMonster({ description: event.target.value || undefined })}
              disabled={!editable}
              rows={3}
              className="monster-snapshot-card-input"
            />
          </label>

          <label className="monster-snapshot-card-checkbox-label">
            <input
              type="checkbox"
              checked={monster.isManual}
              onChange={(event) => updateMonster({ isManual: event.target.checked })}
              disabled={!editable}
            />
            Manual entry
          </label>

          {monster.coreStats ? (
            <div className="monster-snapshot-card-ability-scores">
              <strong>Ability scores</strong>
              <div className="monster-snapshot-card-badges">
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
            <div className="monster-snapshot-card-footer">
              <span className="monster-snapshot-card-subtitle">Snapshot {typeof index === "number" ? index + 1 : ""}</span>
              <button
                type="button"
                onClick={onRemove}
                className="monster-snapshot-card-remove-button"
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
