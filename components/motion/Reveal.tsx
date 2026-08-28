"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, stagger, VIEWPORT } from "@/lib/motion";

type Tag = "div" | "section" | "article" | "ul" | "li" | "span" | "p" | "header";

/**
 * `motion` is a proxy, so `motion[tag]` resolves fine at runtime, but its
 * type is a union of component signatures that TS refuses to call. Widening to
 * ElementType keeps the tag prop ergonomic without fighting the union.
 */
function motionTag(tag: Tag): React.ElementType {
  return motion[tag] as React.ElementType;
}

interface RevealProps extends React.PropsWithChildren {
  className?: string;
  /** Which entrance to use. Defaults to a 24px rise + fade. */
  variants?: Variants;
  /** Extra delay in seconds, for hand-tuning a sequence. */
  delay?: number;
  as?: Tag;
  id?: string;
}

/** Scroll-triggered entrance. Fires once, slightly before it reaches the fold. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
  id,
}: RevealProps) {
  const Comp = motionTag(as);

  return (
    <Comp
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
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
