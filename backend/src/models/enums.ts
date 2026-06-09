export const DIFFICULTY_VALUES = ["Easy", "Medium", "Hard", "Deadly"] as const;

export const ENVIRONMENT_VALUES = [
  "Dungeon",
  "Forest",
  "Urban",
  "Wilderness",
  "Underdark",
  "Other",
] as const;

export const ENCOUNTER_STATUS_VALUES = ["draft", "ready"] as const;

export const CHALLENGE_RATING_VALUES = [
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

export type Difficulty = (typeof DIFFICULTY_VALUES)[number];
export type Environment = (typeof ENVIRONMENT_VALUES)[number];
export type EncounterStatus = (typeof ENCOUNTER_STATUS_VALUES)[number];
export type ChallengeRating = (typeof CHALLENGE_RATING_VALUES)[number];
