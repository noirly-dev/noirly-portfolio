"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CounterProps {
  /** Target value. */
  value: number;
  /** Rendered verbatim after the number, e.g. "+". */
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The final value is rendered on the server and used as the element's initial
 * text, so the number is correct before hydration, correct for crawlers, and
 * correct under reduced motion (where the count-up is skipped entirely).
 */
export function Counter({
  value,
  suffix = "",
  className,
  duration = 1.4,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, reduced, value, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
