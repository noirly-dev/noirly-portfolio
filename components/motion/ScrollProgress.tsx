"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { SPRING_SCROLL } from "@/lib/motion";

/**
 * Hairline read-progress bar pinned under the header.
 *
 * Purely decorative, so it is hidden from assistive tech. The spring keeps it
 * from twitching on fast scroll; `scaleX` means no layout work per frame.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING_SCROLL);

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--text)]"
    />
  );
}
