"use client";

import { useSyncExternalStore } from "react";

const COARSE = "(pointer: coarse)";
const NARROW = "(max-width: 767px)";

function mediaSubscriber(query: string): (onStoreChange: () => void) => () => void {
  return (onStoreChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

const subscribeCoarse = mediaSubscriber(COARSE);
const subscribeNarrow = mediaSubscriber(NARROW);
const getCoarse = (): boolean => window.matchMedia(COARSE).matches;
const getNarrow = (): boolean => window.matchMedia(NARROW).matches;
const getServerSnapshot = (): boolean => false;

/** True on touch-first devices (phones, tablets). */
export function useCoarsePointer(): boolean {
  return useSyncExternalStore(subscribeCoarse, getCoarse, getServerSnapshot);
}

/** True below the `md` breakpoint — pairs with coarse for mobile UX policy. */
export function useNarrowViewport(): boolean {
  return useSyncExternalStore(subscribeNarrow, getNarrow, getServerSnapshot);
}

/** Skip entrance animations and heavy pointer FX on touch / narrow viewports. */
export function useInstantEntrance(): boolean {
  const coarse = useCoarsePointer();
  const narrow = useNarrowViewport();
  return coarse || narrow;
}
