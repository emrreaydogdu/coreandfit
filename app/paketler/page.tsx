import React from "react";
import type { Metadata } from "next";
import { PACKAGES_DATA } from "@/data/packages";
import { PackageInquiryForm } from "@/components/forms/PackageInquiryForm";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "1:1 Seans Paketleri & Teklif Al | Nişantaşı Core & Fit",
  description:
    "Core & Fit Private Sport Studio 1:1 Personal Training seans paketleri: Başlangıç, 8 Ders, 12 Ders, Performans ve Özel Program seçenekleri.",
};

export default function PaketlerPage() {
  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <ScrollReveal variant="fade-up">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
              [ ŞEFFAF SEANS PERİYOTLARI ]
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
              Seans Paketleri
            </h1>
            <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
              Klasik yıllık salon aboneliği yerine aldığınız birebir koçluk hizmeti ve seans sayısı üzerinden şeffaf paket yapısı. Kesintisiz takip ve esnek takvim planı.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {PACKAGES_DATA.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <div
                className={`bg-[#0D0F12] border p-8 flex flex-col justify-between transition-all duration-300 relative h-full hover:border-[#343A46] ${
                  pkg.isPopular
                    ? "border-[#E8FF36] shadow-[0_0_30px_rgba(232,255,54,0.08)]"
                    : "border-[#23272F]"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 bg-[#E8FF36] text-[#08090B] text-[10px] font-mono font-bold uppercase tracking-wider">
                      EN ÇOK TERCİH EDİLEN
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-mono text-[#72757C] uppercase tracking-wider block mb-1">
                    {pkg.subtitle}
                  </span>

                  <h3 className="text-2xl font-bold uppercase font-display text-white mb-2">
                    {pkg.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-[#E8FF36] font-display">
                      {pkg.sessionCount}
                    </span>
                    <span className="text-xs font-mono text-[#72757C]">
                      ({pkg.validity})
                    </span>
                  </div>

                  <p className="text-xs text-[#A5A7AD] leading-relaxed mb-6 border-b border-[#191B20] pb-4">
                    {pkg.idealFor}
                  </p>

                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-mono text-white uppercase tracking-wider block font-semibold">
                      PAKET KAPSAMI:
                    </span>
                    <ul className="space-y-2.5 text-xs text-[#A5A7AD]">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#191B20]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#72757C] uppercase">Fiyatlandırma:</span>
                    <span className="text-xs font-mono text-white font-bold uppercase bg-[#131519] px-2.5 py-1 border border-[#23272F]">
                      Bilgi Al
                    </span>
                  </div>

                  <a
                    href="#teklif-al"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all"
                  >
                    <span>{pkg.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Package Offer Form Section */}
      <section id="teklif-al" className="py-20 bg-[#0D0F12] border-t border-[#191B20]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                DÖNEMLİK VEYA AYLIK PLANLAMA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display mb-3">
                Size Özel Paket Teklifi
              </h2>
              <p className="text-xs sm:text-sm text-[#A5A7AD]">
                Hedefinizi, çalışmak istediğiniz seans sayısını ve müsaitlik saatinizi iletin; stüdyomuz size özel teklif ve takvim önerisi hazırlasın.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="zoom-in" delay={0.2}>
            <PackageInquiryForm />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
