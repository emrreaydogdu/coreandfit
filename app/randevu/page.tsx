import React from "react";
import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { BUSINESS_CONFIG } from "@/config/business";
import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Randevu Oluştur | Nişantaşı Core & Fit",
  description:
    "Core & Fit Private Sport Studio Nişantaşı stüdyosu için online randevu oluşturun. 1:1 ön görüşme ve seans planlaması.",
};

export default function RandevuPage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090B] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
            ONLINE TAKVİM REZERVASYONU
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display mb-3">
            Stüdyo Randevusu
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
            Aşağıdaki adımlardan görüşme türünü, size uygun gün ve saati belirleyerek 1 dakikada randevu talebinizi iletin.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-mono text-[#72757C]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E8FF36]" />
              <span>{BUSINESS_CONFIG.displayLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E8FF36]" />
              <span>Hafta İçi 07:00 – 22:00</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E8FF36]" />
              <span>Özel Randevulu Giriş</span>
            </div>
          </div>
        </div>

        <BookingWizard />
      </div>
    </div>
  );
}
