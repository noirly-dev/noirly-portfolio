import { unstable_cache } from "next/cache";
import { profile as staticProfile } from "@/data/profile";
import { featuredProjects as staticProjects } from "@/data/projects";
import { workExperience as staticExperience } from "@/data/experience";
import { skills as staticSkills } from "@/data/skills/index";
import { skillCards as staticSkillCards, type SkillCard, type SkillIconKey } from "@/data/skills";
import type { Profile } from "@/data/profile";
import type { FeaturedProject } from "@/data/projects";
import type { WorkExperience } from "@/data/experience";
import { DEFAULT_THEME_ID } from "@/lib/themes/index";

export interface DynamicSkill {
  label: string;
  category: string;
  color: string;
  iconKey: string;
}

export interface PortfolioTheme {
  id: string;
  name: string;
}

export interface PortfolioContent {
  profile: Profile;
  projects: FeaturedProject[];
  experience: WorkExperience[];
  skills: DynamicSkill[];
  skillCards: SkillCard[];
  theme: PortfolioTheme;
  source: "api" | "static";
}

const CATEGORY_ICON: Record<string, SkillIconKey> = {
  "Frontend & Languages": "Globe",
  "Mobile & Backend": "Smartphone",
  "DevOps & Cloud": "Cloud",
  "Testing & QA": "Server",
};

function toSkillCards(skills: DynamicSkill[]): SkillCard[] {
  const grouped = new Map<string, string[]>();
  for (const skill of skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill.label);
    grouped.set(skill.category, list);
  }

  return Array.from(grouped.entries()).map(([category, tags]) => ({
    iconKey: CATEGORY_ICON[category] ?? "Globe",
    title: category.split(" & ")[0] ?? category,
    tags,
    color: "var(--text)",
  }));
}

function mapProjects(projects: Array<Record<string, unknown>>): FeaturedProject[] {
  return projects.map((p) => ({
    title: String(p.title),
    type: String(p.type),
    description: String(p.description),
    stack: (p.stack as string[]) ?? [],
    url: String(p.url),
    logo: (p.logo as string | null) ?? null,
  }));
}

async function fetchFromApi(): Promise<PortfolioContent | null> {
  const base = process.env.PORTFOLIO_CONTENT_API_URL?.replace(/\/$/, "");
  if (!base) return null;

  const res = await fetch(`${base}/api/public/content`, {
    next: { revalidate: 60, tags: ["portfolio-content"] },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const skills: DynamicSkill[] = data.skills ?? [];

  return {
    profile: data.profile as Profile,
    projects: mapProjects(data.projects ?? []),
    experience: data.experience ?? [],
    skills,
    skillCards: toSkillCards(skills),
    theme: (data.theme as PortfolioTheme) ?? { id: DEFAULT_THEME_ID, name: "Warm Gold" },
    source: "api",
  };
}

export const getPortfolioContent = unstable_cache(
  async (): Promise<PortfolioContent> => {
    const remote = await fetchFromApi();
    if (remote) return remote;

    return {
      profile: staticProfile,
      projects: staticProjects,
      experience: staticExperience,
      skills: staticSkills.map((s) => ({
        label: s.label,
        category: s.category,
        color: s.color,
        iconKey: s.label.toLowerCase().replace(/\s+/g, "-"),
      })),
      skillCards: staticSkillCards,
      theme: { id: DEFAULT_THEME_ID, name: "Warm Gold" },
      source: "static",
    };
  },
  ["portfolio-content"],
  { revalidate: 60 },
);
