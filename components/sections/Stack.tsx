"use client";

import { Cloud, Globe, Server, Smartphone, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { StaggerGroup, RevealItem } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/motion";
import { profile as defaultProfile } from "@/data/profile";
import { skillCards as defaultSkillCards, type SkillCard, type SkillIconKey } from "@/data/skills";
import type { Profile } from "@/data/profile";

const SKILL_ICONS: Record<SkillIconKey, LucideIcon> = {
  Globe,
  Smartphone,
  Server,
  Cloud,
};

export function Stack({
  skillCards = defaultSkillCards,
  profile = defaultProfile,
}: {
  skillCards?: SkillCard[];
  profile?: Profile;
}) {
  return (
    <section id="stack" className="relative">
      <div className="shell section-y">
        <SectionHeading
          index="02"
          eyebrow="Expertise"
          title="Technical Stack"
          subtitle={profile.stackSubtitle}
          className="max-w-2xl"
        />

        <StaggerGroup
          gap={0.08}
          as="ul"
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {skillCards.map((card, i) => {
            const Icon = SKILL_ICONS[card.iconKey];
            return (
              <RevealItem key={card.title} as="li" variants={fadeUp}>
                <SpotlightCard animateIn={false} className="h-full p-6">
                  <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>

                  <span className="mt-5 flex h-11 w-11 items-center justify-center rounded-[var(--r-md)] border border-[var(--hairline)] bg-[color-mix(in_srgb,var(--text)_5%,transparent)] text-[var(--text)]">
                    <Icon size={18} aria-hidden />
                  </span>

                  <h3 className="display-md mt-5">{card.title}</h3>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
