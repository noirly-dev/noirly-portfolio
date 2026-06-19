import { mdiGithub, mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageUrlDark?: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  imageUrlDark,
  tags,
  demoUrl,
  githubUrl,
}) => {
  return (
    <div className="bg-card border border-border hover:border-muted-foreground transition-colors glass-effect">
      {/* Project Image */}
      <div className="relative h-48 bg-secondary border-b border-border">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title}
              width={600}
              height={400}
              className={`absolute inset-0 w-full h-full object-contain${imageUrlDark ? " dark:hidden" : ""}`}
              unoptimized
            />
            {imageUrlDark && (
              <Image
                src={imageUrlDark}
                alt={title}
                width={600}
                height={400}
                className="absolute inset-0 hidden w-full h-full object-contain dark:block"
                unoptimized
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Feature graphic coming soon
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="spacing-generous">
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

        {/* Description (clamped, tooltip on hover) */}
        <p
          className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-2"
          title={description}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-secondary text-muted-foreground px-2 py-1 text-xs rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex space-x-4 flex-wrap gap-y-2">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium flex items-center"
            >
              <Icon path={mdiOpenInNew} size={0.7} className="mr-1" />
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
            >
              <Icon path={mdiGithub} size={0.7} className="mr-1" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
