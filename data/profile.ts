export interface HeroStat {
  value: string;
  label: string;
}

export interface ContactEntry {
  label: string;
  href: string;
}

export interface ProfileContact {
  email: ContactEntry;
  linkedin: ContactEntry;
  github: ContactEntry;
}

export interface Profile {
  name: string;
  role: string;
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  heroStats: HeroStat[];
  techChips: string[];
  aboutTitle: string;
  aboutBio: string;
  aboutPoints: string[];
  heroHighlights: string[];
  experienceSubtitle: string;
  secondaryCta: string;
  stackSubtitle: string;
  servicesSubtitle: string;
  workSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  contact: ProfileContact;
}

export const profile: Profile = {
  name: "Aneesh Pissay",
  role: "Full Stack Developer",
  badge: "FULL STACK DEVELOPER • 5+ YEARS EXPERIENCE",
  title: "Building Scalable",
  titleAccent: "Web & Mobile Experiences",
  description:
    "Full stack software design and delivery — responsive interfaces, mobile apps, APIs, databases, and production deployments.",
  heroStats: [
    { value: "5+", label: "Years experience" },
    { value: "Full Stack", label: "Web + Mobile" },
    { value: "Cloud Ready", label: "Docker + CI/CD" },
  ],
  techChips: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "MongoDB", "AWS", "Docker"],
  aboutTitle: "Approach to engineering",
  aboutBio:
    "Across 5+ years in the industry, work has spanned the full stack — schema design, API contracts, component libraries, mobile builds, and release pipelines. The focus is readable code, sensible scaling, and polished product experiences.",
  aboutPoints: [
    "Clear architecture — typed interfaces, reusable components, and APIs that are straightforward to extend",
    "End-to-end ownership — comfortable moving from UI details to database queries and deployment config",
    "Production discipline — performance tuning, error handling, and CI/CD so releases stay predictable",
  ],
  heroHighlights: [
    "Web apps with React, Next.js, and TypeScript",
    "Cross-platform mobile with React Native",
    "Node.js backends, MongoDB, AWS, and Docker",
  ],
  experienceSubtitle: "Chronology of building production-grade web and mobile systems.",
  secondaryCta: "Get in touch",
  stackSubtitle: "Technologies used for full stack web and mobile engineering",
  servicesSubtitle: "Areas of technical focus",
  workSubtitle: "Selected projects that showcase an approach to design and engineering",
  ctaTitle: "Let's connect",
  ctaSubtitle:
    "Open to full stack developer opportunities and interesting technical collaborations.",
  contact: {
    email: { label: "aneeshpissay330@gmail.com", href: "mailto:aneeshpissay330@gmail.com" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aneesh-pissay-1559a31a9",
    },
    github: { label: "GitHub", href: "https://github.com/aneesh-pissay" },
  },
};
