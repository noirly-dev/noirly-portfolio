import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Server,
  Cloud,
  Check,
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  Monitor,
  Database,
  type LucideIcon,
} from "lucide-react";
import { profile } from "@/data/profile";
import { skillCards, type SkillIconKey } from "@/data/skills";
import { featuredProjects } from "@/data/projects";
import { workExperience } from "@/data/experience";

interface ArchLayer {
  id: string;
  label: string;
  Icon: LucideIcon;
  tech: string[];
}

const archLayers: ArchLayer[] = [
  {
    id: "ui",
    label: "User Interface Layer",
    Icon: Monitor,
    tech: ["React", "Next.js", "React Native"],
  },
  {
    id: "api",
    label: "API Layer",
    Icon: Server,
    tech: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    id: "db",
    label: "Database Layer",
    Icon: Database,
    tech: ["MongoDB", "Firebase"],
  },
  {
    id: "deploy",
    label: "Deployment Layer",
    Icon: Cloud,
    tech: ["AWS", "Docker", "CI/CD"],
  },
];

const SKILL_ICON_MAP: Record<SkillIconKey, LucideIcon> = {
  Globe,
  Smartphone,
  Server,
  Cloud,
};

export default function Home() {
  const { heroStats, techChips } = profile;

  return (
    <main className="page-shell flex-1">
      {/* Hero */}
      <section id="home" className="border-b border-dashed border-[var(--hairline)]">
        <div className="section-inner grid gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="section-eyebrow">{profile.badge}</p>
              <p className="mt-5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                {profile.name}
              </p>
              <h1 className="mt-3 max-w-[14ch] font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.88] font-bold tracking-[-0.06em] uppercase">
                <span className="text-perforated">{profile.title}</span>
                <br />
                {profile.titleAccent}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                {profile.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/#work" className="btn-primary">
                View work
                <ArrowRight size={14} />
              </Link>
              <Link href="/#contact" className="btn-secondary">
                {profile.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 border border-dashed border-[var(--hairline)]">
              {heroStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-[var(--surface)] px-3 py-5 sm:px-4 sm:py-6 ${
                    index > 0 ? "border-l border-dashed border-[var(--hairline)]" : ""
                  }`}
                >
                  <p className="matrix-numeral text-2xl sm:text-3xl">{stat.value}</p>
                  <p className="mt-3 font-mono text-[10px] leading-snug tracking-[0.12em] uppercase text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden flex-1 flex-col border border-dashed border-[var(--hairline)] bg-[var(--surface)] lg:flex">
              <div className="flex items-center border-b border-dashed border-[var(--hairline)] px-5 py-4">
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                  core_stack
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                <ul className="space-y-3">
                  {profile.heroHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={14} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                      <span className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 border-t border-dashed border-[var(--hairline)] pt-4">
                  {techChips.map((chip) => (
                    <span key={chip} className="tag-pill">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-dashed border-[var(--hairline)]">
        <div className="section-inner grid gap-12 py-16 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-eyebrow">01 · About</p>
            <h2 className="section-heading mt-4">{profile.aboutTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]">
              {profile.aboutBio}
            </p>
            <ul className="mt-8 space-y-4">
              {profile.aboutPoints.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-dashed border-[var(--hairline)]">
                    <Check size={11} />
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-dashed border-[var(--hairline)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-dashed border-[var(--hairline)] px-5 py-4">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                system_architecture
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                production
              </span>
            </div>
            <div className="flex flex-col p-5">
              {archLayers.map((layer, i) => (
                <div key={layer.id} className="flex flex-col items-center">
                  <div className="w-full border border-dashed border-[var(--hairline)] bg-[var(--bg)] p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-dashed border-[var(--hairline)]">
                        <layer.Icon size={15} />
                      </div>
                      <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--text-muted)]">
                        {layer.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {layer.tech.map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < archLayers.length - 1 ? (
                    <div className="relative my-1 h-8 w-full">
                      <div className="mx-auto h-full w-px border-l border-dashed border-[var(--hairline)]" />
                      <div className="arch-dot" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="border-b border-dashed border-[var(--hairline)]">
        <div className="section-inner py-16 md:py-20">
          <div className="mb-10 max-w-2xl md:mb-12">
            <p className="section-eyebrow">02 · Expertise</p>
            <h2 className="section-heading mt-4">Technical Stack</h2>
            <p className="section-subtitle mt-4">{profile.stackSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 border border-dashed border-[var(--hairline)] md:grid-cols-2 xl:grid-cols-4">
            {skillCards.map((card, index) => {
              const Icon = SKILL_ICON_MAP[card.iconKey];
              const borders = [
                "",
                "border-t md:border-t-0 md:border-l xl:border-l",
                "border-t md:border-l-0 xl:border-l",
                "border-t md:border-l xl:border-l",
              ][index];
              return (
                <div
                  key={card.title}
                  className={`border-dashed border-[var(--hairline)] bg-[var(--surface)] p-6 ${borders}`}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-dashed border-[var(--hairline)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-semibold tracking-[-0.02em] uppercase">
                      {card.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="border-b border-dashed border-[var(--hairline)]">
        <div className="section-inner py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-eyebrow">03 · Career</p>
              <h2 className="section-heading mt-4">Work Experience</h2>
            </div>
            <p className="section-subtitle md:text-right">{profile.experienceSubtitle}</p>
          </div>

          <div className="space-y-4">
            {workExperience.map((job) => (
              <article
                key={job.company}
                className="border border-dashed border-[var(--hairline)] bg-[var(--surface)]"
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="border-b border-dashed border-[var(--hairline)] p-6 md:col-span-4 md:border-r md:border-b-0 md:p-8">
                    <h3 className="font-display text-xl font-bold tracking-[-0.03em] uppercase">
                      {job.role}
                    </h3>
                    <p className="mt-3 font-mono text-xs tracking-[0.1em] uppercase text-[var(--text-muted)]">
                      {job.company}
                    </p>
                    <p className="mt-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--text-muted)]">
                      {job.period}
                    </p>
                  </div>
                  <div className="space-y-4 p-6 md:col-span-8 md:p-8">
                    {job.achievements.map((item, j) => (
                      <div key={j} className="flex gap-4">
                        <span className="matrix-numeral w-7 shrink-0 text-sm text-[var(--text-muted)]">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="border-b border-dashed border-[var(--hairline)]">
        <div className="section-inner py-16 md:py-20">
          <div className="mb-10 max-w-2xl md:mb-12">
            <p className="section-eyebrow">04 · Portfolio</p>
            <h2 className="section-heading mt-4">Featured Projects</h2>
            <p className="section-subtitle mt-4">{profile.workSubtitle}</p>
          </div>

          <div className="space-y-5">
            {featuredProjects.map((project, index) => (
              <article
                key={project.title}
                className="border border-dashed border-[var(--hairline)] bg-[var(--surface)]"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="relative min-h-[240px] bg-[var(--bg)] lg:w-[58%] lg:min-h-[320px]">
                    {project.featureGraphic ? (
                      <>
                        <Image
                          src={project.featureGraphic}
                          alt={`${project.title} feature graphic`}
                          fill
                          className="object-contain p-4 dark:hidden"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          priority={index === 0}
                        />
                        {project.featureGraphicDark ? (
                          <Image
                            src={project.featureGraphicDark}
                            alt={`${project.title} feature graphic`}
                            fill
                            className="hidden object-contain p-4 dark:block"
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            priority={index === 0}
                          />
                        ) : null}
                      </>
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-between gap-6 border-t border-dashed border-[var(--hairline)] p-6 md:p-8 lg:w-[42%] lg:border-t-0 lg:border-l">
                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tag) => (
                          <span key={tag} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        {project.logo ? (
                          <div className="h-11 w-11 shrink-0 overflow-hidden border border-dashed border-[var(--hairline)]">
                            <Image
                              src={project.logo}
                              alt={`${project.title} logo`}
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                            {String(index + 1).padStart(2, "0")} · {project.type}
                          </p>
                          <h3 className="mt-1 font-display text-xl font-bold tracking-[-0.03em] uppercase">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        View live product
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="section-inner py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">05 · Contact</p>
            <h2 className="section-heading mt-4">{profile.ctaTitle}</h2>
            <p className="section-subtitle mx-auto mt-4">{profile.ctaSubtitle}</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 border border-dashed border-[var(--hairline)] sm:grid-cols-3">
            <a
              href={profile.contact.email.href}
              className="group flex min-h-[8.5rem] flex-col justify-between bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)] sm:border-r sm:border-dashed sm:border-[var(--hairline)]"
            >
              <Mail size={20} className="opacity-70" />
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase opacity-55">
                  Email
                </p>
                <p className="mt-2 truncate text-sm font-medium">
                  {profile.contact.email.label}
                </p>
              </div>
            </a>
            <a
              href={profile.contact.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[8.5rem] flex-col justify-between border-t border-dashed border-[var(--hairline)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)] sm:border-t-0 sm:border-r"
            >
              <Linkedin size={20} className="opacity-70" />
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase opacity-55">
                  LinkedIn
                </p>
                <p className="mt-2 text-sm font-medium">{profile.contact.linkedin.label}</p>
              </div>
            </a>
            <a
              href={profile.contact.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[8.5rem] flex-col justify-between border-t border-dashed border-[var(--hairline)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)] sm:border-t-0"
            >
              <Github size={20} className="opacity-70" />
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase opacity-55">
                  GitHub
                </p>
                <p className="mt-2 text-sm font-medium">{profile.contact.github.label}</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
