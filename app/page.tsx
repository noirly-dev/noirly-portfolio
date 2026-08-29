import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { getPortfolioContent } from "@/lib/content/server";

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main className="flex-1">
      <Hero profile={content.profile} />
      <About profile={content.profile} />
      <Stack skillCards={content.skillCards} profile={content.profile} />
      <Experience workExperience={content.experience} profile={content.profile} />
      <Work projects={content.projects} profile={content.profile} />
      <Contact profile={content.profile} />
    </main>
  );
}
