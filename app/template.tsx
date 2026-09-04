"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_OUT } from "@noirly-dev/ui/motion";
import { useInstantEntrance } from "@noirly-dev/ui";

/**
 * Route enter transition.
 *
 * `template.tsx` is remounted on every navigation (unlike `layout.tsx`), which
 * is exactly what a mount-driven enter animation needs. A short rise + fade
 * only — no blur or scale here, because this wrapper contains the whole page
 * and filtering it would cost a full-page repaint on every route change.
 *
 * On mobile / touch, the wrapper is static so Lighthouse sees content on first
 * paint instead of waiting for hydration to clear `opacity: 0`.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const instant = useInstantEntrance();

  if (instant) {
    return (
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    );
  }

  return (
    <motion.main
      id="main"
      className="flex flex-1 flex-col"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
    >
      {children}
    </motion.main>
  );
}
