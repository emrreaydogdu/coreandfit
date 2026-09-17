"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, MessageSquare } from "lucide-react";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    kvkkConsent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Lütfen ad, soyad ve telefon bilgilerinizi giriniz.");
      return;
    }
    if (!formData.kvkkConsent) {
      setError("Devam etmek için KVKK onayını vermelisiniz.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-[#0D0F12] border border-[#23272F] text-center">
        <div className="w-12 h-12 bg-[#E8FF36]/10 text-[#E8FF36] border border-[#E8FF36] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-bold text-white uppercase font-display mb-2">
          Mesajınız İletildi
        </h4>
        <p className="text-xs text-[#A5A7AD] mb-6">
          Teşekkür ederiz Sayın {formData.name}. Talebiniz stüdyo ekibimize ulaştı. En kısa sürede dönüş sağlayacağız.
        </p>
        <a
          href={buildQuickChatWhatsAppUrl(`Merhaba, iletişim formu üzerinden yazdım. Adım: ${formData.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp&apos;tan Hızlı İletişime Geç</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-[#0D0F12] border border-[#23272F]">
      <h3 className="text-xl font-bold text-white uppercase font-display mb-2">
        Bize Mesaj Gönderin
      </h3>
      <p className="text-xs text-[#A5A7AD] mb-6">
        Stüdyomuz, antrenman programlarımız veya üyelik şartları hakkında dilediğinizi sorun.
      </p>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
            Ad Soyad *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Adınız ve Soyadınız"
            className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
              E-Posta
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ornek@domain.com"
              className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono uppercase tracking-wider text-white mb-1.5">
            Mesajınız *
          </label>
          <textarea
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Sorularınız, hedefleriniz ya da iletmek istediğiniz detaylar..."
            className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-white focus:outline-none"
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
              KVKK Aydınlatma Metni
            </Link>
            )
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Mesajı Gönder</span>
      </button>
    </form>
  );
};
