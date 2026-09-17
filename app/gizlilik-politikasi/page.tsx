import React from "react";
import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Core & Fit",
  description: "Core & Fit Private Sport Studio Gizlilik Politikası ve veri güvenliği ilkeleri.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090B] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
          YASAL BİLGİLENDİRME
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display mb-8">
          Gizlilik Politikası
        </h1>

        <div className="bg-[#0D0F12] border border-[#23272F] p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
          <p>
            Core & Fit | Private Sport Studio olarak ziyaretçilerimizin ve danışanlarımızın kişisel gizliliğine saygı duyuyoruz. Bu Gizlilik Politikası, web sitemizi kullandığınızda toplanan verilerin nasıl korunduğunu açıklamaktadır.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            Bilgi Güvenliği
          </h2>
          <p>
            Tarafınızca doldurulan tüm formlar SSL sertifikalı güvenli bağlantı üzerinden şifrelenerek iletilmektedir. Bilgileriniz yetkisiz erişime karşı teknik ve idari tedbirlerle korunmaktadır.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            Üçüncü Taraf Bağlantıları
          </h2>
          <p>
            Web sitemizde yer alan WhatsApp veya Instagram yönlendirmeleri ilgili platformların kendi gizlilik politikalarına tabidir.
          </p>

          <div className="pt-6 border-t border-[#191B20] text-xs font-mono text-[#72757C]">
            Son Güncelleme: Ocak 2025 • {BUSINESS_CONFIG.name}
          </div>
        </div>
      </div>
    </div>
  );
}
