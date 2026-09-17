import { MetadataRoute } from "next";
import { BUSINESS_CONFIG } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BUSINESS_CONFIG.meta.siteUrl}/sitemap.xml`,
  };
}
