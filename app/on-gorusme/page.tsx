import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ConsultationFunnel } from "@/components/forms/ConsultationFunnel";
import { BUSINESS_CONFIG } from "@/config/business";
import { ShieldCheck, MapPin, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Ücretsiz Ön Görüşme Planla | Nişantaşı Core & Fit",
  description:
    "Core & Fit Private Sport Studio Nişantaşı'nda 1:1 antrenman için ücretsiz ön görüşme ve postüral değerlendirme talebi oluşturun.",
};

export default function OnGorusmePage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090B] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
            NİŞANTAŞI • PRIVATE SPORT STUDIO
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display mb-3">
            Ücretsiz Ön Görüşme
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
            Hedeflerinizi, antrenman geçmişinizi ve yaşam temponuzu konuşmak için stüdyomuzu ziyaret edin. 15 dakikalık postür ve hareket açıklığı değerlendirmenizi ücretsiz yapalım.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-mono text-[#72757C]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E8FF36]" />
              <span>Bağlayıcılık Yok</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E8FF36]" />
              <span>{BUSINESS_CONFIG.displayLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#E8FF36] fill-[#E8FF36]" />
              <span>4.2 / 5 (62 Yorum)</span>
            </div>
          </div>
        </div>

        {/* Multi-step Funnel with Suspense for useSearchParams */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs font-mono text-[#72757C]">
              Form yükleniyor...
            </div>
          }
        >
          <ConsultationFunnel />
        </Suspense>
      </div>
    </div>
  );
}
