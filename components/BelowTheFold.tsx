"use client";

import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import type { Profile } from "@/data/profile";
import type { SkillCard } from "@/data/skills";
import type { FeaturedProject } from "@/data/projects";
import type { WorkExperience } from "@/data/experience";

export interface BelowTheFoldProps {
  profile: Profile;
  skillCards: SkillCard[];
  experience: WorkExperience[];
  projects: FeaturedProject[];
}

/**
 * Everything under the hero — one async chunk so Lighthouse does not charge
 * About/Work/Experience motion code against first paint.
 */
export function BelowTheFold({
  profile,
  skillCards,
  experience,
  projects,
}: BelowTheFoldProps) {
  return (
    <>
      <About profile={profile} />
      <Stack skillCards={skillCards} profile={profile} />
      <Experience workExperience={experience} profile={profile} />
      <Work projects={projects} profile={profile} />
      <Contact profile={profile} />
    </>
  );
}
