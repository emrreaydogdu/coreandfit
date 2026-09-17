"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { buildConsultationWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowLeft, Check, MessageSquare, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const GOALS = [
  { id: "yag-kaybi", label: "Yağ Kaybı" },
  { id: "kas-kazanimi", label: "Kas Kazanımı" },
  { id: "guc", label: "Güç Gelişimi" },
  { id: "kondisyon", label: "Kondisyon & Dayanıklılık" },
  { id: "postur", label: "Postür & Duruş Düzeltme" },
  { id: "mobilite", label: "Mobilite & Esneklik" },
  { id: "spora-baslangic", label: "Spora Başlangıç" },
  { id: "diger", label: "Diğer / Özel Hedef" },
];

const EXPERIENCES = [
  { id: "yeni", label: "Yeni başlıyorum (Hiç spor yapmadım veya uzun ara verdim)" },
  { id: "0-1", label: "0 – 1 Yıl (Temel egzersizleri biliyorum)" },
  { id: "1-3", label: "1 – 3 Yıl (Düzenli spor geçmişim var)" },
  { id: "3plus", label: "3+ Yıl (İleri seviye tecrübeliyim)" },
];

const FREQUENCIES = [
  { id: "1", label: "Haftada 1 Gün" },
  { id: "2", label: "Haftada 2 Gün" },
  { id: "3", label: "Haftada 3 Gün (Önerilen)" },
  { id: "4plus", label: "Haftada 4+ Gün" },
];

const TIME_SLOTS = [
  { id: "sabah", label: "Sabah (07:00 – 12:00)" },
  { id: "oglen", label: "Öğlen (12:00 – 17:00)" },
  { id: "aksam", label: "Akşam (17:00 – 22:00)" },
  { id: "fark-etmez", label: "Fark Etmez / Esnek" },
];

export const ConsultationFunnel: React.FC = () => {
  const searchParams = useSearchParams();
  const initialGoal = searchParams.get("hedef") || "";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: "",
    experience: "",
    frequency: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    kvkkConsent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialGoal) {
      const matched = GOALS.find(
        (g) => g.id.toLowerCase() === initialGoal.toLowerCase()
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, goal: matched.label }));
      }
    }
  }, [initialGoal]);

  const handleNext = () => {
    const currentErrors: Record<string, string> = {};

    if (step === 1 && !formData.goal) {
      currentErrors.goal = "Lütfen bir hedef seçiniz.";
    } else if (step === 2 && !formData.experience) {
      currentErrors.experience = "Lütfen spor geçmişinizi belirtiniz.";
    } else if (step === 3 && !formData.frequency) {
      currentErrors.frequency = "Lütfen haftalık hedef gün sayısını seçiniz.";
    } else if (step === 4 && !formData.time) {
      currentErrors.time = "Lütfen tercih ettiğiniz saat aralığını seçiniz.";
    } else if (step === 5) {
      if (!formData.name.trim()) currentErrors.name = "Ad ve soyad zorunludur.";
      if (!formData.phone.trim()) currentErrors.phone = "Telefon numarası zorunludur.";
      if (!formData.kvkkConsent)
        currentErrors.kvkk = "Devam etmek için KVKK onayını vermelisiniz.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
    if (typeof window !== "undefined" && whatsappUrl) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const whatsappUrl = buildConsultationWhatsAppUrl({
    name: formData.name,
    goal: formData.goal,
    experience: formData.experience,
    frequency: formData.frequency,
    time: formData.time,
  });

  if (isSubmitted) {
    return (
      <div className="bg-[#0D0F12] border border-[#23272F] p-8 sm:p-12 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-[#E8FF36]/10 border border-[#E8FF36] text-[#E8FF36] flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
          BAŞVURU BAŞARIYLA ALINDI
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display mb-4">
          Görüşme Talebiniz Alınmıştır
        </h3>

        <p className="text-sm text-[#A5A7AD] leading-relaxed mb-8">
          Teşekkür ederiz Sayın <strong className="text-white">{formData.name}</strong>. Nişantaşı stüdyo ekibimiz en kısa sürede sizinle iletişime geçerek ücretsiz ön görüşme takviminizi netleştirecektir.
        </p>

        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-6 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#20bd5a] transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp&apos;tan Hızlı Devam Et</span>
          </a>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center min-h-[46px] px-6 bg-[#131519] border border-[#23272F] text-[#A5A7AD] hover:text-white font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0F12] border border-[#23272F] p-6 sm:p-10 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-[#72757C] uppercase tracking-wider mb-2">
          <span>Adım {step} / 6</span>
          <span className="text-[#E8FF36] font-bold">
            {step === 1 && "Hedef Belirleme"}
            {step === 2 && "Deneyim Seviyesi"}
            {step === 3 && "Haftalık Sıklık"}
            {step === 4 && "Zaman Tercihi"}
            {step === 5 && "İletişim Bilgileri"}
            {step === 6 && "Özet & Onay"}
          </span>
        </div>
        <div className="w-full h-1 bg-[#191B20]">
          <div
            className="h-full bg-[#E8FF36] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Öncelikli hedefiniz nedir?
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Antrenman programınızın odak noktasını belirlemek için seçiniz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFormData({ ...formData, goal: g.label })}
                className={cn(
                  "p-4 text-left border text-xs uppercase tracking-wider font-semibold transition-all",
                  formData.goal === g.label
                    ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36]"
                    : "bg-[#131519] text-[#A5A7AD] border-[#23272F] hover:border-[#343A46] hover:text-white"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
          {errors.goal && (
            <p className="text-red-400 text-xs mt-3">{errors.goal}</p>
          )}
        </div>
      )}

      {/* Step 2: Experience */}
      {step === 2 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Antrenman geçmişiniz nedir?
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Başlangıç yoğunluğunuzu ve hareket zorluğunu güvenle ayarlamak için gereklidir.
          </p>

          <div className="space-y-2.5">
            {EXPERIENCES.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setFormData({ ...formData, experience: exp.label })}
                className={cn(
                  "w-full p-4 text-left border text-xs tracking-wider font-medium transition-all",
                  formData.experience === exp.label
                    ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36] font-bold"
                    : "bg-[#131519] text-[#A5A7AD] border-[#23272F] hover:border-[#343A46] hover:text-white"
                )}
              >
                {exp.label}
              </button>
            ))}
          </div>
          {errors.experience && (
            <p className="text-red-400 text-xs mt-3">{errors.experience}</p>
          )}
        </div>
      )}

      {/* Step 3: Frequency */}
      {step === 3 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Haftada kaç gün antrenman planlıyorsunuz?
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Yaşam düzeninize en uygun sürdürülebilir seans frekansını belirleyelim.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FREQUENCIES.map((freq) => (
              <button
                key={freq.id}
                type="button"
                onClick={() => setFormData({ ...formData, frequency: freq.label })}
                className={cn(
                  "p-4 text-left border text-xs uppercase tracking-wider font-semibold transition-all",
                  formData.frequency === freq.label
                    ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36]"
                    : "bg-[#131519] text-[#A5A7AD] border-[#23272F] hover:border-[#343A46] hover:text-white"
                )}
              >
                {freq.label}
              </button>
            ))}
          </div>
          {errors.frequency && (
            <p className="text-red-400 text-xs mt-3">{errors.frequency}</p>
          )}
        </div>
      )}

      {/* Step 4: Time Slot */}
      {step === 4 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Tercih ettiğiniz seans saati?
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Günün hangi diliminde stüdyoda çalışmak istersiniz?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setFormData({ ...formData, time: slot.label })}
                className={cn(
                  "p-4 text-left border text-xs uppercase tracking-wider font-semibold transition-all",
                  formData.time === slot.label
                    ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36]"
                    : "bg-[#131519] text-[#A5A7AD] border-[#23272F] hover:border-[#343A46] hover:text-white"
                )}
              >
                {slot.label}
              </button>
            ))}
          </div>
          {errors.time && (
            <p className="text-red-400 text-xs mt-3">{errors.time}</p>
          )}
        </div>
      )}

      {/* Step 5: Contact Info */}
      {step === 5 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            İletişim Bilgileriniz
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Nişantaşı stüdyo koordinatörümüzün size dönüş yapabilmesi için bilgilerinizi giriniz.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white mb-1.5">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Adınız ve Soyadınız"
                className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white mb-1.5">
                Telefon Numarası *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="05XX XXX XX XX"
                className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white mb-1.5">
                E-Posta Adresi (Opsiyonel)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ornek@domain.com"
                className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* 39. KVKK Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.kvkkConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, kvkkConsent: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 accent-[#E8FF36] bg-[#131519] border-[#23272F] rounded-none shrink-0"
                />
                <span className="text-xs text-[#A5A7AD] leading-relaxed">
                  İletişim bilgilerimin talebime dönüş yapılması amacıyla işlenmesini kabul ediyorum. (
                  <Link
                    href="/kvkk"
                    target="_blank"
                    className="text-white underline hover:text-[#E8FF36]"
                  >
                    KVKK Aydınlatma Metni
                  </Link>
                  )
                </span>
              </label>
              {errors.kvkk && (
                <p className="text-red-400 text-xs mt-1">{errors.kvkk}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Summary & Confirmation */}
      {step === 6 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Başvuru Özeti
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Girdiğiniz bilgileri kontrol edip görüşme talebinizi oluşturabilirsiniz.
          </p>

          <div className="bg-[#131519] border border-[#23272F] divide-y divide-[#191B20] text-xs font-mono mb-6">
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">HEDEF:</span>
              <span className="text-white font-bold">{formData.goal}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">GEÇMİŞ:</span>
              <span className="text-white font-bold">{formData.experience}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">HAFTALIK PLAN:</span>
              <span className="text-white font-bold">{formData.frequency}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">SAAT TERCİHİ:</span>
              <span className="text-white font-bold">{formData.time}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">AD SOYAD:</span>
              <span className="text-white font-bold">{formData.name}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">TELEFON:</span>
              <span className="text-white font-bold">{formData.phone}</span>
            </div>
          </div>

          <p className="text-[11px] text-[#72757C] mb-6">
            Talebinizi ilettiğinizde antrenörlerimiz takvimi kontrol edip sizi arayacaktır. Dilerseniz formu doğrudan WhatsApp üzerinden de gönderebilirsiniz.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-[#191B20] flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-3 bg-[#131519] border border-[#23272F] text-[#A5A7AD] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Geri</span>
          </button>
        ) : (
          <div />
        )}

        {step < 6 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
          >
            <span>Devam Et</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(232,255,54,0.15)] w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Görüşme Talebi Oluştur</span>
          </button>
        )}
      </div>
    </div>
  );
};
