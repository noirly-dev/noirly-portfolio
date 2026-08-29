"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Magnetic } from "@/components/motion/Magnetic";
import {
  ProjectFeatureGraphic,
  ProjectLogo,
} from "@/components/projects/ProjectFeatureGraphic";
import { cardIn, VIEWPORT } from "@/lib/motion";
import { profile as defaultProfile } from "@/data/profile";
import { featuredProjects as defaultProjects, type FeaturedProject } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Profile } from "@/data/profile";

interface ProjectRowProps {
  project: FeaturedProject;
  index: number;
}

function ProjectRow({ project, index }: ProjectRowProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const flip = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      variants={cardIn}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className="surface grain group overflow-hidden"
    >
      <div
        className={cn(
          "flex flex-col lg:flex-row",
          flip && "lg:flex-row-reverse",
        )}
      >
        <div className="relative min-h-[240px] overflow-hidden bg-[var(--bg-deep)] lg:min-h-[340px] lg:w-[56%]">
          <motion.div style={{ y: imageY }} className="absolute inset-[-6%]">
            <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
              <ProjectFeatureGraphic
                title={project.title}
                type={project.type}
                description={project.description}
                stack={project.stack}
              />
            </div>
          </motion.div>
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
    </motion.article>
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
          eyebrow="Portfolio"
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
