import { useMemo } from "react";
import { createManualSnapshot, mergeMonsterSnapshotSelection, type EncounterMonsterSnapshot } from "./snapshotMapper";
import { MonsterPicker } from "./MonsterPicker";
import { MonsterSnapshotCard } from "./MonsterSnapshotCard";
import type { MonsterCatalogItem } from "./monsterCatalogApi";

interface EncounterMonsterEditorProps {
  environment: "Dungeon" | "Forest" | "Urban" | "Wilderness" | "Underdark" | "Other";
  monsters: EncounterMonsterSnapshot[];
  onChange: (monsters: EncounterMonsterSnapshot[]) => void;
}

export function EncounterMonsterEditor({ environment, monsters, onChange }: EncounterMonsterEditorProps) {
  const manualCount = useMemo(() => monsters.filter((monster) => monster.isManual).length, [monsters]);

  function addManualMonster() {
    onChange([...monsters, createManualSnapshot()]);
  }

  function handleSelectMonster(selectedMonster: MonsterCatalogItem) {
    onChange(mergeMonsterSnapshotSelection(monsters, selectedMonster));
  }

  function updateMonster(index: number, nextMonster: EncounterMonsterSnapshot) {
    const nextMonsters = [...monsters];
    nextMonsters[index] = nextMonster;
    onChange(nextMonsters);
  }

  function removeMonster(index: number) {
    onChange(monsters.filter((_, monsterIndex) => monsterIndex !== index));
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <MonsterPicker defaultEnvironment={environment} onSelect={handleSelectMonster} />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <strong>Current lineup</strong>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>
            {monsters.length} monsters total, {manualCount} manual entries.
          </p>
        </div>
        <button
          type="button"
          onClick={addManualMonster}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #0f766e", background: "#ecfeff" }}
        >
          Add manual monster
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {monsters.map((monster, index) => (
          <MonsterSnapshotCard
            key={`${monster.sourceMonsterId ?? monster.name}-${index}`}
            monster={monster}
            index={index}
            editable
            onChange={(nextMonster) => updateMonster(index, nextMonster)}
            onRemove={() => removeMonster(index)}
          />
        ))}
      </div>
    </section>
  );
}
