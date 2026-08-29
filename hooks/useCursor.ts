"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

/**
 * Branded two-part cursor: state + motion, no DOM.
 *
 * The dot tracks the pointer with no smoothing; the ring lerps toward it, so
 * it swings a beat behind and settles. Both are written straight to
 * `element.style.transform` inside one rAF — position never touches React
 * state, because a re-render per pointer move would be visible.
 *
 * The only thing React does own is `variant`, which changes on hover and is
 * driven by a single delegated `mouseover` listener reading the nearest
 * `[data-cursor]` ancestor. One listener for the whole document, not one per
 * interactive element.
 *
 * Capability gates use `useSyncExternalStore` so the server snapshot is always
 * `false`: nothing is emitted into the SSR HTML, and the media queries stay
 * live afterwards.
 */

export type CursorVariant = "default" | "hover" | "link" | "drag";

export interface Cursor {
  /** Fine pointer present. False on touch and during SSR — render nothing. */
  enabled: boolean;
  /** Whether the trailing ring should exist (off under reduced motion). */
  showRing: boolean;
  /** Nearest `[data-cursor]` value under the pointer. */
  variant: CursorVariant;
  dotRef: RefObject<HTMLDivElement | null>;
  ringRef: RefObject<HTMLDivElement | null>;
}

/** Fraction of the remaining distance the ring covers each frame. */
const RING_LERP = 0.12;
/** Distance, in px, below which the ring counts as arrived. */
const EPSILON = 0.05;

/**
 * A lookup rather than an array, so the guard below narrows without a cast:
 * `includes` on a `readonly CursorVariant[]` refuses an arbitrary string.
 */
const VARIANTS: Record<CursorVariant, true> = {
  default: true,
  hover: true,
  link: true,
  drag: true,
};

function isVariant(value: string | null): value is CursorVariant {
  return value !== null && Object.hasOwn(VARIANTS, value);
}

/** Stable subscriber per query — useSyncExternalStore resubscribes if it changes. */
function mediaSubscriber(query: string): (onStoreChange: () => void) => () => void {
  return (onStoreChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribeFinePointer = mediaSubscriber(FINE_POINTER);
const subscribeReducedMotion = mediaSubscriber(REDUCED_MOTION);

const getFinePointer = (): boolean => window.matchMedia(FINE_POINTER).matches;
const getReducedMotion = (): boolean => window.matchMedia(REDUCED_MOTION).matches;
/** Server snapshot: no pointer, no cursor, no markup. */
const getServerSnapshot = (): boolean => false;

function place(el: HTMLElement, x: number, y: number): void {
  // The trailing `translate(-50%, -50%)` centres on the element's own box, so
  // the ring stays centred while it morphs between sizes.
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}

export function useCursor(): Cursor {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointer,
    getServerSnapshot,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerSnapshot,
  );

  const enabled = finePointer;
  // Reduced motion keeps the dot — which never lags — and drops the ring,
  // whose whole character is the lag.
  const showRing = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;
    const ring = ringRef.current;
    const root = document.documentElement;

    // Gates `cursor: none`. Set from JS so a failed bundle or disabled
    // JavaScript leaves the system cursor in place rather than no cursor.
    root.dataset.cursorActive = "";

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let visible = false;

    function tick(): void {
      if (!dot) return;
      place(dot, pointerX, pointerY);

      if (!ring) {
        frame = 0;
        return;
      }

      ringX += (pointerX - ringX) * RING_LERP;
      ringY += (pointerY - ringY) * RING_LERP;
      place(ring, ringX, ringY);

      if (Math.abs(pointerX - ringX) < EPSILON && Math.abs(pointerY - ringY) < EPSILON) {
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    }

    function handleMove(event: MouseEvent): void {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!visible) {
        // First sighting: drop the ring onto the pointer instead of letting it
        // fly in from the centre of the screen.
        ringX = pointerX;
        ringY = pointerY;
        visible = true;
        if (dot) dot.dataset.visible = "true";
        if (ring) ring.dataset.visible = "true";
      }

      if (frame === 0) frame = requestAnimationFrame(tick);
    }

    function handleOver(event: MouseEvent): void {
      const target = event.target;
      // `instanceof` narrows EventTarget without an assertion, and rules out
      // text nodes and the document itself in one go.
      if (!(target instanceof Element)) return;
      const owner = target.closest("[data-cursor]");
      const next = owner === null ? null : owner.getAttribute("data-cursor");
      setVariant(isVariant(next) ? next : "default");
    }

    function handleLeave(): void {
      visible = false;
      if (dot) delete dot.dataset.visible;
      if (ring) delete ring.dataset.visible;
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      if (frame !== 0) cancelAnimationFrame(frame);
      delete root.dataset.cursorActive;
    };
  }, [enabled, showRing]);

  return { enabled, showRing, variant, dotRef, ringRef };
}
