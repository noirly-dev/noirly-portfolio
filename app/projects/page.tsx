import { ProjectsCatalog } from "@/components/projects/ProjectsCatalog";
import { getPortfolioContent } from "@/lib/content/server";

export default async function ProjectsPage() {
  const content = await getPortfolioContent();
  return <ProjectsCatalog projects={content.catalogProjects} />;
}
