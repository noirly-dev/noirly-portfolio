import { unstable_cache } from "next/cache";
import { type SkillCard, type SkillIconKey } from "@/data/skills";
import type { Profile } from "@/data/profile";
import type { FeaturedProject } from "@/data/projects";
import type { Project as CatalogProject } from "@/data/projects/index";
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
  catalogProjects: CatalogProject[];
  experience: WorkExperience[];
  skills: DynamicSkill[];
  skillCards: SkillCard[];
  theme: PortfolioTheme;
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

function mapFeaturedProjects(projects: Array<Record<string, unknown>>): FeaturedProject[] {
  return projects.map((p) => ({
    title: String(p.title),
    type: String(p.type),
    description: String(p.description),
    stack: (p.stack as string[]) ?? [],
    url: String(p.url),
    logo: (p.logo as string | null) ?? null,
  }));
}

function mapCatalogProjects(projects: Array<Record<string, unknown>>): CatalogProject[] {
  return projects.map((p) => ({
    title: String(p.title),
    description: String(p.description),
    technologies: (p.stack as string[]) ?? [],
    imageUrl: (p.featureGraphic as string | null) ?? undefined,
    imageUrlDark: (p.featureGraphicDark as string | null) ?? undefined,
    logoUrl: (p.logo as string | null) ?? undefined,
    logoUrlDark: (p.logoDark as string | null) ?? undefined,
    url: String(p.url),
    githubUrl: String(p.githubUrl ?? "#"),
    category: String(p.category ?? "Web"),
  }));
}

async function fetchFromApi(): Promise<PortfolioContent> {
  const base = (
    process.env.PORTFOLIO_CONTENT_API_URL ?? process.env.SITE_CONTENT_API_URL
  )?.replace(/\/$/, "");

  if (!base) {
    throw new Error(
      "PORTFOLIO_CONTENT_API_URL is required — portfolio content is loaded from the admin API only.",
    );
  }

  let res: Response;
  try {
    res = await fetch(`${base}/api/public/content`, {
      next: { revalidate: 60, tags: ["portfolio-content"] },
    });
  } catch (error) {
    throw new Error("Failed to reach portfolio content API.", { cause: error });
  }

  if (!res.ok) {
    throw new Error(
      `Portfolio content API returned ${res.status} ${res.statusText}.`,
    );
  }

  const data = await res.json();
  const skills: DynamicSkill[] = data.skills ?? [];
  const rawProjects = (data.projects as Array<Record<string, unknown>>) ?? [];

  return {
    profile: data.profile as Profile,
    projects: mapFeaturedProjects(rawProjects),
    catalogProjects: mapCatalogProjects(rawProjects),
    experience: data.experience ?? [],
    skills,
    skillCards: toSkillCards(skills),
    theme: (data.theme as PortfolioTheme) ?? { id: DEFAULT_THEME_ID, name: "Warm Gold" },
  };
}

export const getPortfolioContent = unstable_cache(
  fetchFromApi,
  ["portfolio-content"],
  { revalidate: 60 },
);
