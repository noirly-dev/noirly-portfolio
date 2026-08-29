"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { setTransitionPhase, useTransitionState } from "@/hooks/useTransitionState";

/**
 * Gold shutter that wipes the screen on every route change.
 *
 * A note on what the app router can and cannot tell us: `usePathname()` updates
 * *after* the new route has committed. There is no "navigation started" signal
 * available to a layout, so the shutter cannot cover the old page before it
 * leaves. The sequence therefore runs over the new page — wipe on, hold, wipe
 * off — which reads as a deliberate reveal rather than a cover-up, and is the
 * only honest option without intercepting every <Link> on the site.
 *
 * The phase machine is timers over CSS, not a JS animation: the shutter is a
 * single fixed element whose `data-phase` selects a transform and a duration in
 * styles/transitions.css. The compositor owns the motion; React only names the
 * state it should be in.
 */

interface Timing {
  /** Wipe on. */
  enter: number;
  /** Fully covered, new route painting behind. */
  hold: number;
  /** Wipe off. */
  exit: number;
}

const FULL: Timing = { enter: 380, hold: 80, exit: 420 };
/** Reduced motion swaps the wipe for a cross-fade; the hold is unchanged so the
 *  route still gets its beat to paint. */
const REDUCED_TIMING: Timing = { enter: 200, hold: 80, exit: 200 };

/** Wordmark in at 0.15s, out 0.1s before the exit begins. */
const MARK_IN = 150;
const MARK_OUT = FULL.enter + FULL.hold - 100;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onStoreChange: () => void): () => void {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

const getReduced = (): boolean => window.matchMedia(REDUCED_QUERY).matches;
const getServerSnapshot = (): boolean => false;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const phase = useTransitionState();
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getServerSnapshot);

  /**
   * The last pathname the shutter has finished running for. Held as state, not
   * a ref: under StrictMode the effect is mounted, torn down and mounted again,
   * and a ref mutated on the first pass would make the second pass believe the
   * work was already done and leave the shutter stuck mid-screen.
   */
  const [settled, setSettled] = useState(pathname);
  const [markVisible, setMarkVisible] = useState(false);

  useEffect(() => {
    void import("@/styles/transitions.css");
  }, []);

  useEffect(() => {
    // True on first mount, which is what keeps the shutter off-screen on load.
    if (settled === pathname) return;

    const timing = reduced ? REDUCED_TIMING : FULL;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, run: () => void): void => {
      timers.push(setTimeout(run, ms));
    };

    setTransitionPhase("entering");
    setMarkVisible(false);

    if (!reduced) {
      at(MARK_IN, () => setMarkVisible(true));
      at(MARK_OUT, () => setMarkVisible(false));
    }

    at(timing.enter, () => setTransitionPhase("covering"));
    at(timing.enter + timing.hold, () => setTransitionPhase("leaving"));
    at(timing.enter + timing.hold + timing.exit, () => {
      setTransitionPhase("idle");
      setMarkVisible(false);
      setSettled(pathname);
    });

    return () => {
      for (const timer of timers) clearTimeout(timer);
    };
  }, [pathname, settled, reduced]);

  return (
    <>
      <div
        className="shutter"
        data-phase={phase}
        data-reduced={reduced ? "true" : "false"}
        aria-hidden
      >
        <span className="shutter-mark" data-visible={markVisible ? "true" : "false"}>
          Noirly
        </span>
      </div>
      {children}
    </>
  );
}

export default PageTransition;
