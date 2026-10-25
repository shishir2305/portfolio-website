"use client";

import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="not-found container">
      <span className="eyebrow">A SMALL HICCUP</span>
      <h1>
        Let’s give it
        <br />
        <em>another go.</em>
      </h1>
      <p>Something went wrong while loading this page.</p>
      <div className="hero-actions">
        <button onClick={reset} className="button button-dark">
          Try again
        </button>
        <Link href="/" className="text-link">
          Back home
        </Link>
      </div>
    </main>
  );
}
