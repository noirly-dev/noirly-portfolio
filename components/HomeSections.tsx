"use client";

import dynamic from "next/dynamic";
import type { Profile } from "@/data/profile";
import type { SkillCard } from "@/data/skills";
import type { FeaturedProject } from "@/data/projects";
import type { WorkExperience } from "@/data/experience";
import { Hero } from "@/components/sections/Hero";

/**
 * Below-the-fold sections are separate client chunks so Lighthouse "unused
 * JavaScript" does not charge the hero for About/Work motion code on first paint.
 * SSR stays on so content and SEO are unchanged.
 */
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => m.About),
);
const Stack = dynamic(() =>
  import("@/components/sections/Stack").then((m) => m.Stack),
);
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((m) => m.Experience),
);
const Work = dynamic(() =>
  import("@/components/sections/Work").then((m) => m.Work),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact),
);

interface HomeSectionsProps {
  profile: Profile;
  skillCards: SkillCard[];
  experience: WorkExperience[];
  projects: FeaturedProject[];
}

export function HomeSections({
  profile,
  skillCards,
  experience,
  projects,
}: HomeSectionsProps) {
  return (
    <div className="flex-1">
      <Hero profile={profile} />
      <About profile={profile} />
      <Stack skillCards={skillCards} profile={profile} />
      <Experience workExperience={experience} profile={profile} />
      <Work projects={projects} profile={profile} />
      <Contact profile={profile} />
    </div>
  );
}
