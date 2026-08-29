"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal, StaggerGroup, RevealItem } from "@/components/motion/Reveal";
import { fadeUp, VIEWPORT, DURATION, EASE_OUT } from "@/lib/motion";
import { profile as defaultProfile } from "@/data/profile";
import { workExperience as defaultExperience } from "@/data/experience";
import type { Profile } from "@/data/profile";
import type { WorkExperience } from "@/data/experience";

export function Experience({
  workExperience = defaultExperience,
  profile = defaultProfile,
}: {
  workExperience?: WorkExperience[];
  profile?: Profile;
}) {
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 60%"],
  });
  const railFill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="section-rule relative">
      <div className="shell section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="03" eyebrow="Career" title="Work Experience" />
          <Reveal variants={fadeUp} delay={0.1}>
            <p className="lede max-w-sm md:text-right">
              {profile.experienceSubtitle}
            </p>
          </Reveal>
        </div>

        <ol ref={railRef} className="relative mt-10 space-y-5 pl-8 md:pl-12">
          {/* Timeline rail — fills as the reader scrolls through the roles. */}
          <div
            aria-hidden
            className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--hairline)] md:left-[7px]"
          >
            <motion.div
              className="absolute inset-0 origin-top bg-[var(--text)]"
              style={{ scaleY: railFill }}
            />
          </div>

          {workExperience.map((job, i) => (
            <motion.li
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATION.grand, ease: EASE_OUT, delay: i * 0.1 }}
              className="relative"
            >
              <motion.span
                aria-hidden
                className="absolute -left-8 top-8 h-[9px] w-[9px] rounded-full border border-[var(--text)] bg-[var(--bg)] md:-left-12"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.4, ease: EASE_OUT }}
              />

              <article className="surface grain overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="border-b border-[var(--hairline)] p-6 md:col-span-4 md:border-r md:border-b-0 md:p-8">
                    <h3 className="display-md">{job.role}</h3>
                    <p className="mono-label mt-3 text-[var(--text-secondary)]">
                      {job.company}
                    </p>
                    <p className="mono-label mt-2">{job.period}</p>
                  </div>

                  <StaggerGroup
                    gap={0.05}
                    as="ul"
                    className="space-y-4 p-6 md:col-span-8 md:p-8"
                  >
                    {job.achievements.map((item, j) => (
                      <RevealItem key={item} as="li" className="flex gap-4">
                        <span className="mono-label w-6 shrink-0 pt-0.5 tabular-nums">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <p className="copy">{item}</p>
                      </RevealItem>
                    ))}
                  </StaggerGroup>
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
