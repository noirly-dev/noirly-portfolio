"use client";

import { useEffect } from "react";

const FAVICON = {
  light: "/favicon-light-48.png",
  dark: "/favicon-dark-48.png",
} as const;

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function faviconHref(isDark: boolean) {
  return isDark ? FAVICON.dark : FAVICON.light;
}

/** Keeps the tab icon in sync with the manual theme toggle (not just system preference). */
export function FaviconTheme() {
  useEffect(() => {
    function sync() {
      const href = faviconHref(isDarkMode());
      for (const link of document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"][data-theme-sync="true"]',
      )) {
        link.href = href;
      }
    }

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
