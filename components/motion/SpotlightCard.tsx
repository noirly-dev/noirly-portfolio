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
  // HTMLElement, not HTMLDivElement: `Comp` can render as a div, article, or
  // li, and the ref only ever touches generic HTMLElement members below.
  const ref = useRef<HTMLElement>(null);
  // See the comment on MOTION_TAGS in Reveal.tsx: an explicit, narrow map
  // keeps `Comp` typed as a union of framer-motion's own components instead
  // of `React.ElementType`, which resolves through the global
  // `JSX.IntrinsicElements` and breaks once another library (e.g.
  // @react-three/fiber) extends that interface with hundreds of elements.
  const Comp = { div: motion.div, article: motion.article, li: motion.li }[as];

  function handleMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <Comp
      // `Comp`'s ref prop type is an *intersection* of the three tags' ref
      // types (div/article/li), which no single RefObject can satisfy even
      // though every element behind it is an HTMLElement. handleMove only
      // touches generic HTMLElement members, so the cast is safe.
      ref={ref as React.Ref<HTMLDivElement & HTMLElement & HTMLLIElement>}
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
