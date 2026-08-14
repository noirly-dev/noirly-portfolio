export type SkillIconKey = "Globe" | "Smartphone" | "Server" | "Cloud";

export interface SkillCard {
  iconKey: SkillIconKey;
  title: string;
  tags: string[];
  color: string;
}

export const skillCards: SkillCard[] = [
  {
    iconKey: "Globe",
    title: "Frontend",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    color: "var(--text)",
  },
  {
    iconKey: "Smartphone",
    title: "Mobile",
    tags: ["React Native", "iOS", "Android", "Redux"],
    color: "var(--text)",
  },
  {
    iconKey: "Server",
    title: "Backend",
    tags: ["Node.js", "Express", "MongoDB", "REST APIs"],
    color: "var(--text)",
  },
  {
    iconKey: "Cloud",
    title: "DevOps",
    tags: ["AWS", "Docker", "CI/CD", "GitHub Actions"],
    color: "var(--text)",
  },
];
