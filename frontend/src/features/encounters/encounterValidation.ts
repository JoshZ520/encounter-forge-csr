import { z } from "zod";

export const difficultyValues = ["Easy", "Medium", "Hard", "Deadly"] as const;

export const environmentValues = [
  "Dungeon",
  "Forest",
  "Urban",
  "Wilderness",
  "Underdark",
  "Other",
] as const;

export const encounterStatusValues = ["draft", "ready"] as const;

export const challengeRatingValues = [
  "0",
  "1/8",
  "1/4",
  "1/2",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
] as const;

export const encounterMonsterSchema = z.object({
  sourceMonsterId: z.string().optional(),
  isManual: z.boolean(),
  name: z.string().min(1, "Monster name is required"),
  quantity: z.number().int().min(1).max(99),
  cr: z.enum(challengeRatingValues),
  ac: z.number().optional(),
  hp: z.number().optional(),
  speed: z.string().optional(),
  coreStats: z
    .object({
      str: z.number().optional(),
      dex: z.number().optional(),
      con: z.number().optional(),
      int: z.number().optional(),
      wis: z.number().optional(),
      cha: z.number().optional(),
    })
    .optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const encounterUpsertSchema = z.object({
  title: z.string().min(1, "Encounter title is required"),
  partySize: z.number().int().min(1).max(10),
  partyLevel: z.number().int().min(1).max(20),
  environment: z.enum(environmentValues),
  difficulty: z.enum(difficultyValues),
  targetCR: z.enum(challengeRatingValues),
  notes: z.string().optional(),
  status: z.enum(encounterStatusValues),
  monsters: z.array(encounterMonsterSchema),
});

export const encounterListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type EncounterFormValues = z.infer<typeof encounterUpsertSchema>;

export function createEmptyEncounterFormValues(): EncounterFormValues {
  return {
    title: "",
    partySize: 4,
    partyLevel: 1,
    environment: "Dungeon",
    difficulty: "Medium",
    targetCR: "1",
    notes: "",
    status: "draft",
    monsters: [
      {
        isManual: true,
        name: "",
        quantity: 1,
        cr: "1",
        notes: "",
      },
    ],
  };
}

export function isReadyEncounterValid(values: EncounterFormValues) {
  return values.status !== "ready" || values.monsters.length > 0;
}

export function mapZodErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((accumulator, issue) => {
    accumulator[issue.path.join(".")] = issue.message;
    return accumulator;
  }, {});
}
