export interface FeaturedProject {
  title: string;
  type: string;
  description: string;
  stack: string[];
  url: string;
  featureGraphic: string | null;
  featureGraphicDark: string | null;
  logo: string | null;
  logoDark: string | null;
}

export const featuredProjects: FeaturedProject[] = [
  {
    title: "Noirly Flow",
    type: "Task Management",
    description:
      "Boards, workspaces, and realtime collaboration for Noirly products — signed in through Noirly Identity.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.flow.aneesh-pissay.in/",
    featureGraphic: "/projects/noirly-flow-feature-light.png",
    featureGraphicDark: "/projects/noirly-flow-feature-dark.png",
    logo: "/projects/noirly-flow-light.png",
    logoDark: "/projects/noirly-flow-dark.png",
  },
  {
    title: "Noirly Ledger",
    type: "Finance",
    description:
      "Personal and team money tracking — budgets, expenses, pools, approvals, and reports across workspaces.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.ledger.aneesh-pissay.in/",
    featureGraphic: "/projects/noirly-ledger-feature-light.png",
    featureGraphicDark: "/projects/noirly-ledger-feature-dark.png",
    logo: "/projects/noirly-ledger-light.png",
    logoDark: "/projects/noirly-ledger-dark.png",
  },
  {
    title: "Noirly Pulse",
    type: "Messaging",
    description:
      "Realtime chat for workspaces — channels, DMs, threads, reactions, and presence.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.pulse.aneesh-pissay.in/",
    featureGraphic: "/projects/noirly-pulse-feature-light.png",
    featureGraphicDark: "/projects/noirly-pulse-feature-dark.png",
    logo: "/projects/noirly-pulse-light.png",
    logoDark: "/projects/noirly-pulse-dark.png",
  },
];
