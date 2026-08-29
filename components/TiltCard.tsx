"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Perspective tilt for a card-shaped child.
 *
 * Two elements by design: the outer div owns `perspective`, the inner one owns
 * the rotation and `preserve-3d`. Putting `perspective` on the rotating
 * element itself would make the vanishing point rotate with it, which flattens
 * the effect into a skew.
 *
 * The rect is measured on the *outer* element. The inner card is mid-rotation
 * whenever the pointer is over it, so its own bounding box grows and shrinks
 * with the tilt — measuring that would feed the tilt back into itself and the
 * card would wobble. The outer box never moves.
 *
 * Rotation runs through springs rather than being assigned, which is also what
 * handles the exit: `mouseleave` sets the targets to 0 and the spring carries
 * them home with weight instead of snapping.
 *
 * Reduced motion: the handler returns early, so the card never leaves 0/0, and
 * `styles/cursor.css` hides the specular.
 */

/** Past ~8deg the perspective reads as distortion rather than depth. */
const MAX_TILT = 8;
const SPRING = { stiffness: 300, damping: 30 } as const;

interface TiltCardProps {
  children: ReactNode;
  /** Applied to the perspective wrapper, not the tilting card. */
  className?: string;
  /** Cursor variant for the region. Set to null to leave the cursor alone. */
  cursor?: string | null;
}

export function TiltCard({ children, className, cursor = "hover" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const rotateX = useSpring(targetX, SPRING);
  const rotateY = useSpring(targetY, SPRING);

  function handleMove(event: React.MouseEvent<HTMLDivElement>): void {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // 0..1 across the card, then re-centred to -0.5..0.5.
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    targetY.set((px - 0.5) * 2 * MAX_TILT);
    // Negated: pointer below centre should push the near edge toward the
    // viewer, which is a negative rotateX.
    targetX.set(-(py - 0.5) * 2 * MAX_TILT);

    // Specular highlight. Custom properties inherit, so setting them here on
    // the wrapper positions the gradient on `.tilt-card::before` — and the
    // wrapper's untilted box keeps the highlight in step with the pointer.
    el.style.setProperty("--tilt-x", `${(px * 100).toFixed(2)}%`);
    el.style.setProperty("--tilt-y", `${(py * 100).toFixed(2)}%`);
  }

  function handleLeave(): void {
    targetX.set(0);
    targetY.set(0);
  }

  return (
    <div
      ref={ref}
      className={cn("tilt-perspective", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor={cursor ?? undefined}
    >
      <motion.div className="tilt-card" style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </div>
  );
}

export default TiltCard;
