import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Dış kaynaklar yalnızca kullanılan servislerle sınırlı: PayTR ödeme penceresi, Google Translate, görseller.
const GOOGLE_TRANSLATE = "https://translate.google.com https://translate.googleapis.com https://www.gstatic.com https://fonts.gstatic.com";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${GOOGLE_TRANSLATE}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_TRANSLATE}`,
  `img-src 'self' data: blob: https://images.unsplash.com https://flagcdn.com ${GOOGLE_TRANSLATE} https://www.google.com`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""} https://translate.googleapis.com`,
  `frame-src https://www.paytr.com ${GOOGLE_TRANSLATE}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // PayTR sonrası sonuç sayfası kendi sitemizin içindeki çerçevede açılır; başka siteler çerçeveleyemez.
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kamera yalnızca admin QR okuyucu için bu sitede kullanılabilir.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(self \"https://www.paytr.com\")" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // API yanıtları hiçbir ara katmanda önbelleğe alınmaz.
      { source: "/api/(.*)", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
};

export default nextConfig;
