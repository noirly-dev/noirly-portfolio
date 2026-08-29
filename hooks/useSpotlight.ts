"use client";

import { useEffect } from "react";

/**
 * Cursor-following ambient light.
 *
 * Writes the pointer position into two custom properties on <html> —
 * `--mouse-x` / `--mouse-y` — which `styles/cursor.css` reads to place a
 * radial-gradient on `main::before`. Nothing renders and nothing re-renders:
 * the hook returns void and touches only the document element, so a moving
 * cursor never costs a React pass.
 *
 * The position is lerped rather than assigned from the raw event, so the light
 * trails the cursor by a few frames. That lag is the whole point — set
 * directly it reads as a torch strapped to the pointer; eased, it reads as
 * ambient light in the room.
 *
 * Disabled entirely on coarse pointers (no hover to follow) and under
 * prefers-reduced-motion. Both are re-evaluated live, so plugging in a mouse
 * or flipping the OS setting takes effect without a reload.
 */

/** Fraction of the remaining distance covered each frame. */
const LERP = 0.08;
/** Distance, in px, below which the light counts as arrived. */
const EPSILON = 0.05;

/**
 * Starts tracking and returns its own teardown. Split out of the effect so the
 * media-query listeners below can stop and restart it without re-running the
 * effect itself.
 */
function track(root: HTMLElement): () => void {
  // Start centred: until the first move there is no cursor to point at, and
  // an unset gradient parked at 0,0 lights the top-left corner for no reason.
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;
  // rAF ids are always >= 1, so 0 is a safe "no frame queued" sentinel.
  let frame = 0;

  function write(): void {
    root.style.setProperty("--mouse-x", `${x.toFixed(2)}px`);
    root.style.setProperty("--mouse-y", `${y.toFixed(2)}px`);
  }

  function tick(): void {
    x += (targetX - x) * LERP;
    y += (targetY - y) * LERP;
    write();

    // Park the loop once the light has caught up. An always-on rAF for a
    // static gradient is pure battery drain; the next move restarts it.
    if (Math.abs(targetX - x) < EPSILON && Math.abs(targetY - y) < EPSILON) {
      x = targetX;
      y = targetY;
      write();
      frame = 0;
      return;
    }

    frame = requestAnimationFrame(tick);
  }

  function handleMove(event: MouseEvent): void {
    targetX = event.clientX;
    targetY = event.clientY;
    if (frame === 0) frame = requestAnimationFrame(tick);
  }

  write();
  // The gradient is opacity 0 until this lands, so the light fades in with the
  // hook rather than flashing on at the centre of the screen during hydration.
  root.dataset.spotlight = "on";
  window.addEventListener("mousemove", handleMove, { passive: true });

  return () => {
    window.removeEventListener("mousemove", handleMove);
    if (frame !== 0) cancelAnimationFrame(frame);
    delete root.dataset.spotlight;
    root.style.removeProperty("--mouse-x");
    root.style.removeProperty("--mouse-y");
  };
}

export function useSpotlight(): void {
  useEffect(() => {
    const root = document.documentElement;
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let teardown: (() => void) | null = null;

    function sync(): void {
      teardown?.();
      teardown = null;
      if (coarse.matches || reduced.matches) return;
      teardown = track(root);
    }

    coarse.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    sync();

    return () => {
      coarse.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);
}
