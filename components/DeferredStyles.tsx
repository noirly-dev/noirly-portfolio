"use client";

import { useEffect } from "react";

/**
 * Loads the pointer-effect and route-shutter stylesheets after first paint, so
 * they stay out of the render-blocking CSS chunk linked from the document head.
 *
 * Both are safe to arrive late: the cursor is gated on an attribute the hook
 * sets after mount, and the shutter is parked off-screen until the first
 * navigation.
 */
export function DeferredStyles() {
  useEffect(() => {
    const load = () => {
      void import("@noirly-dev/ui/effects.css");
      void import("@noirly-dev/ui/transitions.css");
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const id = setTimeout(load, 1);
    return () => clearTimeout(id);
  }, []);

  return null;
}
