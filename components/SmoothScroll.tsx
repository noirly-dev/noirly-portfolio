"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { lenisOptions, useLenisFrameSync, useScrollMode } from "@/hooks/useLenis";

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

  return (
    <ReactLenis root options={lenisOptions(mode)}>
      <FrameSync />
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
