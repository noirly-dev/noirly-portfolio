/**
 * Replaces Next.js's unconditional polyfill-module bundle.
 * Target browsers (see package.json browserslist) already support
 * Array.at, flat, Object.hasOwn, etc. — only URL.canParse is kept for Safari 16.4.
 */
if (!("canParse" in URL)) {
  URL.canParse = function (url, base) {
    try {
      return Boolean(new URL(url, base));
    } catch {
      return false;
    }
  };
}
