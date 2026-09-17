import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { SERVICES_DATA } from "@/data/services";
import { COACHES_DATA } from "@/data/coaches";
import { BLOG_POSTS } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_CONFIG.meta.siteUrl;

  const staticRoutes = [
    "",
    "/personal-training",
    "/antrenman",
    "/on-gorusme",
    "/paketler",
    "/randevu",
    "/koclar",
    "/basari-hikayeleri",
    "/hakkimizda",
    "/studio",
    "/blog",
    "/iletisim",
    "/kvkk",
    "/gizlilik-politikasi",
    "/cerez-politikasi",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/on-gorusme" ? 0.9 : 0.8,
  }));

  const serviceRoutes = SERVICES_DATA.map((s) => ({
    url: `${baseUrl}/antrenman/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const coachRoutes = COACHES_DATA.map((c) => ({
    url: `${baseUrl}/koclar/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = BLOG_POSTS.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...coachRoutes, ...blogRoutes];
}
