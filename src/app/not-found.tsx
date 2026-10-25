import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Star } from "@/components/brand";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <main className="not-found container" id="main">
        <Star />
        <span className="eyebrow">404 / A SMALL DETOUR</span>
        <h1>
          Nothing here.
          <br />
          <em>Plenty to explore.</em>
        </h1>
        <p>This page may have moved, or the address took a wrong turn.</p>
        <Link href="/" className="button button-dark">
          <ArrowLeft size={17} /> Back to the good stuff
        </Link>
      </main>
      <Footer />
    </>
  );
}
