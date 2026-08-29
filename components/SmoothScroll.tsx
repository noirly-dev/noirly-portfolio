"use client";

import { useEffect, type ReactNode } from "react";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";
import { lenisOptions, useScrollMode } from "@/hooks/useLenis";

/**
 * Smooth scroll without putting Lenis on the critical path.
 *
 * Starts after idle (or a short timeout) on fine pointers only. Children never
 * remount — Lenis is attached to the document imperatively.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const mode = useScrollMode();
  const coarse = useCoarsePointer();

  useEffect(() => {
    if (coarse) return;

    let destroyed = false;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function start(): Promise<void> {
      const [{ default: Lenis }] = await Promise.all([
        import("lenis"),
        import("lenis/dist/lenis.css"),
      ]);
      if (destroyed) return;

      lenis = new Lenis(lenisOptions(mode));

      const tick = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => {
        void start();
      }, { timeout: 1800 });
    } else {
      timeoutId = setTimeout(() => {
        void start();
      }, 200);
    }

    return () => {
      destroyed = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (rafId !== 0) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [coarse, mode]);

  return <>{children}</>;
}

export default SmoothScroll;
