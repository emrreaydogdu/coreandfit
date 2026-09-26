"use client";

import React, { useState } from "react";
import { buildBookingWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, MessageSquare, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMember } from "@/context/MemberContext";

const BOOKING_TYPES = [
  {
    id: "on-gorusme",
    title: "Ücretsiz Ön Görüşme",
    duration: "25 Dakika",
    desc: "Stüdyomuzu ziyaret ederek koçumuzla hedeflerinizi konuşun, ücretsiz ilk değerlendirmenizi yaptırın.",
  },
  {
    id: "pt-bilgi",
    title: "1:1 Antrenman Bilgilendirmesi",
    duration: "20 Dakika",
    desc: "Kişisel antrenörlük sistemimiz, haftalık programınız ve gelişim takibi hakkında bilgi alın.",
  },
  {
    id: "paket-gorusmesi",
    title: "Paket & Takvim Planlaması",
    duration: "20 Dakika",
    desc: "Bütçenize, takviminize ve haftalık frekansınıza en uygun seans paketini koçumuzla birlikte kararlaştırın.",
  },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export const BookingWizard: React.FC = () => {
  const { checkSlotAvailability } = useMember();
  const [step, setStep] = useState(1);

  // Generate the next 10 days for booking
  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dayName = d.toLocaleDateString("tr-TR", { weekday: "short" });
    const dayNum = d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
    const fullDate = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" });
    return { id: d.toISOString().split("T")[0], dayName, dayNum, fullDate };
  });

  const [formData, setFormData] = useState({
    bookingType: BOOKING_TYPES[0].title,
    date: dates[0].fullDate,
    timeSlot: "10:00",
    name: "",
    phone: "",
    email: "",
    kvkkConsent: false,
  });

  const [calendarTableMode, setCalendarTableMode] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const errs: Record<string, string> = {};
    if (step === 3) {
      const status = checkSlotAvailability(formData.date, formData.timeSlot);
      if (!status.isAvailable) {
        errs.timeSlot = "Seçilen saat doludur. Lütfen müsait bir saat seçiniz.";
      }
    }

    if (step === 4) {
      if (!formData.name.trim()) errs.name = "Ad ve soyad zorunludur.";
      if (!formData.phone.trim()) errs.phone = "Telefon numarası zorunludur.";
      if (!formData.kvkkConsent) errs.kvkk = "KVKK metnini onaylamalısınız.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Ön görüşme talebi hesap gerektirmez; talep WhatsApp üzerinden stüdyoya iletilir ve saat stüdyo tarafından teyit edilir.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = buildBookingWhatsAppUrl({
    bookingType: formData.bookingType,
    date: formData.date,
    timeSlot: formData.timeSlot,
    name: formData.name,
    phone: formData.phone,
  });

  if (submitted) {
    return (
      <div className="bg-[#0D0F12] border border-[#23272F] p-8 sm:p-12 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-[#E8FF36]/10 border border-[#E8FF36] text-[#E8FF36] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
          RANDEVU TALEBİ OLUŞTURULDU
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display mb-4">
          Talebiniz Alındı
        </h3>
        <p className="text-sm text-[#A5A7AD] leading-relaxed mb-6">
          Sayın <strong className="text-white">{formData.name}</strong>, <strong>{formData.date}</strong> saat <strong>{formData.timeSlot}</strong> için ön görüşme talebiniz hazır. Aşağıdaki butonla WhatsApp üzerinden gönderin; ekibimiz saati teyit edecek.
        </p>

        <div className="p-4 bg-[#131519] border border-[#23272F] text-xs font-mono text-left mb-8 divide-y divide-[#191B20]">
          <div className="pb-2 flex justify-between">
            <span className="text-[#72757C]">GÖRÜŞME TÜRÜ:</span>
            <span className="text-white font-bold">{formData.bookingType}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-[#72757C]">LOKASYON:</span>
            <span className="text-white font-bold">Nişantaşı / İstanbul</span>
          </div>
          <div className="pt-2 flex justify-between">
            <span className="text-[#72757C]">İLETİŞİM:</span>
            <span className="text-white font-bold">{formData.phone}</span>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-6 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#20bd5a] transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Talebi WhatsApp&apos;tan Gönder</span>
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
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-[#72757C] uppercase tracking-wider mb-2">
          <span>Adım {step} / 5</span>
          <span className="text-[#E8FF36] font-bold">
            {step === 1 && "Görüşme Türü"}
            {step === 2 && "Tarih Seçimi"}
            {step === 3 && "Saat Seçimi"}
            {step === 4 && "Kişisel Bilgiler"}
            {step === 5 && "Özet & Onay"}
          </span>
        </div>
        <div className="w-full h-1 bg-[#191B20]">
          <div
            className="h-full bg-[#E8FF36] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Booking Type */}
      {step === 1 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Görüşme Türü Seçin
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Nişantaşı stüdyomuzda sizin için hangi görüşmeyi planlayalım?
          </p>

          <div className="space-y-3">
            {BOOKING_TYPES.map((bt) => (
              <button
                key={bt.id}
                type="button"
                onClick={() => setFormData({ ...formData, bookingType: bt.title })}
                className={cn(
                  "w-full p-4 sm:p-5 text-left border transition-all flex flex-col gap-1",
                  formData.bookingType === bt.title
                    ? "bg-[#131519] border-[#E8FF36] shadow-[0_0_15px_rgba(232,255,54,0.1)]"
                    : "bg-[#131519] border-[#23272F] hover:border-[#343A46]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white uppercase font-display">
                    {bt.title}
                  </span>
                  <span className="text-[11px] font-mono text-[#E8FF36] bg-[#E8FF36]/10 px-2 py-0.5 border border-[#E8FF36]/30">
                    {bt.duration}
                  </span>
                </div>
                <p className="text-xs text-[#A5A7AD] mt-1">{bt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection (with Calendar Table mode) */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display">
              Tarih & Saat Seçin
            </h3>

            {/* View mode toggle */}
            <div className="flex items-center p-1 bg-[#191B20] border border-[#23272F]">
              <button
                type="button"
                onClick={() => setCalendarTableMode(true)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5",
                  calendarTableMode ? "bg-[#E8FF36] text-[#08090B] font-bold" : "text-[#72757C] hover:text-white"
                )}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Takvim Tablosu</span>
              </button>
              <button
                type="button"
                onClick={() => setCalendarTableMode(false)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5",
                  !calendarTableMode ? "bg-[#E8FF36] text-[#08090B] font-bold" : "text-[#72757C] hover:text-white"
                )}
              >
                <List className="w-3 h-3" />
                <span>Gün Kartları</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[#A5A7AD] mb-6">
            {calendarTableMode
              ? "Aşağıdaki haftalık takvim tablosundan dilediğiniz gün ve saat slotuna doğrudan tıklayarak seçin."
              : "Önümüzdeki 10 gün içerisinden size en uygun günü belirleyin."}
          </p>

          {calendarTableMode ? (
            /* CALENDAR TABLE MODE */
            <div className="space-y-4">
              <div className="overflow-x-auto border border-[#23272F] bg-[#131519]">
                <table className="w-full border-collapse min-w-[560px] text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#23272F] bg-[#0D0F12]">
                      <th className="p-3 text-[10px] text-[#72757C] uppercase tracking-wider w-20 sticky left-0 z-10 bg-[#0D0F12] border-r border-[#23272F]">
                        SAAT
                      </th>
                      {dates.slice(0, 5).map((d) => (
                        <th key={d.id} className="p-2.5 text-center border-r border-[#23272F] last:border-r-0">
                          <span className="text-[10px] text-[#A5A7AD] uppercase block">{d.dayName}</span>
                          <span className="text-xs font-bold text-white">{d.dayNum}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D2128]">
                    {["08:00", "09:00", "09:30", "11:00", "14:00", "16:00", "18:00", "19:30"].map((timeSlot) => (
                      <tr key={timeSlot} className="hover:bg-[#191C22] transition-colors">
                        <td className="p-2.5 font-bold text-white sticky left-0 z-10 bg-[#131519] border-r border-[#23272F] whitespace-nowrap">
                          {timeSlot}
                        </td>
                        {dates.slice(0, 5).map((d) => {
                          const slotStatus = checkSlotAvailability(d.id, timeSlot);
                          const isAvail = slotStatus.isAvailable;
                          const isSelected = formData.date === d.fullDate && formData.timeSlot === timeSlot;

                          if (!isAvail) {
                            return (
                              <td key={`${d.id}-${timeSlot}`} className="p-1.5 border-r border-[#23272F] last:border-r-0 text-center">
                                <button
                                  type="button"
                                  disabled
                                  className="w-full py-2 px-1 text-[10px] font-mono tracking-wider border block bg-[#1C0E12] border-rose-900/40 text-rose-400/80 cursor-not-allowed select-none"
                                  title={`${d.dayName} ${d.dayNum} saat ${timeSlot} DOLU (Müsait değil)`}
                                >
                                  <span className="flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    DOLU
                                  </span>
                                </button>
                              </td>
                            );
                          }

                          return (
                            <td key={`${d.id}-${timeSlot}`} className="p-1.5 border-r border-[#23272F] last:border-r-0 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    date: d.fullDate,
                                    timeSlot: timeSlot,
                                  });
                                  setStep(4); // Advance directly to contact info!
                                }}
                                className={cn(
                                  "w-full py-2 px-1 text-[11px] font-mono tracking-wider transition-all border block",
                                  isSelected
                                    ? "bg-[#E8FF36] text-black border-[#E8FF36] font-bold shadow-[0_0_10px_rgba(232,255,54,0.3)]"
                                    : "bg-[#191B20] text-[#A5A7AD] border-[#2A2E38] hover:border-[#E8FF36] hover:text-white"
                                )}
                                title={`${d.dayName} ${d.dayNum} saat ${timeSlot} için seç`}
                              >
                                Seç
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[#72757C] font-mono">
                * Kırmızı renkli kutucuklar DOLU / Rezerve seanslardır. Müsait yeşil slotlara tıklayarak doğrudan rezervasyon yapabilirsiniz.
              </p>
            </div>
          ) : (
            /* CLASSIC CARDS MODE */
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {dates.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, date: d.fullDate })}
                    className={cn(
                      "p-3 text-center border transition-all flex flex-col items-center justify-center gap-1",
                      formData.date === d.fullDate
                        ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36] font-bold"
                        : "bg-[#131519] text-white border-[#23272F] hover:border-[#343A46]"
                    )}
                  >
                    <span className="text-[11px] font-mono uppercase tracking-wider opacity-75">
                      {d.dayName}
                    </span>
                    <span className="text-sm font-bold uppercase">{d.dayNum}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#72757C] mt-4 font-mono">
                Seçili Gün: <strong className="text-white">{formData.date}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Time Slot Selection */}
      {step === 3 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Saat Dilimi Seçin
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Stüdyoda sizin için ayrılacak randevu saatini seçin.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const slotStatus = checkSlotAvailability(formData.date, slot);
              const isAvail = slotStatus.isAvailable;

              if (!isAvail) {
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled
                    className="py-3 px-2 text-center border text-xs font-mono tracking-wider transition-all bg-[#1C0E12] text-rose-400/70 border-rose-900/40 cursor-not-allowed opacity-70 flex items-center justify-center gap-1.5"
                    title={`${slot} saatinde randevu doludur`}
                  >
                    <span className="line-through">{slot}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded">
                      DOLU
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setFormData({ ...formData, timeSlot: slot })}
                  className={cn(
                    "py-3 px-2 text-center border text-xs font-mono tracking-wider transition-all",
                    formData.timeSlot === slot
                      ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36] font-bold"
                      : "bg-[#131519] text-white border-[#23272F] hover:border-[#343A46]"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#72757C] mt-4 font-mono">
            Seçili Saat: <strong className="text-white">{formData.timeSlot}</strong>
          </p>
        </div>
      )}

      {/* Step 4: Contact Details */}
      {step === 4 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            İletişim Bilgileriniz
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Randevu teyidi ve stüdyo giriş bilgisi için bilgilerinizi giriniz.
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
                className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-sm text-white focus:outline-none"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white mb-1.5">
                Telefon *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="05XX XXX XX XX"
                className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-sm text-white focus:outline-none"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white mb-1.5">
                E-Posta (Opsiyonel)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ornek@domain.com"
                className="w-full bg-[#131519] border border-[#23272F] focus:border-[#E8FF36] px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            {/* KVKK */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
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
            {errors.kvkk && <p className="text-red-400 text-xs">{errors.kvkk}</p>}
          </div>
        </div>
      )}

      {/* Step 5: Summary */}
      {step === 5 && (
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-2">
            Randevu Özeti
          </h3>
          <p className="text-xs text-[#A5A7AD] mb-6">
            Lütfen randevu detaylarınızı teyit ediniz.
          </p>

          <div className="bg-[#131519] border border-[#23272F] divide-y divide-[#191B20] text-xs font-mono mb-6">
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">GÖRÜŞME TÜRÜ:</span>
              <span className="text-white font-bold">{formData.bookingType}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">TARİH:</span>
              <span className="text-white font-bold">{formData.date}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">SAAT:</span>
              <span className="text-white font-bold">{formData.timeSlot}</span>
            </div>
            <div className="p-3.5 flex justify-between">
              <span className="text-[#72757C]">LOKASYON:</span>
              <span className="text-white font-bold">Nişantaşı / İstanbul</span>
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
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-[#191B20] flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#131519] border border-[#23272F] text-[#A5A7AD] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Geri</span>
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
          >
            <span>Devam Et</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Talebi Gönder</span>
          </button>
        )}
      </div>
    </div>
  );
};
