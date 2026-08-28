/**
 * Route-level fallback. CSS-only on purpose: this renders before the client
 * bundle (and therefore Framer Motion) is available.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[60dvh] flex-1 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--hairline)] border-t-[var(--text)]"
      />
    </div>
  );
}
