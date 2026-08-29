"use client";

import { useEffect } from "react";

/**
 * Loads cursor/spotlight/tilt styles after first paint so they stay out of the
 * render-blocking CSS chunk linked from the document head.
 */
export function DeferredStyles() {
  useEffect(() => {
    const load = () => {
      void import("@/styles/cursor.css");
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
