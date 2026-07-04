import type { ActivityLevel, Goal, Sex } from '@prisma/client';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  weight_loss: -500,
  hypertrophy: +300,
  maintenance: 0,
};

/** Mifflin-St Jeor */
export function calcTMB(params: {
  weight: number; // kg
  height: number; // cm
  age: number;
  sex: Sex;
}): number {
  const { weight, height, age, sex } = params;
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (sex === 'male') return Math.round(base + 5);
  if (sex === 'female') return Math.round(base - 161);
  // 'other' → média
  return Math.round(base - 78);
}

export function calcGET(tmb: number, activityLevel: ActivityLevel): number {
  return Math.round(tmb * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calcTargetCalories(get: number, goal: Goal): number {
  return get + GOAL_ADJUSTMENTS[goal];
}

export function calcFitnessProfile(params: {
  weight: number;
  height: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  goal: Goal;
}) {
  const tmb = calcTMB(params);
  const get = calcGET(tmb, params.activityLevel);
  const targetCalories = calcTargetCalories(get, params.goal);
  return { tmb, get, targetCalories };
}
