"use client";

import { useCallback, useState } from "react";
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
  const path = src.split("?")[0]?.split("#")[0] ?? "";
  return path.toLowerCase().endsWith(".svg");
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

  // onError alone is not enough: the image is in the SSR HTML, so a 404 fires
  // its error event before hydration attaches the handler and the miss is
  // permanent. A complete image with no intrinsic width is a failed one.
  const catchAlreadyFailed = useCallback((node: HTMLImageElement | null) => {
    if (node !== null && node.complete && node.naturalWidth === 0) setFailed(true);
  }, []);

  if (logo && !failed) {
    if (isSvgLogo(logo)) {
      return (
        <span
          className={cn(
            "project-logo-mark project-logo-mark--svg",
            className,
          )}
        >
          {/* Hidden probe — mask rendering has no onError, so detect 404s the same way as <img>. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={catchAlreadyFailed}
            src={logo}
            alt=""
            onError={() => setFailed(true)}
            className="sr-only"
            aria-hidden
          />
          <span
            className="project-logo-mark-svg"
            style={{
              WebkitMaskImage: `url("${logo}")`,
              maskImage: `url("${logo}")`,
            }}
            aria-hidden
          />
        </span>
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
