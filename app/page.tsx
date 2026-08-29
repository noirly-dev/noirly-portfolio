import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { getPortfolioContent } from "@/lib/content/server";
import type { BelowTheFoldProps } from "@/components/BelowTheFold";

/**
 * Below-fold sections share one client chunk (SSR kept for SEO). Hero stays in
 * the critical path so LCP is not blocked by About/Work motion code.
 */
const BelowTheFold = dynamic(
  () =>
    import("@/components/BelowTheFold").then((m) => m.BelowTheFold),
  {
    loading: () => <div className="min-h-[50vh]" aria-hidden />,
  },
);

export default async function Home() {
  const content = await getPortfolioContent();

  const below: BelowTheFoldProps = {
    profile: content.profile,
    skillCards: content.skillCards,
    experience: content.experience,
    projects: content.projects,
  };

  return (
    <div className="flex-1">
      <Hero profile={content.profile} />
      <BelowTheFold {...below} />
    </div>
  );
}
