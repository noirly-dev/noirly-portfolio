"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Magnetic, SpotlightCard, TiltCard } from "@noirly-dev/ui/motion";
import {
  ProjectFeatureGraphic,
  ProjectLogo,
} from "@/components/projects/ProjectFeatureGraphic";
import { cn } from "@/lib/utils";
import { profile as defaultProfile } from "@/data/profile";
import { featuredProjects as defaultProjects, type FeaturedProject } from "@/data/projects";
import type { Profile } from "@/data/profile";

interface ProjectRowProps {
  project: FeaturedProject;
  index: number;
}

function ProjectRow({ project, index }: ProjectRowProps) {
  const flip = index % 2 === 1;

  return (
    // <TiltCard> owns the perspective and the pointer maths; <SpotlightCard>
    // keeps its own scroll entrance and cursor spotlight. Nesting them this way
    // means the tilt transform and the reveal transform never share an element.
    <TiltCard>
      <SpotlightCard
        as="article"
        lift={false}
        className="group h-full"
      >
        <div
          className={cn(
            "flex flex-col lg:flex-row",
            flip && "lg:flex-row-reverse",
          )}
        >
          {/* The graphic is a rendered composition, not a photograph. It used to
              sit in an `inset-[-6%]` box with a scroll-parallax translate, which
              crops ~38px off each side and up to 12% off the top or bottom — fine
              for an image, but it sliced this plate's padding and its bottom panel,
              and left nothing lined up with the card edges. It now fills the column
              exactly and sizes to its own content. */}
          <div className="relative flex min-h-[240px] overflow-hidden bg-[var(--bg-deep)] lg:min-h-[340px] lg:w-[56%]">
            <ProjectFeatureGraphic title={project.title} type={project.type} />
          </div>

          <div
            className={cn(
              "flex flex-col justify-between gap-8 border-t border-[var(--hairline)] p-6 md:p-9 lg:w-[44%] lg:border-t-0",
              flip ? "lg:border-r" : "lg:border-l",
            )}
          >
            <div>
              <div className="flex items-center gap-4">
                <ProjectLogo title={project.title} logo={project.logo} />
                <div>
                  <p className="mono-label">
                    {String(index + 1).padStart(2, "0")} — {project.type}
                  </p>
                  <h3 className="display-md mt-1.5">{project.title}</h3>
                </div>
              </div>

              <p className="copy mt-6">{project.description}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Magnetic>
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  data-cursor="link"
                >
                  View live product
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </TiltCard>
  );
}

export function Work({
  projects = defaultProjects,
  profile = defaultProfile,
}: {
  projects?: FeaturedProject[];
  profile?: Profile;
}) {
  return (
    <section id="work" className="section-rule relative">
      <div className="shell section-y">
        <SectionHeading
          index="04"
          eyebrow="Selected Work"
          title="Featured Projects"
          subtitle={profile.workSubtitle}
          className="max-w-2xl"
        />

        <div className="mt-10 space-y-5">
          {projects.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
