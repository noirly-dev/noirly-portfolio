"use client";

import { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { EASE_OUT, DURATION, VIEWPORT, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useCachedRect } from "@/hooks/useCachedRect";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  /** Disable the scroll entrance when the card is sequenced by a parent. */
  animateIn?: boolean;
  /** Lift on hover. Off for large panels where a lift reads as wobble. */
  lift?: boolean;
  as?: "div" | "article" | "li";
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * Surface card with a cursor-tracked spotlight and a hover lift.
 *
 * The spotlight is a CSS radial-gradient positioned from two custom properties
 * updated on pointermove — no React state, so it never re-renders while the
 * pointer moves. The `.spotlight` rule in globals.css handles the fade.
 */
export const SpotlightCard = forwardRef<HTMLElement, SpotlightCardProps>(
  function SpotlightCard(
    { children, className, animateIn = true, lift = true, as = "div" },
    forwardedRef,
  ) {
    const internalRef = useRef<HTMLElement>(null);
    const rectRef = useCachedRect(internalRef);
    const coarse = useCoarsePointer();
    const Comp = { div: motion.div, article: motion.article, li: motion.li }[as];

    function handleMove(event: React.PointerEvent<HTMLElement>) {
      if (coarse || event.pointerType !== "mouse") return;
      const el = internalRef.current;
      const rect = rectRef.current;
      if (!el || !rect) return;
      el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }

    return (
      <Comp
        ref={mergeRefs(internalRef, forwardedRef) as React.Ref<HTMLDivElement & HTMLElement & HTMLLIElement>}
        onPointerMove={handleMove}
        className={cn(
          "surface grain spotlight overflow-clip rounded-[var(--r-lg)]",
          className,
        )}
        variants={animateIn ? cardIn : undefined}
        initial={animateIn ? "hidden" : undefined}
        whileInView={animateIn ? "show" : undefined}
        viewport={animateIn ? VIEWPORT : undefined}
        whileHover={lift && !coarse ? { y: -5 } : undefined}
        transition={{ duration: DURATION.base, ease: EASE_OUT }}
      >
        {children}
      </Comp>
    );
  },
);

SpotlightCard.displayName = "SpotlightCard";
