export type AssessmentAnswers = {
  id?: string;
  species?: string;
  name?: string;
  age?: string;
  dateOfBirth?: string;
  breed?: string;
  weight?: string;
  diet?: string;
  meals?: string;
  living?: string;
  exercise?: string;
  energy?: string;
  muscle?: string;
  bcs?: string;
  weightTrend?: string;
  vaccines?: string;
  vetVisits?: string;
  appetite?: string;
  sleep?: string;
  behaviour?: string;
  conditions?: string;
  meds?: string;
  symptoms?: string;
};

export type DimensionKey =
  | "nutrition"
  | "bodyCondition"
  | "activity"
  | "preventive"
  | "behaviour"
  | "healthHistory";

export type DimensionResult = {
  key: DimensionKey;
  label: string;
  score: number;
  status: "healthy" | "improve" | "review";
  statusLabel: string;
};

export type PlanItem = {
  focus: string;
  why: string;
  next: string;
};

export type AssessmentResult = {
  overall: number;
  band: string;
  dimensions: DimensionResult[];
  healthy: DimensionResult[];
  improve: DimensionResult[];
  concerns: DimensionResult[];
  plan: PlanItem[];
};

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  nutrition: "Nutrition",
  bodyCondition: "Body Condition",
  activity: "Activity",
  preventive: "Preventive Care",
  behaviour: "Behaviour & Wellbeing",
  healthHistory: "Health History",
};

function clamp(n: number, min = 48, max = 94) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function avg(values: number[]) {
  const usable = values.filter((n) => Number.isFinite(n));
  if (!usable.length) return 72;
  return usable.reduce((a, b) => a + b, 0) / usable.length;
}

function dimensionStatus(score: number): DimensionResult["status"] {
  if (score >= 82) return "healthy";
  if (score >= 68) return "improve";
  return "review";
}

function statusLabel(status: DimensionResult["status"]) {
  if (status === "healthy") return "On track";
  if (status === "improve") return "Worth improving";
  return "Review";
}

function scoreNutrition(a: AssessmentAnswers) {
  const diet =
    a.diet === "Home-cooked" || a.diet === "Fresh-cooked"
      ? 84
      : a.diet === "Mixed"
        ? 80
        : a.diet === "Wet food"
          ? 78
          : a.diet === "Dry kibble"
            ? 76
            : a.diet === "Raw / BARF"
              ? 74
              : 70;
  const meals =
    a.meals === "Measured, 2+ meals/day"
      ? 88
      : a.meals === "Measured, once daily"
        ? 78
        : a.meals === "Free feeding"
          ? 62
          : a.meals === "Varies day to day"
            ? 64
            : 72;
  return clamp(avg([diet, meals]));
}

function scoreBody(a: AssessmentAnswers) {
  const bcs = parseInt(String(a.bcs ?? ""), 10);
  const bcsScore = Number.isNaN(bcs)
    ? 72
    : bcs === 4 || bcs === 5
      ? 90
      : bcs === 6
        ? 70
        : bcs === 3
          ? 68
          : bcs === 7
            ? 60
            : bcs <= 2 || bcs >= 8
              ? 52
              : 72;
  const trend =
    a.weightTrend === "Stable"
      ? 86
      : a.weightTrend === "Gained" || a.weightTrend === "Lost"
        ? 64
        : 74;
  const weightKnown = a.weight ? 82 : 70;
  const muscle =
    a.muscle === "Well-muscled"
      ? 88
      : a.muscle === "Normal"
        ? 80
        : a.muscle === "Some muscle loss"
          ? 64
          : a.muscle === "Noticeable muscle loss"
            ? 54
            : 74;
  return clamp((bcsScore * 2 + trend + weightKnown + muscle) / 5);
}

function scoreActivity(a: AssessmentAnswers) {
  const exercise =
    a.exercise === "30–60 min"
      ? 88
      : a.exercise === "15–30 min"
        ? 78
        : a.exercise === "1–1.5 hrs"
          ? 82
          : a.exercise === "> 1.5 hrs"
            ? 74
            : a.exercise === "< 15 min"
              ? 56
              : 70;
  const energy =
    a.energy === "Typical"
      ? 86
      : a.energy === "High"
        ? 80
        : a.energy === "Low"
          ? 64
          : a.energy === "Easily tired"
            ? 54
            : 72;
  const living =
    a.living === "Both" || a.living === "Outdoor access"
      ? 80
      : a.living === "Indoor only"
        ? 74
        : 72;
  return clamp(avg([exercise, energy, living]));
}

function scorePreventive(a: AssessmentAnswers) {
  const vaccines =
    a.vaccines === "Yes"
      ? 90
      : a.vaccines === "Partially"
        ? 70
        : a.vaccines === "Unsure"
          ? 66
          : a.vaccines === "No"
            ? 54
            : 72;
  const visits =
    a.vetVisits === "2+"
      ? 84
      : a.vetVisits === "1"
        ? 86
        : a.vetVisits === "0"
          ? 68
          : 74;
  return clamp(avg([vaccines, visits]));
}

function scoreBehaviour(a: AssessmentAnswers) {
  const mood =
    a.behaviour === "Typical for them"
      ? 88
      : a.behaviour === "More clingy"
        ? 70
        : a.behaviour === "More anxious" || a.behaviour === "More irritable"
          ? 60
          : a.behaviour === "More withdrawn"
            ? 56
            : 72;
  const sleep =
    a.sleep === "Normal"
      ? 88
      : a.sleep === "Sleeps more than usual"
        ? 68
        : a.sleep === "Restless / wakes often"
          ? 58
          : 74;
  const appetite =
    a.appetite === "Normal"
      ? 88
      : a.appetite === "Increased" || a.appetite === "Varies day to day"
        ? 70
        : a.appetite === "Decreased"
          ? 56
          : 74;
  return clamp((mood * 2 + sleep + appetite) / 4);
}

function scoreHistory(a: AssessmentAnswers) {
  const conditions = a.conditions?.trim() ? 60 : 84;
  const symptoms = a.symptoms?.trim() ? 58 : 82;
  const meds = a.meds?.trim() ? 70 : 80;
  return clamp(avg([conditions, symptoms, meds]));
}

function buildDimension(key: DimensionKey, score: number): DimensionResult {
  const status = dimensionStatus(score);
  return {
    key,
    label: DIMENSION_LABELS[key],
    score,
    status,
    statusLabel: statusLabel(status),
  };
}

const PLAN: Record<DimensionKey, PlanItem> = {
  nutrition: {
    focus: "Nutrition",
    why: "What your pet eats — and how consistently — is one of the strongest everyday influences on long-term health.",
    next: "Keep meals measured and consistent. If feeding varies a lot, start with set portions and times, then speak to your veterinarian before any major diet change.",
  },
  bodyCondition: {
    focus: "Weight & metabolic health",
    why: "Body condition is easier to support earlier. Small shifts in weight, muscle or appetite can add up over time.",
    next: "Check body condition monthly and keep a simple weight note. If your pet looks too thin, overweight, or is gaining or losing quickly, discuss it with your veterinarian.",
  },
  activity: {
    focus: "Movement & mobility",
    why: "Daily movement supports weight, joints, energy and behaviour — and the right amount depends on your pet, not a generic target.",
    next: "Build a daily movement routine that matches age and energy. If they tire unusually quickly, or activity has dropped, that is worth mentioning at a vet visit.",
  },
  preventive: {
    focus: "Preventive care",
    why: "Vaccinations, checkups and routine monitoring help you notice change before it becomes harder to manage.",
    next: "Confirm vaccines are up to date and book a routine veterinary check if it has been more than a year — or sooner if something has changed.",
  },
  behaviour: {
    focus: "Mind & behaviour",
    why: "Mood, sleep, appetite and habits are health signals. Pets often show change at home before it is obvious in a clinic.",
    next: "Note what changed, when it started, and how often. Share that pattern with your veterinarian, especially if appetite, sleep or sociability has shifted.",
  },
  healthHistory: {
    focus: "Health history",
    why: "Existing conditions, medications and changes you have noticed help PETZ — and your veterinarian — understand what deserves attention next.",
    next: "Keep a short list of conditions, medications and recent changes. Take it to your next veterinary visit rather than trying to interpret it on your own.",
  },
};

export function computeAssessment(answers: AssessmentAnswers = {}): AssessmentResult {
  const dimensions = [
    buildDimension("nutrition", scoreNutrition(answers)),
    buildDimension("bodyCondition", scoreBody(answers)),
    buildDimension("activity", scoreActivity(answers)),
    buildDimension("preventive", scorePreventive(answers)),
    buildDimension("behaviour", scoreBehaviour(answers)),
    buildDimension("healthHistory", scoreHistory(answers)),
  ];
  const overall = clamp(avg(dimensions.map((d) => d.score)), 52, 92);
  const band =
    overall >= 82 ? "Appears healthy" : overall >= 70 ? "Worth improving" : "May deserve attention";
  const healthy = dimensions.filter((d) => d.status === "healthy");
  const improve = dimensions.filter((d) => d.status === "improve");
  const concerns = dimensions.filter((d) => d.status === "review");
  const planSource = [...concerns, ...improve, ...healthy].slice(0, 3);
  return {
    overall,
    band,
    dimensions,
    healthy,
    improve,
    concerns,
    plan: planSource.map((d) => PLAN[d.key]),
  };
}

export function computeHealthScore(bcs: number, answers: AssessmentAnswers = {}) {
  return computeAssessment({ ...answers, bcs: Number.isNaN(bcs) ? answers.bcs : String(bcs) }).overall;
}
