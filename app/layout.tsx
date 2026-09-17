import type { Metadata, Viewport } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BUSINESS_CONFIG } from "@/config/business";
import { generateLocalBusinessSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#08090B",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_CONFIG.meta.siteUrl),
  title: {
    default: BUSINESS_CONFIG.meta.defaultTitle,
    template: BUSINESS_CONFIG.meta.titleTemplate,
  },
  description: BUSINESS_CONFIG.meta.defaultDescription,
  keywords: BUSINESS_CONFIG.meta.keywords,
  authors: [{ name: BUSINESS_CONFIG.name }],
  creator: BUSINESS_CONFIG.name,
  publisher: BUSINESS_CONFIG.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BUSINESS_CONFIG.meta.siteUrl,
    title: BUSINESS_CONFIG.meta.defaultTitle,
    description: BUSINESS_CONFIG.meta.defaultDescription,
    siteName: BUSINESS_CONFIG.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Core & Fit Nişantaşı Private Sport Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS_CONFIG.meta.defaultTitle,
    description: BUSINESS_CONFIG.meta.defaultDescription,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateLocalBusinessSchema();

  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${archivo.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('coreandfit_theme')||'dark';if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#08090B] text-white antialiased flex flex-col min-h-screen selection:bg-[#E8FF36] selection:text-[#08090B]">
        <ThemeProvider>
          <ScrollProgress />
          <SmoothScroll>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <StickyMobileBar />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
