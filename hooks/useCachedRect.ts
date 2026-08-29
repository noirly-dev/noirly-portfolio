"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Keeps a cached bounding rect for pointer math. Refreshes on resize/scroll
 * so pointer handlers can write styles without calling getBoundingClientRect
 * every move (avoids forced reflow / layout thrashing).
 */
export function useCachedRect<T extends Element>(ref: RefObject<T | null>): RefObject<DOMRect | null> {
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function refresh(): void {
      if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
    }

    refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(el);
    window.addEventListener("scroll", refresh, { passive: true, capture: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", refresh, { capture: true });
    };
  }, [ref]);

  return rectRef;
}
