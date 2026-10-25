import Link from "next/link";
import { Asterisk } from "lucide-react";
import { profile } from "@/content/portfolio";

export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-symbol" aria-hidden="true">
        {profile.initials}
        <span>.</span>
      </span>
      <span className="brand-name">{profile.name}</span>
      <span className="sr-only"> — home</span>
    </Link>
  );
}
export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      {children}
    </div>
  );
}
export function Star({ className = "" }: { className?: string }) {
  return (
    <Asterisk
      className={`star ${className}`}
      aria-hidden="true"
      strokeWidth={1.2}
    />
  );
}
