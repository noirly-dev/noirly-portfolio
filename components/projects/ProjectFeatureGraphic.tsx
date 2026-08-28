"use client";

import { cn } from "@/lib/utils";

export interface ProjectFeatureGraphicProps {
  title: string;
  type: string;
  description?: string;
  stack?: string[];
  className?: string;
}

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) ?? "N").toUpperCase();
}

export function ProjectFeatureGraphic({
  title,
  type,
  description,
  stack = [],
  className,
}: ProjectFeatureGraphicProps) {
  const tags = stack.slice(0, 5);
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

        {description ? (
          <p className="copy mt-4 max-w-md text-sm text-[var(--text-secondary)] md:text-base">
            {description.length > 120 ? `${description.slice(0, 119)}…` : description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Mock UI panel */}
          <div className="hidden w-full max-w-xs shrink-0 rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--surface)] p-4 shadow-[var(--elev-1)] sm:block">
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

          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
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
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
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
