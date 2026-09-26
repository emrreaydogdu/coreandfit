import React from "react";
import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Core & Fit",
  description: "Core & Fit Private Sport Studio Kişisel Verilerin Korunması Kanunu (KVKK) aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <div className="pt-28 pb-20 bg-[#08090B] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
          YASAL BİLGİLENDİRME
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display mb-8">
          KVKK Aydınlatma Metni
        </h1>

        <div className="bg-[#0D0F12] border border-[#23272F] p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
          <p>
            <strong>Core & Fit | Private Sport Studio</strong> (&ldquo;Core & Fit&rdquo;) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca veri sorumlusu sıfatıyla, tarafımıza iletmiş olduğunuz kişisel verilerinizin güvenliğine ve gizliliğine azami hassasiyet göstermekteyiz.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            1. İşlenen Kişisel Verileriniz
          </h2>
          <p>
            Web sitemizdeki ön görüşme, randevu, paket teklifi ve iletişim formları vasıtasıyla; adınız, soyadınız, telefon numaranız, e-posta adresiniz ve antrenman tercihleriniz (hedef, spor geçmişi, seans zamanı tercihi vb.) işlenmektedir.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            2. Kişisel Verilerin İşlenme Amaçları
          </h2>
          <p>
            Toplanan kişisel verileriniz;
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#72757C]">
            <li>1:1 antrenman ve ön görüşme taleplerinizin değerlendirilmesi ve planlanması,</li>
            <li>Randevu teyidi ve takvim organizasyonunun sağlanması,</li>
            <li>Talep ettiğiniz paket ve seans tekliflerinin hazırlanarak tarafınıza iletilmesi,</li>
            <li>İletişim taleplerinize telefon veya WhatsApp üzerinden dönüş yapılması amaçlarıyla işlenmektedir.</li>
          </ul>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            3. Kişisel Verilerin Aktarılması
          </h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar ve kanunlarda açıkça belirtilen haller haricinde üçüncü şahıs veya kurumlarla ticari amaçlarla asla paylaşılmaz.
          </p>

          <h2 className="text-base font-bold text-white uppercase font-display pt-4">
            4. İlgili Kişi Olarak Haklarınız
          </h2>
          <p>
            KVKK’nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, silinmesini veya düzeltilmesini talep etme haklarına sahipsiniz. Başvurularınızı info@coreandfit.com.tr adresi üzerinden stüdyomuza iletebilirsiniz.
          </p>

          <div className="pt-6 border-t border-[#191B20] text-xs font-mono text-[#72757C]">
            Lokasyon: {BUSINESS_CONFIG.displayLocation} • İletişim: {BUSINESS_CONFIG.phone}
          </div>
        </div>
      </div>
    </div>
  );
}
