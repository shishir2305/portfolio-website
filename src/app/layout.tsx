import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/content/portfolio";
import { siteUrl } from "@/lib/site";
import { Header } from "@/components/header";
import { Motion } from "@/components/motion";
import "./globals.css";

const geist = localFont({
  src: "../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
const space = localFont({
  src: "../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space",
  display: "swap",
  weight: "300 700",
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Shishir Jha — Software Engineer",
    template: "%s — Shishir Jha",
  },
  description: profile.description,
  applicationName: "Shishir Jha — Portfolio",
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Shishir Jha",
    title: "Shishir Jha — Software Engineer",
    description: profile.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shishir Jha — Software Engineer",
    description: profile.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c1015",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${space.variable}`}>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <Motion />
        {children}
      </body>
    </html>
  );
}
