"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal, StaggerGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Counter } from "@/components/motion/Counter";
import { Marquee } from "@/components/motion/Marquee";
import { blurUp, fadeUp, DURATION, EASE_OUT } from "@/lib/motion";
import { profile as defaultProfile } from "@/data/profile";
import type { Profile } from "@/data/profile";

/** Splits "5+" into 5 and "+" so the number can count up and the suffix can't. */
function splitStat(value: string): { number: number; suffix: string } | null {
  const match = /^(\d+)(\D*)$/.exec(value.trim());
  if (!match) return null;
  return { number: Number(match[1]), suffix: match[2] };
}

export function Hero({ profile = defaultProfile }: { profile?: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Content drifts up and dims as the hero leaves — a shallow, non-jacking parallax.
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { heroStats, techChips, heroHighlights } = profile;

  return (
    <section id="home" ref={ref} className="relative overflow-hidden">
      {/* Ambient light. Decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aura -top-40 left-[-10%] h-[32rem] w-[32rem]" />
        <div className="aura right-[-15%] top-20 h-[26rem] w-[26rem]" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="shell relative grid items-center gap-14 pt-14 pb-20 md:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,1fr)] lg:gap-16 lg:pt-24 lg:pb-28"
      >
        <div className="flex flex-col">
          <Reveal variants={fadeUp}>
            <p className="eyebrow">{profile.badge}</p>
          </Reveal>

          <h1 className="mt-7 max-w-[15ch]">
            <TextReveal
              text={profile.title}
              delay={0.08}
              className="display-xl block text-[var(--text)]"
            />
            {/* The two lines are separate block elements; without this the
                accessible name reads "ScalableWeb" as one word. */}{" "}
            <TextReveal
              text={profile.titleAccent}
              delay={0.18}
              outline
              className="display-xl block"
            />
          </h1>

          <Reveal variants={fadeUp} delay={0.3}>
            <p className="lede mt-8">{profile.description}</p>
          </Reveal>

          <StaggerGroup gap={0.07} delay={0.38} className="mt-10 flex flex-wrap gap-3">
            <RevealItem>
              <Magnetic>
                <Link href="/#work" className="btn btn-solid">
                  View work
                  <ArrowUpRight size={14} aria-hidden />
                </Link>
              </Magnetic>
            </RevealItem>
            <RevealItem>
              <Magnetic>
                <Link href="/#contact" className="btn btn-ghost">
                  {profile.secondaryCta}
                </Link>
              </Magnetic>
            </RevealItem>
          </StaggerGroup>

          <StaggerGroup
            gap={0.08}
            delay={0.45}
            as="ul"
            className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--hairline)]"
          >
            {heroStats.map((stat) => {
              const parsed = splitStat(stat.value);
              return (
                <RevealItem
                  key={stat.label}
                  as="li"
                  className="bg-[var(--bg)] px-4 py-5 sm:px-5 sm:py-6"
                >
                  <p className="numeral text-2xl sm:text-[1.75rem]">
                    {parsed ? (
                      <Counter value={parsed.number} suffix={parsed.suffix} />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="mono-label mt-2.5 leading-snug">{stat.label}</p>
                </RevealItem>
              );
            })}
          </StaggerGroup>
        </div>

        {/* Capability panel */}
        <Reveal variants={blurUp} delay={0.25} className="w-full">
          <div className="surface grain overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--hairline)] px-5 py-4">
              <span className="mono-label">core_stack</span>
              <span className="flex items-center gap-2">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <span className="mono-label">available</span>
              </span>
            </div>

            <StaggerGroup gap={0.08} delay={0.1} as="ul" className="space-y-3.5 p-5">
              {heroHighlights.map((item) => (
                <RevealItem key={item} as="li" className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--hairline-strong)]">
                    <Check size={11} aria-hidden />
                  </span>
                  <span className="copy">{item}</span>
                </RevealItem>
              ))}
            </StaggerGroup>

            <div className="border-t border-[var(--hairline)] py-4">
              <Marquee items={techChips} speed={34} />
            </div>
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: DURATION.slow, ease: EASE_OUT }}
        className="shell relative hidden pb-10 lg:block"
      >
        <motion.span
          className="mono-label inline-flex items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={13} />
          Scroll
        </motion.span>
      </motion.div>
    </section>
  );
}
