"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SPRING_SOFT } from "@/lib/motion";
import { useCachedRect } from "@/hooks/useCachedRect";
import { cn } from "@/lib/utils";

interface MagneticProps extends React.PropsWithChildren {
  className?: string;
  /** How far the element is allowed to drift toward the pointer, in px. */
  strength?: number;
}

/**
 * Pointer-magnetised wrapper for primary CTAs.
 *
 * Pointer-driven only, and applied to a wrapper rather than the control
 * itself, so the button keeps its own hit area, focus ring and keyboard
 * behaviour untouched. Touch devices never fire pointermove-with-hover, so
 * this is inert there — the control still works normally.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rectRef = useCachedRect(ref);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_SOFT);
  const sy = useSpring(y, SPRING_SOFT);

  function handleMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = rectRef.current;
    if (!rect) return;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set((dx / (rect.width / 2)) * strength);
    y.set((dy / (rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      // `inline-flex` belongs in the class list, not in `style`. As an inline
      // style it outranked every stylesheet rule, so a caller passing a
      // responsive display utility — `hidden lg:inline-flex` on the header CTA
      // — was silently ignored and the element rendered at every width. Through
      // `cn` (tailwind-merge) the caller's display utility wins the conflict,
      // while the span still gets a transformable box by default.
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.span>
  );
}
