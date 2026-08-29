"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ProjectFeatureGraphicProps {
  title: string;
  type: string;
  className?: string;
}

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) ?? "N").toUpperCase();
}

function isSvgLogo(src: string): boolean {
  const lower = src.toLowerCase();
  if (lower.includes("image/svg+xml")) return true;
  const path = src.split("?")[0]?.split("#")[0] ?? "";
  return path.endsWith(".svg");
}

const CANVAS_FILL =
  /^(?:#000000?|black|#fff(?:fff)?|white|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*1\s*\)|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/i;

function isCanvasFill(value: string | null | undefined): boolean {
  return value != null && CANVAS_FILL.test(value.trim());
}

function isBlackFill(value: string | null | undefined): boolean {
  return value != null && /^(?:#000000?|black|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*1\s*\))$/i.test(value.trim());
}

function isBlackFilled(el: Element): boolean {
  const fill = el.getAttribute("fill");
  const styleFill = el.getAttribute("style")?.match(/fill:\s*([^;]+)/i)?.[1]?.trim();
  return isBlackFill(fill) || isBlackFill(styleFill);
}

function isCanvasFilled(el: Element): boolean {
  const fill = el.getAttribute("fill");
  const styleFill = el.getAttribute("style")?.match(/fill:\s*([^;]+)/i)?.[1]?.trim();
  return isCanvasFill(fill) || isCanvasFill(styleFill);
}

function isBackgroundRect(el: Element): boolean {
  if (el.tagName.toLowerCase() !== "rect") return false;

  const fill = el.getAttribute("fill");
  const styleFill = el.getAttribute("style")?.match(/fill:\s*([^;]+)/i)?.[1]?.trim();
  if (!isCanvasFill(fill) && !isCanvasFill(styleFill)) return false;

  const width = el.getAttribute("width") ?? "";
  const height = el.getAttribute("height") ?? "";
  return (
    width === "100%" ||
    height === "100%" ||
    (Number.parseFloat(width) >= 64 && Number.parseFloat(height) >= 64)
  );
}

function isExplicitNone(value: string | null | undefined): boolean {
  return value === "none" || value === "transparent";
}

const ACCENT = "var(--accent)";

function themeShapeElement(el: Element): void {
  el.removeAttribute("class");
  el.removeAttribute("style");

  const fill = el.getAttribute("fill");
  const stroke = el.getAttribute("stroke");
  const hasStroke = stroke != null && !isExplicitNone(stroke);
  const fillIsNone = isExplicitNone(fill);

  if (fillIsNone || (hasStroke && fill == null)) {
    el.setAttribute("fill", "none");
  } else {
    el.setAttribute("fill", ACCENT);
  }

  if (hasStroke) {
    el.setAttribute("stroke", ACCENT);
  }
}

/** Strip canvas backgrounds and remap icon fills to currentColor for theme tinting. */
function themeSvgMarkup(raw: string): string {
  const doc = new DOMParser().parseFromString(raw.trim(), "image/svg+xml");
  const svgEl = doc.documentElement;
  if (svgEl.tagName.toLowerCase() !== "svg") return raw;

  svgEl.querySelectorAll("style").forEach((style) => style.remove());

  svgEl.querySelectorAll("rect").forEach((rect) => {
    if (isBackgroundRect(rect)) rect.remove();
  });

  svgEl.querySelectorAll("path").forEach((path) => {
    if (!isCanvasFilled(path)) return;
    const d = path.getAttribute("d") ?? "";
    if (path.parentElement === svgEl || d.length > 100) path.remove();
  });

  const firstShape = svgEl.querySelector(":scope > rect, :scope > path, :scope > g");
  if (firstShape && (isBlackFilled(firstShape) || isCanvasFilled(firstShape))) {
    firstShape.remove();
  }

  svgEl.querySelectorAll("g").forEach((group) => {
    group.removeAttribute("class");
    group.removeAttribute("style");
    group.removeAttribute("fill");
    group.removeAttribute("stroke");
  });

  svgEl
    .querySelectorAll("path,circle,ellipse,polygon,polyline,rect,line")
    .forEach(themeShapeElement);

  svgEl.setAttribute("class", "project-logo-mark-inline");
  svgEl.setAttribute("focusable", "false");
  svgEl.setAttribute("aria-hidden", "true");
  svgEl.setAttribute("fill", "none");
  svgEl.removeAttribute("width");
  svgEl.removeAttribute("height");

  return svgEl.outerHTML;
}

function ThemedSvgLogo({
  src,
  className,
  onError,
}: {
  src: string;
  className?: string;
  onError: () => void;
}) {
  const [markup, setMarkup] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const proxySrc = `/api/project-logo?src=${encodeURIComponent(src)}`;

    fetch(proxySrc)
      .then((res) => {
        if (!res.ok) throw new Error("svg fetch failed");
        return res.text();
      })
      .then((text) => {
        if (!active) return;
        if (!text.includes("<svg")) throw new Error("not svg");
        setMarkup(themeSvgMarkup(text));
      })
      .catch(() => {
        if (active) onError();
      });

    return () => {
      active = false;
    };
  }, [src, onError]);

  return (
    <span
      className={cn("project-logo-mark project-logo-mark--svg", className)}
      style={{ color: "var(--accent)" }}
    >
      {markup ? (
        <span
          className="project-logo-mark-inner"
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      ) : null}
    </span>
  );
}

export function ProjectFeatureGraphic({
  title,
  type,
  className,
}: ProjectFeatureGraphicProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[240px] w-full flex-col overflow-hidden p-6 md:p-8 lg:min-h-[340px] lg:p-10",
        className,
      )}
      aria-hidden
    >
      {/* Ambient glow — follows active theme tokens */}
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[55%] w-[55%] rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-[15%] -right-[10%] h-[45%] w-[45%] rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl" />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="h-1 w-16 rounded-full bg-[var(--accent)]" />

        <p className="mono-label mt-6 text-[var(--text-muted)]">NOIRLY · FEATURED PROJECT</p>

        <span className="mt-4 inline-flex w-fit items-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
          {type}
        </span>

        <h3 className="font-display mt-5 max-w-[14ch] text-3xl font-semibold leading-tight tracking-tight text-[var(--text)] md:text-4xl lg:text-[2.75rem]">
          {title}
        </h3>

        {/* The description and the stack tags deliberately do not appear here.
            They are rendered verbatim in the text column immediately beside
            this plate, and printing them twice was both the duplication in the
            design and the reason the composition outgrew its panel. */}

        {/* Mock UI panel */}
        <div className="mt-auto hidden w-full max-w-xs shrink-0 rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--surface)] p-4 shadow-[var(--elev-1)] sm:block">
          <div className="h-2 w-20 rounded-full bg-[var(--accent)]" />
          <div className="mt-3 h-1.5 w-32 rounded-full bg-[var(--text-muted)]/30" />
          <div className="mt-4 space-y-2.5">
            {[0.9, 0.55, 0.35].map((opacity) => (
              <div
                key={opacity}
                className="flex items-center gap-3 rounded-[var(--r-md)] border border-[var(--hairline)] bg-[var(--bg-deep)] p-3"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full bg-[var(--accent)]"
                  style={{ opacity }}
                />
                <span className="h-2 flex-1 rounded-full bg-[var(--text)]/15" />
              </div>
            ))}
          </div>
        </div>

        <p className="mono-label mt-6 text-right text-[var(--text-muted)]">{slug || "project"}</p>
      </div>
    </div>
  );
}

export function ProjectLogo({
  title,
  logo,
  className,
}: {
  title: string;
  logo?: string | null;
  className?: string;
}) {
  // A logo path that 404s used to render the browser's broken-image glyph.
  // The initials mark below is a perfectly good stand-in, so fall through to it
  // whenever the file fails to load rather than only when the path is empty.
  const [failed, setFailed] = useState(false);
  const [svgThemingFailed, setSvgThemingFailed] = useState(false);

  // onError alone is not enough: the image is in the SSR HTML, so a 404 fires
  // its error event before hydration attaches the handler and the miss is
  // permanent. A complete image with no intrinsic width is a failed one.
  const catchAlreadyFailed = useCallback((node: HTMLImageElement | null) => {
    if (node !== null && node.complete && node.naturalWidth === 0) setFailed(true);
  }, []);

  if (logo && !failed) {
    if (isSvgLogo(logo) && !svgThemingFailed) {
      return (
        <ThemedSvgLogo
          src={logo}
          className={className}
          onError={() => setSvgThemingFailed(true)}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={catchAlreadyFailed}
        src={logo}
        alt=""
        width={48}
        height={48}
        onError={() => setFailed(true)}
        className={cn("h-12 w-12 rounded-[var(--r-md)] border border-[var(--hairline)] object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--r-md)] border border-[var(--hairline)] bg-[var(--accent-soft)] font-display text-sm font-semibold text-[var(--accent)]",
        className,
      )}
      aria-hidden
    >
      {initials(title)}
    </span>
  );
}
