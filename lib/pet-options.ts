export const LIVING_ENVIRONMENT = ["Indoor only", "Outdoor access", "Both"] as const;
export const FOOD_TYPE = ["Dry kibble", "Wet food", "Raw / BARF", "Home-cooked", "Mixed", "Fresh-cooked"] as const;
export const WATER_SOURCES = ["One bowl", "Multiple bowls", "Fountain", "Fountain + bowl"] as const;
export const MEAL_PATTERN = [
  "Measured, 2+ meals/day",
  "Measured, once daily",
  "Free feeding",
  "Varies day to day",
] as const;
export const HUMAN_FOOD = ["Never", "Rarely", "A few times/wk", "Most days"] as const;
export const TREATS_SHARE = ["None / minimal", "About 5–10%", "About 10–20%", "More than 20%", "Not sure"] as const;
export const EXERCISE = ["< 15 min", "15–30 min", "30–60 min", "1–1.5 hrs", "> 1.5 hrs"] as const;
export const MUSCLE_TONE = ["Well-muscled", "Normal", "Some muscle loss", "Noticeable muscle loss"] as const;
export const ENERGY = ["Easily tired", "Low", "Typical", "High"] as const;
export const APPETITE = ["Decreased", "Normal", "Increased", "Varies day to day", "Not sure"] as const;
export const SLEEP = ["Restless / wakes often", "Normal", "Sleeps more than usual", "Not sure"] as const;
export const BEHAVIOUR = [
  "Typical for them",
  "More anxious",
  "More withdrawn",
  "More irritable",
  "More clingy",
  "Not sure",
] as const;
export const WEIGHT_TREND = ["Stable", "Gained", "Lost", "Not sure"] as const;

export const BODY_CONDITION_SCORES = [
  { value: "1", label: "Very thin" },
  { value: "2", label: "Underweight" },
  { value: "3", label: "Thin" },
  { value: "4", label: "Ideal (lean)" },
  { value: "5", label: "Ideal" },
  { value: "6", label: "Slightly overweight" },
  { value: "7", label: "Overweight" },
  { value: "8", label: "Heavy" },
  { value: "9", label: "Obese" },
] as const;
