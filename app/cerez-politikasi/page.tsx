import React from "react";
import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";

export const metadata: Metadata = {
  title: "Çerez Politikası | Core & Fit",
  description: "Core & Fit Private Sport Studio Çerez (Cookie) Politikası.",
};

export default function CerezPolitikasiPage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090B] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
          YASAL BİLGİLENDİRME
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display mb-8">
          Çerez Politikası
        </h1>

        <div className="bg-[#0D0F12] border border-[#23272F] p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
          <p>
            Bu Çerez Politikası, Core & Fit web sitesinde kullanılan çerezlerin (cookies) türlerini ve hangi amaçla kullanıldıklarını açıklamaktadır.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            Çerez Nedir?
          </h2>
          <p>
            Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Sitenin düzgün çalışması, tercihlerin hatırlanması ve kullanıcı deneyiminin geliştirilmesi için kullanılır.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            Kullanılan Çerez Türleri
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-[#72757C]">
            <li><strong>Zorunlu Çerezler:</strong> Web sitesinin temel işlevlerinin (form adımları, oturum güvenliği) çalışması için gereklidir.</li>
            <li><strong>Analitik Çerezler:</strong> Sitemizin nasıl kullanıldığını anlamamıza ve performansını artırmamıza yardımcı olur.</li>
          </ul>

          <div className="pt-6 border-t border-[#191B20] text-xs font-mono text-[#72757C]">
            {BUSINESS_CONFIG.fullName} • Nişantaşı / İstanbul
          </div>
        </div>
      </div>
    </div>
  );
}
