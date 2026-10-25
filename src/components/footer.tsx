import { Github, Linkedin } from "@/components/social-icons";
import { ArrowUpRight, Code2 } from "lucide-react";
import { ContactForm } from "./contact-form";
import { profile } from "@/content/portfolio";

export function Footer() {
  return (
    <footer
      className="site-footer container"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-main" data-reveal>
        <div className="contact-intro">
          <span className="section-label">LET’S CONNECT</span>
          <h2 id="contact-title">Have a project in mind?</h2>
          <p>
            Tell me what you’re working on.
            <br />
            I’d love to hear about it.
          </p>
          <div className="contact-links">
            <div className="contact-socials">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} />
                GitHub
                <ArrowUpRight size={12} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 size={15} />
                LeetCode
                <ArrowUpRight size={12} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={15} />
                LinkedIn
                <ArrowUpRight size={12} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Built with intention.</span>
        <a href="#top">
          Back to top <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  );
}
