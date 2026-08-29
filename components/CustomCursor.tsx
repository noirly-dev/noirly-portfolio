"use client";

import { useCursor } from "@/hooks/useCursor";

/**
 * The branded cursor's two elements.
 *
 * Deliberately thin: every listener, every frame and every transform lives in
 * `useCursor()`. This renders two fixed, pointer-events-none divs and hands
 * their refs over.
 *
 * Renders `null` on the server and on coarse pointers, so touch devices keep
 * the system cursor and ship no markup for this at all. Both elements are
 * `position: fixed`, so mounting them after hydration shifts nothing.
 */
export function CustomCursor() {
  const { enabled, showRing, variant, dotRef, ringRef } = useCursor();

  if (!enabled) return null;

  return (
    <>
      {/* Ring first in the DOM so the dot paints over it at equal z-index. */}
      {showRing ? (
        <div ref={ringRef} aria-hidden className="cursor-ring" data-variant={variant} />
      ) : null}
      <div ref={dotRef} aria-hidden className="cursor-dot" data-variant={variant} />
    </>
  );
}

export default CustomCursor;
