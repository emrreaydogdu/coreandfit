import React from "react";
import type { Metadata } from "next";
import { PackageInquiryForm } from "@/components/forms/PackageInquiryForm";
import { PublicPackageGrid } from "@/components/packages/PublicPackageGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "1:1 Seans Paketleri & Teklif Al | Nişantaşı Core & Fit",
  description:
    "Core & Fit Private Sport Studio 1:1 Personal Training paketleri: Tek Ders, 10 Ders, 20 Ders, 30 Ders ve 2 kişilik Düet Ders seçenekleri.",
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
              Yıllık salon aboneliği yerine ders sayısı üzerinden şeffaf fiyatlandırma. Birebir koçluk, gelişim takibi ve esnek randevu planı.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PublicPackageGrid />
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
