"use client";

import { MotionConfig } from "framer-motion";
import { EASE_OUT, DURATION } from "@/lib/motion";

/**
 * Site-wide motion defaults.
 *
 * `reducedMotion="user"` makes every framer-motion component in the tree
 * honour prefers-reduced-motion automatically: transform and layout animations
 * are dropped, opacity is kept. That means individual components never have to
 * branch on the media query themselves.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
    >
      {children}
    </MotionConfig>
  );
}
