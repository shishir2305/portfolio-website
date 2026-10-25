import Image from "next/image";
import type { Project } from "@/content/portfolio";
import { ProjectVisual } from "./project-visual";

/** Use the supplied artwork, or switch to a real project screenshot in content. */
export function ProjectPreview({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="project-visual custom-preview">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(max-width: 760px) 100vw, 65vw"
          style={{ objectFit: "contain", padding: "5%" }}
        />
      </div>
    );
  }
  return <ProjectVisual type={project.visual} />;
}
