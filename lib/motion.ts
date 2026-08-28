import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens for the Noirly portfolio.
 *
 * One rhythm across the whole site: everything eases out on an expo curve,
 * everything travels on transform + opacity + filter (never layout), and
 * exits run at ~65% of their enter duration so dismissal feels responsive.
 *
 * Reduced motion is handled globally by <MotionProvider> (MotionConfig with
 * reducedMotion="user"), which strips transform/layout animation from every
 * `motion` component and keeps opacity. Nothing here needs its own guard.
 */

/* ---------------------------------- Easing --------------------------------- */

/** Expo-out. The workhorse: fast departure, long settle. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Quint-in-out. For things that leave and come back (menus, page shells). */
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;
/** Gentle ease for opacity-only crossfades. */
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

/* --------------------------------- Duration -------------------------------- */

export const DURATION = {
  fast: 0.16,
  base: 0.28,
  slow: 0.62,
  /** Hero-scale reveals only. */
  grand: 0.9,
} as const;

/* ---------------------------------- Springs -------------------------------- */

/** Default spring for hover/press and layout-driven indicators. */
export const SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.85,
};

/** Looser spring for magnetic pointer-following. */
export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 20,
  mass: 0.6,
};

/** Tight spring for the scroll-progress bar. */
export const SPRING_SCROLL: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 40,
  restDelta: 0.001,
};

/* --------------------------------- Distance -------------------------------- */

/** Travel distances. Small enough to read as "settling", not "flying in". */
export const TRAVEL = {
  sm: 12,
  md: 24,
  lg: 40,
} as const;

/* --------------------------------- Variants -------------------------------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_SOFT },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: TRAVEL.md },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -TRAVEL.sm },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

/** Slight blur on entry reads as depth-of-field — cheap, very "premium". */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: TRAVEL.md, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.grand, ease: EASE_OUT },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

/** Card entrance: rises, settles, and gains its shadow as it lands. */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: TRAVEL.lg, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.grand, ease: EASE_OUT },
  },
};

/** Word/line mask reveal — the child of a `overflow-hidden` wrapper. */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: DURATION.grand, ease: EASE_OUT },
  },
};

/* -------------------------------- Staggering ------------------------------- */

/**
 * 60ms is the sweet spot for 3-6 item groups: readable as a sequence
 * without making the last item feel late.
 */
export function stagger(children = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: children, delayChildren: delay },
    },
  };
}

/* ------------------------------ Viewport config ---------------------------- */

/**
 * Fire once, a little before the element is fully on screen, so content is
 * already settled by the time the reader's eye arrives.
 */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/* ------------------------------ Page transition ---------------------------- */

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    // Exits run shorter than enters.
    transition: { duration: DURATION.base, ease: EASE_IN_OUT },
  },
};

/* --------------------------------- Helpers --------------------------------- */

/** Standard press feedback for tappable surfaces. */
export const TAP = { scale: 0.97 } as const;

/** Standard hover lift for cards. */
export const HOVER_LIFT = { y: -4 } as const;
