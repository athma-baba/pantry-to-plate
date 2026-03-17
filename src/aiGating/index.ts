// src/aiGating/index.ts
// Client-side AI usage gating logic (placeholder)
// Enforces DAILY_FREE and LIFETIME_FREE limits from env

const DAILY_FREE = Number(process.env.DAILY_FREE) || 10;
const LIFETIME_FREE = Number(process.env.LIFETIME_FREE) || 50;

// These would be persisted in real app (e.g., AsyncStorage, server)
let dailyCount = 0;
let lifetimeCount = 0;

export function canUseAI(): boolean {
  return dailyCount < DAILY_FREE && lifetimeCount < LIFETIME_FREE;
}

export function recordAIUsage() {
  dailyCount++;
  lifetimeCount++;
}

export function resetDailyCount() {
  dailyCount = 0;
}

export function getAICounts() {
  return { dailyCount, lifetimeCount, DAILY_FREE, LIFETIME_FREE };
}

// TODO: Integrate with backend for true enforcement
// TODO: Persist counts across app restarts
