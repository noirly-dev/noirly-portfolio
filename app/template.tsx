"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * Route enter transition.
 *
 * `template.tsx` is remounted on every navigation (unlike `layout.tsx`), which
 * is exactly what a mount-driven enter animation needs. A short rise + fade
 * only — no blur or scale here, because this wrapper contains the whole page
 * and filtering it would cost a full-page repaint on every route change.
 *
 * Renders as <main> so every route gets the landmark (and the skip link's
 * target) exactly once, and so `main::before` — the cursor spotlight in
 * styles/cursor.css — has something to hang off on every page, not just home.
 */
export default function Template({ children }: { children: React.ReactNode }) {
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
