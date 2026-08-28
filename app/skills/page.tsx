import { SkillsView } from "@/components/skills/SkillsView";
import { getPortfolioContent } from "@/lib/content/server";

export default async function SkillsPage() {
  const content = await getPortfolioContent();
  return <SkillsView skills={content.skills} />;
}
