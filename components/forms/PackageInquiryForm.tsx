"use client";

import React, { useState } from "react";
import { PACKAGES_DATA } from "@/data/packages";
import { buildPackageWhatsAppUrl } from "@/lib/whatsapp";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PackageInquiryFormProps {
  defaultPackageSlug?: string;
}

export const PackageInquiryForm: React.FC<PackageInquiryFormProps> = ({
  defaultPackageSlug,
}) => {
  const defaultPkg =
    PACKAGES_DATA.find((p) => p.slug === defaultPackageSlug) || PACKAGES_DATA[2];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    packageName: defaultPkg.name,
    goal: "Vücut Kompozisyonu & Sıkılaşma",
    frequency: "Haftada 3 Gün",
    time: "Fark Etmez / Esnek",
    note: "",
    kvkkConsent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Lütfen ad, soyad ve telefon numaranızı eksiksiz giriniz.");
      return;
    }
    if (!formData.kvkkConsent) {
      setError("Devam etmek için KVKK onayını vermelisiniz.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  const whatsappUrl = buildPackageWhatsAppUrl({
    name: formData.name,
    phone: formData.phone,
    packageName: formData.packageName,
    goal: formData.goal,
    frequency: formData.frequency,
    time: formData.time,
    note: formData.note,
  });

  if (submitted) {
    return (
      <div className="bg-[#0D0F12] border border-[#23272F] p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 bg-[#E8FF36]/10 text-[#E8FF36] border border-[#E8FF36] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-bold text-white uppercase font-display mb-2">
          Teklif Talebiniz Alındı
        </h4>
        <p className="text-xs text-[#A5A7AD] mb-6">
          Sayın {formData.name}, seçtiğiniz <strong>{formData.packageName}</strong> için güncel seans planlaması ve teklifimiz en kısa sürede iletilecektir.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp&apos;tan Anında Görüş</span>
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0D0F12] border border-[#23272F] p-6 sm:p-8"
    >
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8FF36] block mb-1">
          HIZLI TEKLİF & BİLGİ
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display">
          Paket Teklifi Al
        </h3>
        <p className="text-xs text-[#A5A7AD] mt-1">
          Hedefinize ve takviminize en uygun seans planı için bilgilerinizi bırakın.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              Ad Soyad *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adınız Soyadınız"
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              Telefon *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="05XX XXX XX XX"
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              İlgilendiğiniz Paket
            </label>
            <select
              value={formData.packageName}
              onChange={(e) =>
                setFormData({ ...formData, packageName: e.target.value })
              }
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
            >
              {PACKAGES_DATA.map((p) => (
                <option key={p.id} value={p.name} className="bg-[#08090B]">
                  {p.name} ({p.sessionCount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              Öncelikli Hedef
            </label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
            >
              <option value="Yağ Kaybı & Sıkılaşma">Yağ Kaybı & Sıkılaşma</option>
              <option value="Kas Kazanımı & Hipertrofi">Kas Kazanımı & Hipertrofi</option>
              <option value="Saf Kuvvet & Güç">Saf Kuvvet & Güç</option>
              <option value="Kondisyon & VO2 Max">Kondisyon & VO2 Max</option>
              <option value="Postür Düzeltme & Mobilite">Postür Düzeltme & Mobilite</option>
              <option value="Spora Sıfırdan Başlangıç">Spora Sıfırdan Başlangıç</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              Haftalık Antrenman Sıklığı
            </label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
            >
              <option value="Haftada 2 Gün">Haftada 2 Gün</option>
              <option value="Haftada 3 Gün">Haftada 3 Gün (En İdeal)</option>
              <option value="Haftada 4+ Gün">Haftada 4+ Gün</option>
              <option value="Esnek / Kararsız">Esnek / Kararsız</option>
            </select>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              Saat Tercihi
            </label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
            >
              <option value="Sabah (07:00 – 12:00)">Sabah (07:00 – 12:00)</option>
              <option value="Öğlen (12:00 – 17:00)">Öğlen (12:00 – 17:00)</option>
              <option value="Akşam (17:00 – 22:00)">Akşam (17:00 – 22:00)</option>
              <option value="Fark Etmez / Esnek">Fark Etmez / Esnek</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
            Ek Not / Özel Durum (Opsiyonel)
          </label>
          <textarea
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Geçmiş sakatlık, özel saat talebi veya sormak istedikleriniz..."
            className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-3.5 py-2.5 text-white focus:outline-none"
          />
        </div>

        {/* KVKK */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={formData.kvkkConsent}
            onChange={(e) =>
              setFormData({ ...formData, kvkkConsent: e.target.checked })
            }
            className="mt-0.5 w-3.5 h-3.5 accent-[#E8FF36] bg-[#131519] border-[#23272F] shrink-0"
          />
          <span className="text-[11px] text-[#A5A7AD] leading-relaxed">
            İletişim bilgilerimin talebime dönüş yapılması amacıyla işlenmesini kabul ediyorum. (
            <Link href="/kvkk" target="_blank" className="text-white underline">
              KVKK
            </Link>
            )
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#191B20]">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Teklif Al</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] text-white hover:border-[#25D366] text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
          <span>WhatsApp&apos;tan Paket Sor</span>
        </a>
      </div>
    </form>
  );
};
