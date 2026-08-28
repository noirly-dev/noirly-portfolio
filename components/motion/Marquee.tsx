"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Seconds for one full pass. Higher = slower. */
  speed?: number;
  className?: string;
}

/**
 * Continuous tech ticker.
 *
 * Two identical halves translate by -50% and loop, so the seam is invisible.
 * The row is `aria-hidden` and paired with a visually-hidden list, so screen
 * readers get the items once instead of twice, and never as moving content.
 *
 * Under reduced motion the animation is dropped and the row renders as a
 * static, wrapping list — no auto-rotating content without a stop control.
 */
export function Marquee({ items, speed = 38, className }: MarqueeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <ul className={cn("flex flex-wrap gap-2", className)}>
        {items.map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={cn("marquee-mask relative overflow-hidden", className)}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <motion.div
        aria-hidden
        className="flex w-max gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-3 pr-3">
            {items.map((item) => (
              <span key={`${half}-${item}`} className="chip">
                {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
