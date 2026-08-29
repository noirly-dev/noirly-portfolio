"use client";

import dynamic from "next/dynamic";

/**
 * Loads the branded cursor after hydration. Keeps the cursor/hook bundle off
 * the critical path and avoids `next/dynamic` `ssr: false` in the RSC layout.
 */
const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

export function DeferredCursor() {
  return <CustomCursor />;
}
