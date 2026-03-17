// src/aiGating/index.ts
// Uses the aiGate service to consume an AI action (server-backed when possible)
import { consumeAIAction, getLocalAICounts } from './services/aiGate';

export type AIGateResult =
  | { allowed: true; remainingFree?: number }
  | { allowed: false; reason?: string };

export async function requestAIAction(action: string): Promise<AIGateResult> {
  return await consumeAIAction(action as string);
}

export async function getFallbackCounts() {
  return await getLocalAICounts();
}

// Note: `requestAIAction` is the canonical call before performing an AI operation.
