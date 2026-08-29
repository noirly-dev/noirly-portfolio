"use client";

import { useSyncExternalStore } from "react";

/**
 * Shutter phase, published as a module store rather than React context.
 *
 * The consumers that care about the transition — the custom cursor, the hero
 * canvas — are siblings of <PageTransition> in the layout, not descendants of
 * it. A context would force wrapping the whole body in yet another provider
 * just so a fixed-position sibling could read one string. A store subscribes
 * from anywhere and re-renders only what actually reads it.
 *
 *   idle     — nothing happening; shutter parked off-screen left
 *   entering — shutter sweeping in over the page
 *   covering — screen fully covered; the new route paints behind it
 *   leaving  — shutter sweeping off to the right
 */
export type TransitionPhase = "idle" | "entering" | "covering" | "leaving";

let phase: TransitionPhase = "idle";
const listeners = new Set<() => void>();

/** Written by <PageTransition>. Nothing else should call this. */
export function setTransitionPhase(next: TransitionPhase): void {
  if (next === phase) return;
  phase = next;
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

const getSnapshot = (): TransitionPhase => phase;
/** The shutter is never mid-flight during SSR. */
const getServerSnapshot = (): TransitionPhase => "idle";

export function useTransitionState(): TransitionPhase {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
