import type { MetadataRoute } from "next";
import { projects } from "@/content/portfolio";
import { absoluteUrl, siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    { url: absoluteUrl("/")!, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`)!,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
