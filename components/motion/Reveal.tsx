"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, stagger, VIEWPORT } from "@/lib/motion";
import { useInstantEntrance } from "@/hooks/useCoarsePointer";

/**
 * `motion` is a proxy, so `motion[tag]` resolves fine at runtime. Widening
 * the result to `React.ElementType` used to be how the tag prop stayed
 * ergonomic without fighting framer-motion's per-tag signatures — but
 * `React.ElementType` resolves through the *global* `JSX.IntrinsicElements`,
 * and any library that extends that interface with a large, heterogeneous
 * set of elements (e.g. @react-three/fiber's <mesh>, <group>, ...) makes
 * TS collapse the union's `children` type to `never` for every consumer,
 * not just the one importing that library. Keeping an explicit map of the
 * handful of tags we actually use sidesteps `JSX.IntrinsicElements`
 * entirely — `Comp` stays a plain union of framer-motion's own component
 * types, which is immune to what other libraries do to the DOM tag set.
 */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  header: motion.header,
} as const;

type Tag = keyof typeof MOTION_TAGS;

function motionTag(tag: Tag) {
  return MOTION_TAGS[tag];
}

interface RevealProps extends React.PropsWithChildren {
  className?: string;
  /** Which entrance to use. Defaults to a 24px rise + fade. */
  variants?: Variants;
  /** Extra delay in seconds, for hand-tuning a sequence. */
  delay?: number;
  as?: Tag;
  id?: string;
  /** Above-the-fold: show immediately on mobile / touch. */
  priority?: boolean;
}

/** Scroll-triggered entrance. Fires once, slightly before it reaches the fold. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
  id,
  priority = false,
}: RevealProps) {
  const instant = useInstantEntrance();
  const Comp = motionTag(as);
  const runInstant = priority || instant;

  return (
    <Comp
      id={id}
      className={className}
      variants={variants}
      initial={runInstant ? "show" : "hidden"}
      {...(runInstant
        ? {}
        : { whileInView: "show", viewport: VIEWPORT })}
      animate={runInstant ? "show" : undefined}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}

interface StaggerProps extends React.PropsWithChildren {
  className?: string;
  /** Seconds between each child. */
  gap?: number;
  delay?: number;
  as?: Tag;
  id?: string;
}

/**
 * Parent that sequences its <RevealItem> children.
 * Children inherit `hidden`/`show` — they must not set their own `initial`.
 */
export function StaggerGroup({
  children,
  className,
  gap = 0.06,
  delay = 0,
  as = "div",
  id,
}: StaggerProps) {
  const Comp = motionTag(as);

  return (
    <Comp
      id={id}
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Comp>
  );
}

interface RevealItemProps extends React.PropsWithChildren {
  className?: string;
  variants?: Variants;
  as?: Tag;
}

/** A single sequenced child of <StaggerGroup>. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: RevealItemProps) {
  const Comp = motionTag(as);

  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}
