import { BUSINESS_CONFIG } from "@/config/business";

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: BUSINESS_CONFIG.fullName,
    alternateName: BUSINESS_CONFIG.name,
    description: BUSINESS_CONFIG.description,
    url: BUSINESS_CONFIG.meta.siteUrl,
    telephone: BUSINESS_CONFIG.phoneRaw,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_CONFIG.district,
      addressRegion: BUSINESS_CONFIG.city,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.052,
      longitude: 28.995,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS_CONFIG.rating.score.toString(),
      bestRating: "5",
      ratingCount: BUSINESS_CONFIG.rating.reviewCount.toString(),
    },
    priceRange: "$$",
    sameAs: [
      BUSINESS_CONFIG.instagramUrl,
    ],
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BUSINESS_CONFIG.meta.siteUrl}${item.url}`,
    })),
  };
}
