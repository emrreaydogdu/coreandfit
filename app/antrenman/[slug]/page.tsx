import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES_DATA, type ServiceItem } from "@/data/services";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Check, Target, Clock, Users, ArrowLeft, MessageSquare } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  if (!service) return { title: "Hizmet Bulunamadı" };

  return {
    title: `${service.title} | Nişantaşı Core & Fit`,
    description: service.summary,
    openGraph: {
      title: `${service.title} | Core & Fit Private Sport Studio Nişantaşı`,
      description: service.summary,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          href="/antrenman"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#72757C] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Antrenman Hizmetlerine Dön</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 border-y border-[#191B20] bg-[#0D0F12] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70 dark:opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/90 via-[#F8F9FA]/65 to-transparent dark:from-[#08090B] dark:via-[#08090B]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA]/40 dark:from-[#08090B]/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
              [ {service.badge} ]
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#E8FF36] font-display uppercase tracking-wide mb-6">
              {service.headline}
            </p>
            <p className="text-sm sm:text-base text-[#A5A7AD] leading-relaxed mb-8 max-w-2xl">
              {service.summary}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={`/on-gorusme?hizmet=${service.slug}`}
                className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-all"
              >
                <span>Bu Program İçin Ön Görüşme Al</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={buildQuickChatWhatsAppUrl(
                  `Merhaba, ${service.title} programınız hakkında bilgi almak istiyorum.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 bg-[#131519] border border-[#23272F] text-white hover:border-[#25D366] font-semibold text-xs uppercase tracking-wider transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp&apos;tan Sor</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Narrative */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="text-2xl font-bold uppercase font-display text-white mb-4">
                Program Yaklaşımı & Metodoloji
              </h2>
              <div className="space-y-4 text-sm text-[#A5A7AD] leading-relaxed">
                {service.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Who is it for? */}
            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#E8FF36]" />
                <h3 className="text-lg font-bold uppercase font-display text-white">
                  Kimler İçin Uygun?
                </h3>
              </div>
              <ul className="space-y-3">
                {service.targetAudience.map((aud, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#A5A7AD]">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>{aud}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Structure */}
            <div>
              <h3 className="text-xl font-bold uppercase font-display text-white mb-4">
                Çalışma Yapısı (Seans Fazları)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.structure.map((item, idx) => (
                  <div key={idx} className="p-5 bg-[#0D0F12] border border-[#23272F]">
                    <span className="text-xs font-mono text-[#E8FF36] block mb-1">
                      FAZ 0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-white font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-[#0D0F12] border border-[#23272F] space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E8FF36] block border-b border-[#191B20] pb-3">
                SEANS PARAMETRELERİ
              </span>

              <div>
                <span className="text-[11px] font-mono text-[#72757C] uppercase block mb-1">
                  SEANS SÜRESİ
                </span>
                <p className="text-base font-bold text-white uppercase font-display">
                  {service.duration}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#72757C] uppercase block mb-1">
                  ÖNERİLEN FREKANS
                </span>
                <p className="text-base font-bold text-white uppercase font-display">
                  {service.frequencyRecommendation}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#72757C] uppercase block mb-1">
                  LOKASYON
                </span>
                <p className="text-base font-bold text-white uppercase font-display">
                  {BUSINESS_CONFIG.displayLocation}
                </p>
              </div>

              <div className="pt-4 border-t border-[#191B20]">
                <Link
                  href={`/on-gorusme?hizmet=${service.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors text-center"
                >
                  <span>Ön Görüşme Talep Et</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-6 bg-[#131519] border border-[#23272F] text-center">
              <p className="text-xs text-[#A5A7AD] mb-3">
                Hangi programın size uygun olduğundan emin değil misiniz?
              </p>
              <Link
                href="/on-gorusme"
                className="text-xs font-mono uppercase text-[#E8FF36] hover:underline font-bold"
              >
                15 Dakikalık Ücretsiz Analiz Planlayın →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
