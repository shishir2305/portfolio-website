import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  Database,
  Layers3,
  Wrench,
} from "lucide-react";
import { profile, experience, skills } from "@/content/portfolio";
import { SectionLabel } from "@/components/brand";
import { Orb } from "@/components/orb";
import { Work } from "@/components/work";
import { Footer } from "@/components/footer";
import { absoluteUrl, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { url: absoluteUrl("/") },
};
const skillIcons = [Layers3, Braces, Database, Wrench];

export default function Home() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: absoluteUrl(),
    jobTitle: profile.role,
    description: profile.description,
    sameAs: [profile.github, profile.linkedin, profile.leetcode],
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "React Native",
      "Artificial Intelligence",
      "Web Development",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.institution,
    },
  };
  return (
    <>
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(person) }}
        />
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="hero-eyebrow">
              <span className="status-dot" />
              SOFTWARE ENGINEER · {profile.location.toUpperCase()}
            </span>
            <p className="hero-intro">Hey, I’m {profile.firstName}.</p>
            <h1 id="hero-title">
              Complex problems.
              <br />
              <span>Simple experiences.</span>
            </h1>
            <p className="hero-description">{profile.introduction}</p>
            <div className="hero-actions">
              <Link href="#work" className="button button-primary work-button">
                View my work <ArrowDownRight size={17} />
              </Link>
              <Link href="#contact" className="contact-link">
                Get in touch <ArrowUpRight size={15} />
              </Link>
            </div>
            <span className="hero-current">
              Currently building at <span>{profile.currentCompany}</span>
            </span>
          </div>
          <Orb />
        </section>
        <section
          className="work-section container section-space"
          id="work"
          aria-labelledby="work-title"
          data-reveal
        >
          <div className="section-heading">
            <div>
              <SectionLabel number="01">SELECTED WORK</SectionLabel>
              <h2 id="work-title">
                A few things I’ve built<span>.</span>
              </h2>
            </div>
            <a
              href={profile.githubRepositories}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              All repositories <ArrowUpRight size={15} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <Work />
        </section>
        <section
          className="experience-section container section-space"
          id="experience"
          aria-labelledby="experience-title"
          data-reveal
        >
          <div className="section-heading">
            <div>
              <SectionLabel number="02">EXPERIENCE</SectionLabel>
              <h2 id="experience-title">
                Where I’ve contributed<span>.</span>
              </h2>
            </div>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article
                key={`${item.company}-${item.role}`}
                className="experience-item"
              >
                <div className="experience-date">
                  <span>{item.period}</span>
                  {item.current && (
                    <span className="current-badge">
                      <span className="status-dot" />
                      Current
                    </span>
                  )}
                </div>
                <div className="experience-detail">
                  <div className="experience-role">
                    <h3>{item.role}</h3>
                    <span>{item.company}</span>
                  </div>
                  <ul className="experience-contributions">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="experience-stack">
                    {item.stack.slice(0, 4).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="skills-section container section-space"
          id="skills"
          aria-labelledby="skills-title"
          data-reveal
        >
          <div className="section-heading">
            <div>
              <SectionLabel number="03">SKILLS</SectionLabel>
              <h2 id="skills-title">
                My working stack<span>.</span>
              </h2>
            </div>
            <p>From interface to infrastructure.</p>
          </div>
          <div className="skills-panel">
            {skills.map((group, index) => {
              const Icon = skillIcons[index % skillIcons.length];
              return (
                <div className="skill-row" key={group.title}>
                  <div className="skill-category">
                    <span className="skill-icon">
                      <Icon size={17} strokeWidth={1.5} />
                    </span>
                    <h3>{group.title}</h3>
                  </div>
                  <ul>
                    {group.items.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
