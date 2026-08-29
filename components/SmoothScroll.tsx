"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { lenisOptions, useLenisFrameSync, useScrollMode } from "@/hooks/useLenis";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";
import "lenis/dist/lenis.css";

/**
 * Global smooth-scroll provider.
 *
 * `root` puts Lenis on the document scroller and renders `children` with no
 * wrapper element of its own — nothing is added to the box tree, so this
 * cannot shift layout.
 *
 * The frame sync lives in a leaf component rather than here because
 * `useLenis()` reads from the context <ReactLenis> provides; a hook called in
 * this component would be reading the context from above it.
 */

function FrameSync(): null {
  useLenisFrameSync();
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const mode = useScrollMode();
  const coarse = useCoarsePointer();

  // Native scroll on touch — Lenis adds JS weight with no benefit on coarse pointers.
  if (coarse) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={lenisOptions(mode)}>
      <FrameSync />
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
