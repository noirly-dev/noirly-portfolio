export type ArchIconKey = "Monitor" | "Server" | "Database" | "Cloud";

export interface ArchLayer {
  id: string;
  label: string;
  iconKey: ArchIconKey;
  tech: string[];
}

/** Top-to-bottom slice of a typical production stack, used in the About section. */
export const archLayers: ArchLayer[] = [
  {
    id: "ui",
    label: "User Interface",
    iconKey: "Monitor",
    tech: ["React", "Next.js", "React Native"],
  },
  {
    id: "api",
    label: "API Layer",
    iconKey: "Server",
    tech: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    id: "db",
    label: "Data Layer",
    iconKey: "Database",
    tech: ["MongoDB", "Firebase"],
  },
  {
    id: "deploy",
    label: "Deployment",
    iconKey: "Cloud",
    tech: ["AWS", "Docker", "CI/CD"],
  },
];
