"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Brand } from "./brand";

const links = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("work");
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const index = Math.max(
    0,
    links.findIndex((link) => link.id === active),
  );

  useEffect(() => {
    const update = () => {
      const sections = links
        .map(({ id }) => document.getElementById(id))
        .filter((element): element is HTMLElement => !!element);
      const last = sections.at(-1);
      // Keep contact active when a short final section cannot reach the viewport's top.
      if (
        last &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 30
      ) {
        setActive(last.id);
        return;
      }
      const current = sections
        .filter(
          (section) =>
            section.getBoundingClientRect().top <= window.innerHeight * 0.4,
        )
        .at(-1);
      setActive(current?.id ?? "work");
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth > 760) setOpen(false);
    };
    document.addEventListener("keydown", close);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="desktop-nav"
          style={{ "--nav-index": index } as CSSProperties}
        >
          <span className="nav-indicator" aria-hidden="true" />
          {links.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              className={active === link.id ? "active" : ""}
              aria-current={
                pathname === "/" && active === link.id ? "location" : undefined
              }
              onClick={() => {
                setActive(link.id);
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mobile-nav"
          hidden={!open}
        >
          {links.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              aria-current={active === link.id ? "location" : undefined}
              onClick={() => {
                setActive(link.id);
                setOpen(false);
              }}
            >
              {link.label}
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
