import type { EncounterFormValues } from "./encounterValidation";
import type { MonsterCatalogItem } from "./monsterCatalogApi";

export type EncounterMonsterSnapshot = EncounterFormValues["monsters"][number];

function cloneStats(stats: MonsterCatalogItem["coreStats"]) {
  return stats
    ? {
        str: stats.str,
        dex: stats.dex,
        con: stats.con,
        int: stats.int,
        wis: stats.wis,
        cha: stats.cha,
      }
    : undefined;
}

export function catalogMonsterToSnapshot(monster: MonsterCatalogItem): EncounterMonsterSnapshot {
  return {
    sourceMonsterId: monster.id,
    isManual: false,
    name: monster.name,
    quantity: 1,
    cr: monster.cr,
    ac: monster.ac ?? undefined,
    hp: monster.hp ?? undefined,
    speed: monster.speed ?? undefined,
    coreStats: cloneStats(monster.coreStats),
    description: monster.description ?? undefined,
    notes: "",
  } as EncounterMonsterSnapshot;
}

export function createManualSnapshot(): EncounterMonsterSnapshot {
  return {
    isManual: true,
    name: "",
    quantity: 1,
    cr: "1",
    notes: "",
  };
}

export function mergeMonsterSnapshotSelection(
  current: EncounterMonsterSnapshot[],
  selection: MonsterCatalogItem
) {
  const next = [...current];
  const existingIndex = next.findIndex((monster) => monster.sourceMonsterId === selection.id && !monster.isManual);

  if (existingIndex >= 0) {
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: Math.min(99, next[existingIndex].quantity + 1),
    };
    return next;
  }

  next.push(catalogMonsterToSnapshot(selection));
  return next;
}
