export interface FeaturedProject {
  title: string;
  type: string;
  description: string;
  stack: string[];
  url: string;
  logo: string | null;
}

export const featuredProjects: FeaturedProject[] = [
  {
    title: "Noirly Flow",
    type: "Task Management",
    description:
      "Boards, workspaces, and realtime collaboration for Noirly products — signed in through Noirly Identity.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.flow.aneesh-pissay.in/",
    logo: "/projects/noirly-flow-light.png",
  },
  {
    title: "Noirly Ledger",
    type: "Finance",
    description:
      "Personal and team money tracking — budgets, expenses, pools, approvals, and reports across workspaces.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.ledger.aneesh-pissay.in/",
    logo: "/projects/noirly-ledger-light.png",
  },
  {
    title: "Noirly Pulse",
    type: "Messaging",
    description:
      "Realtime chat for workspaces — channels, DMs, threads, reactions, and presence.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.pulse.aneesh-pissay.in/",
    logo: "/projects/noirly-pulse-light.png",
  },
];
