"use client";

import { Github } from "@/components/social-icons";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/content/portfolio";
import { ProjectPreview } from "./project-preview";

const filters = [
  "All work",
  ...new Set(projects.map((project) => project.category)),
];

export function Work() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All work");
  const shown = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );
  return (
    <>
      <div className="work-toolbar">
        <div
          className="work-filters"
          role="group"
          aria-label="Filter selected projects"
        >
          {filters.map((item) => (
            <button
              key={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === "All work" && (
                <span>{projects.length.toString().padStart(2, "0")}</span>
              )}
            </button>
          ))}
        </div>
        <span className="work-note" aria-live="polite">
          {shown.length.toString().padStart(2, "0")} projects
        </span>
      </div>
      <div className="projects-grid">
        {shown.map((project) => (
          <article
            className={`project-card accent-${project.accent}`}
            key={project.slug}
          >
            <div className="project-visual-link">
              <ProjectPreview project={project} />
              <Link
                href={`/work/${project.slug}`}
                className="project-visual-overlay"
              >
                <span className="sr-only">Explore {project.title}</span>
                <span className="project-hover-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </Link>
            </div>
            <div className="project-info">
              <div className="project-meta">
                <span>{project.eyebrow}</span>
                <span>{project.year}</span>
              </div>
              <Link
                href={`/work/${project.slug}`}
                className="project-title-link"
              >
                <h3>{project.title}</h3>
                <ArrowUpRight size={22} />
              </Link>
              <p>{project.summary}</p>
              <div className="project-tags">
                {project.stack.slice(0, 3).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="project-links">
                <Link href={`/work/${project.slug}`}>
                  Details <ArrowRight size={15} />
                </Link>
                <a
                  href={project.githubUrl ?? profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.githubUrl ? "Source" : "GitHub profile"} — ${project.title} (opens in a new tab)`}
                >
                  <Github size={15} />
                  {project.githubUrl ? "Source" : "GitHub profile"}
                  <ArrowUpRight size={12} />
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live site <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
