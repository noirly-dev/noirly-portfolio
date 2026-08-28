"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { EASE_OUT, DURATION, VIEWPORT, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  /** Disable the scroll entrance when the card is sequenced by a parent. */
  animateIn?: boolean;
  /** Lift on hover. Off for large panels where a lift reads as wobble. */
  lift?: boolean;
  as?: "div" | "article" | "li";
}

/**
 * Surface card with a cursor-tracked spotlight and a hover lift.
 *
 * The spotlight is a CSS radial-gradient positioned from two custom properties
 * updated on pointermove — no React state, so it never re-renders while the
 * pointer moves. The `.spotlight` rule in globals.css handles the fade.
 */
export function SpotlightCard({
  children,
  className,
  animateIn = true,
  lift = true,
  as = "div",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Comp = (motion[as] as React.ElementType) ?? motion.div;

  function handleMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <Comp
      ref={ref}
      onPointerMove={handleMove}
      className={cn("surface grain spotlight overflow-hidden", className)}
      variants={animateIn ? cardIn : undefined}
      initial={animateIn ? "hidden" : undefined}
      whileInView={animateIn ? "show" : undefined}
      viewport={animateIn ? VIEWPORT : undefined}
      whileHover={lift ? { y: -5 } : undefined}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  );
}
