"use client";

import { motion } from "framer-motion";
import { maskUp, stagger, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  /** Plain text. Split on whitespace, each word masked and lifted in turn. */
  text: string;
  className?: string;
  /** Seconds between words. Lower for long headlines. */
  gap?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Renders the words as outline-only — used once, for the hero counter-line. */
  outline?: boolean;
}

/**
 * Word-by-word mask reveal for display headings.
 *
 * Each word sits in its own `overflow-hidden` span and slides up from 110%,
 * so the type appears to be uncovered rather than to fly in. Under reduced
 * motion, MotionConfig drops the y-transform and the words simply fade.
 *
 * The full string stays in the DOM as one text run per word with real spaces,
 * so screen readers and text selection are unaffected.
 */
export function TextReveal({
  text,
  className,
  gap = 0.045,
  delay = 0,
  as: Tag = "span",
  outline = false,
}: TextRevealProps) {
  const words = text.split(" ").filter(Boolean);

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        variants={stagger(gap, delay)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span
              // Top padding keeps ascenders inside the mask; bottom -mb only avoids
              // line-to-line overlap clipping when the headline wraps.
              className="inline-flex overflow-hidden pt-[0.14em] pb-[0.12em] -mb-[0.12em] align-bottom"
            >
              <motion.span
                variants={maskUp}
                className={cn("inline-block", outline && "text-outline")}
              >
                {word}
              </motion.span>
            </span>
            {/* Real space, outside the mask, so wrapping stays natural. */}
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
