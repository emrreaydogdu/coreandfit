import React from "react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Phone, MessageSquare, MapPin, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "İletişim & Stüdyo Lokasyonu | Nişantaşı Core & Fit",
  description:
    "Core & Fit Private Sport Studio Nişantaşı iletişim bilgileri, telefon, WhatsApp hattı ve stüdyo randevu detayları.",
};

export default function IletisimPage() {
  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
            [ NİŞANTAŞI STÜDYO İLETİŞİMİ ]
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
            İletişim & Randevu
          </h1>
          <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
            Stüdyomuz Nişantaşı&apos;nda özel randevulu sistemle hizmet vermektedir. Ziyaretiniz öncesinde lütfen ön görüşme veya randevu oluşturunuz.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Studio Details & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-[#0D0F12] border border-[#23272F] space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E8FF36] block border-b border-[#191B20] pb-3">
                STÜDYO BİLGİLERİ
              </span>

              {/* Location notice */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E8FF36] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-display">
                    Lokasyon
                  </h3>
                  <p className="text-base text-white font-medium mt-0.5">
                    {BUSINESS_CONFIG.displayLocation}
                  </p>
                  <p className="text-xs text-[#72757C] mt-1 leading-relaxed">
                    Stüdyomuz randevulu üyelerimize özeldir; doğrulanmış açık sokak adresi ve giriş detayları randevu teyidinizle birlikte iletilmektedir.
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#E8FF36] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-display">
                    Telefon
                  </h3>
                  <a
                    href={BUSINESS_CONFIG.phoneTel}
                    className="text-base font-mono text-white hover:text-[#E8FF36] transition-colors block mt-0.5"
                  >
                    {BUSINESS_CONFIG.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-display">
                    WhatsApp Destek
                  </h3>
                  <a
                    href={buildQuickChatWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-white hover:text-[#E8FF36] transition-colors block mt-0.5"
                  >
                    +{BUSINESS_CONFIG.whatsappNumber} (Hemen Mesaj Gönderin)
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#E8FF36] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-display">
                    Seans Saatleri
                  </h3>
                  <div className="text-xs font-mono text-[#A5A7AD] space-y-0.5 mt-1">
                    <p>Hafta İçi: {BUSINESS_CONFIG.openingHours.weekdays}</p>
                    <p>Cumartesi: {BUSINESS_CONFIG.openingHours.saturday}</p>
                    <p>Pazar: {BUSINESS_CONFIG.openingHours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={BUSINESS_CONFIG.phoneTel}
                className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] hover:border-[#343A46] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8FF36]" />
                <span>Hemen Ara</span>
              </a>

              <a
                href={buildQuickChatWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] hover:border-[#25D366] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] hover:border-[#343A46] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#E8FF36]" />
                <span>Instagram</span>
              </a>

              <a
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] hover:border-[#343A46] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E8FF36]" />
                <span>Yol Tarifi</span>
              </a>
            </div>

            {/* Google Rating Trust Badge */}
            <div className="p-4 bg-[#0D0F12] border border-[#23272F] flex items-center justify-between">
              <span className="text-xs font-mono text-[#72757C] uppercase">
                Google Puanı
              </span>
              <span className="text-xs font-mono text-white font-bold">
                ★ {BUSINESS_CONFIG.rating.score} / 5 ({BUSINESS_CONFIG.rating.reviewCount} Değerlendirme)
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
