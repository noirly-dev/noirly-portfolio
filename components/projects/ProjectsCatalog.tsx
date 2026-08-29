"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/data/projects/index";
import Icon from "@mdi/react";
import { mdiWeb, mdiCellphone } from "@mdi/js";

const PROJECTS_PER_PAGE = 9;

interface ProjectsCatalogProps {
  projects: Project[];
}

function paginateProjects(projectList: Project[], currentPage: number) {
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  return projectList.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
}

function getTotalPages(projectList: Project[]) {
  return Math.ceil(projectList.length / PROJECTS_PER_PAGE);
}

function Pagination({
  projectList,
  currentPage,
  setPage,
}: {
  projectList: Project[];
  currentPage: number;
  setPage: (page: number) => void;
}) {
  const totalPages = getTotalPages(projectList);
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="btn-minimal"
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? "default" : "outline"}
          size="sm"
          onClick={() => setPage(pageNum)}
          className={currentPage === pageNum ? "btn-accent" : "btn-minimal"}
        >
          {pageNum}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="btn-minimal"
      >
        Next
      </Button>
    </div>
  );
}

export function ProjectsCatalog({ projects }: ProjectsCatalogProps) {
  const [webPage, setWebPage] = useState(1);
  const [mobilePage, setMobilePage] = useState(1);

  const webProjects = projects.filter((project) => project.category === "Web");
  const mobileProjects = projects.filter((project) => project.category === "Mobile");

  return (
    <section id="projects" className="spacing-section bg-background">
      <div className="spacing-container container mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Featured Projects</h2>
        <Tabs defaultValue="Web" className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="Web"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon path={mdiWeb} size={0.7} />
              <span>Web</span>
            </TabsTrigger>
            <TabsTrigger
              value="Mobile"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon path={mdiCellphone} size={0.7} />
              <span>Mobile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Web" className="mt-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
              {paginateProjects(webProjects, webPage).map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  imageUrlDark={project.imageUrlDark}
                  tags={project.technologies}
                  demoUrl={project.url}
                  githubUrl={project.githubUrl}
                />
              ))}
            </div>
            <Pagination projectList={webProjects} currentPage={webPage} setPage={setWebPage} />
          </TabsContent>

          <TabsContent value="Mobile" className="mt-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
              {paginateProjects(mobileProjects, mobilePage).map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  imageUrlDark={project.imageUrlDark}
                  tags={project.technologies}
                  demoUrl={project.url}
                  githubUrl={project.githubUrl}
                />
              ))}
            </div>
            <Pagination
              projectList={mobileProjects}
              currentPage={mobilePage}
              setPage={setMobilePage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
