"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SPRING_SOFT } from "@/lib/motion";
import { useCachedRect } from "@/hooks/useCachedRect";

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
      className={className}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.span>
  );
}
