"use client";

import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Two-digit index, e.g. "01". */
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "start" | "center";
}

/** Consistent section header: numbered eyebrow, masked title, optional lede. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  className,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal variants={fadeUp}>
        <p className="eyebrow">
          {index} — {eyebrow}
        </p>
      </Reveal>

      <TextReveal
        as="h2"
        text={title}
        delay={0.05}
        className="display-lg mt-5 text-[var(--text)]"
      />

      {subtitle ? (
        <Reveal variants={fadeUp} delay={0.12}>
          <p className={cn("lede mt-5", align === "center" && "mx-auto")}>
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
