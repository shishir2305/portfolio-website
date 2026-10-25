import { Github } from "@/components/social-icons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, profile, projects } from "@/content/portfolio";
import { ProjectPreview } from "@/components/project-preview";
import { SectionLabel } from "@/components/brand";
import { Footer } from "@/components/footer";
import { absoluteUrl, jsonLd } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.eyebrow}`,
    description: project.description,
    alternates: { canonical: absoluteUrl(`/work/${slug}`) },
    openGraph: {
      title: `${project.title} — Shishir Jha`,
      description: project.description,
      url: absoluteUrl(`/work/${slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Shishir Jha`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next =
    projects[
      (projects.findIndex((item) => item.slug === slug) + 1) % projects.length
    ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    author: { "@type": "Person", name: profile.name },
    codeRepository: project.githubUrl,
    programmingLanguage: project.stack,
    url: absoluteUrl(`/work/${slug}`),
  };
  return (
    <>
      <main id="main" className="project-page container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
        />
        <Link href="/#work" className="text-link project-back">
          <ArrowLeft size={16} /> All selected work
        </Link>
        <div className="project-page-heading">
          <div>
            <span className="eyebrow">
              {project.eyebrow} <span className="inline-divider">/</span>{" "}
              {project.year}
            </span>
            <h1>
              {project.title}
              <span>.</span>
            </h1>
            <p>{project.shortTitle}</p>
          </div>
          <a
            className="button button-dark"
            href={project.githubUrl ?? profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={17} />
            {project.githubUrl ? "View source" : "Explore my GitHub"}
            <ArrowUpRight size={15} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {project.liveUrl && (
            <a
              className="text-link"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live site <ArrowUpRight size={15} />
            </a>
          )}
        </div>
        <div className={`project-cover accent-${project.accent}`}>
          <ProjectPreview project={project} />
        </div>
        <div className="project-facts">
          <div>
            <span>MY ROLE</span>
            <p>{project.role}</p>
          </div>
          <div>
            <span>THE TOOLKIT</span>
            <p>{project.stack.join(" · ")}</p>
          </div>
          <div>
            <span>BUILT IN</span>
            <p>{project.year}</p>
          </div>
        </div>
        <section className="case-section">
          <SectionLabel number="01">OVERVIEW</SectionLabel>
          <div className="case-grid">
            <h2>The problem & solution.</h2>
            <div>
              <p>{project.problem}</p>
              <p>{project.solution}</p>
            </div>
          </div>
        </section>
        <section className="case-section">
          <SectionLabel number="02">IMPLEMENTATION</SectionLabel>
          <div className="case-features">
            {project.features.map((feature, index) => (
              <div key={feature.title}>
                <span className="feature-number">
                  0{index + 1}
                  <ArrowUpRight size={18} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          <div
            className="project-flow"
            aria-label="Conceptual application flow"
          >
            {project.flow.map((step, index) => (
              <div key={step}>
                <span>0{index + 1}</span>
                <strong>{step}</strong>
                {index < project.flow.length - 1 && <ArrowRight size={19} />}
              </div>
            ))}
          </div>
        </section>
        <section className="case-section case-takeaway">
          <SectionLabel number="03">TAKEAWAY</SectionLabel>
          <h2>{project.takeaway}</h2>
          <a
            href={project.githubUrl ?? profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {project.githubUrl
              ? "Take a look at the code"
              : "Explore more of my work on GitHub"}
            <ArrowUpRight size={17} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>
        {projects.length > 1 && (
          <Link href={`/work/${next.slug}`} className="next-project">
            <span>
              UP NEXT<span>{next.eyebrow}</span>
            </span>
            <strong>{next.title}</strong>
            <ArrowUpRight size={45} />
          </Link>
        )}
      </main>
      <Footer />
    </>
  );
}
