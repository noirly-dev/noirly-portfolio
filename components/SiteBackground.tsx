/**
 * Ambient page background.
 *
 * Sits behind every route as a single fixed layer at z-index -1, so the page
 * reads as a lit space rather than one flat --bg from header to footer. Pure
 * CSS (see the "Ambient page background" block in app/globals.css) — no client
 * JavaScript, no scroll listeners, and the drift animation is neutralised by
 * the global prefers-reduced-motion rule.
 */
export function SiteBackground() {
  return (
    <div aria-hidden className="site-bg">
      <div className="site-bg-wash" />
      <div className="site-bg-grid" />
      <div>
        <span className="site-bg-blob site-bg-blob-a" />
        <span className="site-bg-blob site-bg-blob-b" />
        <span className="site-bg-blob site-bg-blob-c" />
      </div>
      <div className="site-bg-vignette" />
      <div className="site-bg-grain" />
    </div>
  );
}
