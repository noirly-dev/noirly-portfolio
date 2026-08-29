import { HomeSections } from "@/components/HomeSections";
import { getPortfolioContent } from "@/lib/content/server";

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <HomeSections
      profile={content.profile}
      skillCards={content.skillCards}
      experience={content.experience}
      projects={content.projects}
    />
  );
}
