"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cancelFrame, frame, type FrameData } from "framer-motion";
import { useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";

/**
 * Lenis configuration and its marriage to Framer Motion's frame loop.
 *
 * The important idea here is that there is exactly one animation loop on the
 * page. Lenis ships its own `requestAnimationFrame`; so does Framer Motion.
 * Left alone they run as two independent loops, and scroll-derived motion
 * values are read a frame away from the scroll position that produced them —
 * which shows up as tilt cards and parallax lagging half a frame behind the
 * page. Passing `autoRaf: false` and driving `lenis.raf()` from inside
 * `frame.update` collapses them into one: Lenis advances, then every motion
 * value reads the position it just wrote, in the same frame.
 *
 * Framer Motion's `useScroll` needs no adapter for this. Lenis scrolls the
 * window for real (it is not a transformed container), so `window.scrollY` and
 * the native scroll event stay authoritative — they are simply now emitted
 * from a loop we control.
 */

/** Expo-out. Heavy and decelerating; deliberately not a spring — no bounce. */
const expoOut = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** Clears the sticky header when Lenis lands on an anchor target. */
const ANCHOR_OFFSET = -104;

export type ScrollMode = "default" | "touch" | "reduced";

/**
 * Options per environment. Frozen module constants rather than objects built
 * in render: <ReactLenis> keys its instance off `JSON.stringify(options)`, so
 * a fresh object literal every render would thrash the Lenis instance.
 */
const OPTIONS: Record<ScrollMode, LenisOptions> = {
  default: {
    duration: 1.4,
    easing: expoOut,
    smoothWheel: true,
    // Native momentum on trackpads/touch is better than anything we'd synthesise.
    syncTouch: false,
    anchors: { offset: ANCHOR_OFFSET },
    autoRaf: false,
  },
  touch: {
    duration: 0.8,
    easing: expoOut,
    // No wheel override on touch — the platform's own momentum is the point.
    smoothWheel: false,
    syncTouch: false,
    anchors: { offset: ANCHOR_OFFSET },
    autoRaf: false,
  },
  reduced: {
    // Lenis stays installed and keeps owning scroll, but with duration and lerp
    // both falsy its animator takes the `value = target` branch: every scroll
    // lands on the same frame it was requested. No smoothing, no easing.
    duration: 0,
    lerp: 0,
    smoothWheel: false,
    syncTouch: false,
    anchors: { offset: ANCHOR_OFFSET },
    autoRaf: false,
  },
};

function mediaSubscriber(query: string): (onStoreChange: () => void) => () => void {
  return (onStoreChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

const COARSE = "(pointer: coarse)";
const REDUCED = "(prefers-reduced-motion: reduce)";

const subscribeCoarse = mediaSubscriber(COARSE);
const subscribeReduced = mediaSubscriber(REDUCED);
const getCoarse = (): boolean => window.matchMedia(COARSE).matches;
const getReduced = (): boolean => window.matchMedia(REDUCED).matches;
const getServerSnapshot = (): boolean => false;

/** Live scroll mode. Re-evaluates when a mouse is plugged in or the OS setting flips. */
export function useScrollMode(): ScrollMode {
  const coarse = useSyncExternalStore(subscribeCoarse, getCoarse, getServerSnapshot);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getServerSnapshot);
  if (reduced) return "reduced";
  return coarse ? "touch" : "default";
}

export function lenisOptions(mode: ScrollMode): LenisOptions {
  return OPTIONS[mode];
}

/**
 * Hands Lenis's tick to Framer Motion. Must be rendered inside <ReactLenis>.
 *
 * `useLenis()` reads the instance from context, which is React state inside the
 * provider — so when the options change and <ReactLenis> builds a new instance,
 * this hook re-runs and re-binds rather than driving a destroyed one.
 */
export function useLenisFrameSync(): void {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    function advance({ timestamp }: FrameData): void {
      lenis?.raf(timestamp);
    }

    // `true` keeps the callback registered across frames instead of firing once.
    frame.update(advance, true);
    return () => cancelFrame(advance);
  }, [lenis]);
}

/**
 * Re-exported so components can reach scroll state — `lenis.progress`,
 * `lenis.scrollTo`, or a scroll callback — from anywhere in the tree.
 */
export { useLenis };
