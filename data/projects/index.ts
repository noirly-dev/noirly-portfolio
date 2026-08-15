export interface Project {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  imageUrlDark?: string;
  logoUrl?: string;
  logoUrlDark?: string;
  url: string;
  githubUrl: string;
  category: string;
}

export const projects: Project[] = [
  {
    title: "Noirly Flow",
    description:
      "Boards, workspaces, and realtime collaboration for Noirly products — signed in through Noirly Identity.",
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    imageUrl: "/projects/noirly-flow-feature-light.png",
    imageUrlDark: "/projects/noirly-flow-feature-dark.png",
    logoUrl: "/projects/noirly-flow-light.png",
    logoUrlDark: "/projects/noirly-flow-dark.png",
    url: "https://noirly.flow.aneesh-pissay.in/",
    githubUrl: "#",
    category: "Web",
  },
  {
    title: "Noirly Ledger",
    description:
      "Personal and team money tracking — budgets, expenses, pools, approvals, and reports across workspaces.",
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    imageUrl: "/projects/noirly-ledger-feature-light.png",
    imageUrlDark: "/projects/noirly-ledger-feature-dark.png",
    logoUrl: "/projects/noirly-ledger-light.png",
    logoUrlDark: "/projects/noirly-ledger-dark.png",
    url: "https://noirly.ledger.aneesh-pissay.in/",
    githubUrl: "#",
    category: "Web",
  },
  {
    title: "Noirly Pulse",
    description:
      "Realtime chat for workspaces — channels, DMs, threads, reactions, and presence.",
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    imageUrl: "/projects/noirly-pulse-feature-light.png",
    imageUrlDark: "/projects/noirly-pulse-feature-dark.png",
    logoUrl: "/projects/noirly-pulse-light.png",
    logoUrlDark: "/projects/noirly-pulse-dark.png",
    url: "https://noirly.pulse.aneesh-pissay.in/",
    githubUrl: "#",
    category: "Web",
  },
];
