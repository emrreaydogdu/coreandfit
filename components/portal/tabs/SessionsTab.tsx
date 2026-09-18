"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Check,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { COACHES_DATA } from "@/data/coaches";

const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:30 - 10:30",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "16:30 - 17:30",
  "18:00 - 19:00",
  "19:30 - 20:30",
];

const FOCUS_AREAS = [
  "Biyomekanik & Kuvvet (Deadlift / Squat)",
  "Postüral Düzeltme & Omurga Sağlığı",
  "Metabolik Kondisyon & Yağ Yakımı",
  "Fonksiyonel Mobilite & Esneklik",
  "Hipertrofi & Kas Kütlesi Kazanımı",
];

export const SessionsTab: React.FC = () => {
  const {
    remainingSessions,
    bookedSessions,
    bookSession,
    cancelSession,
    setActiveTab,
  } = useMember();

  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Booking selections
  const [selectedCoach, setSelectedCoach] = useState(COACHES_DATA[0]);
  const [selectedDate, setSelectedDate] = useState("2026-09-20");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[3]);
  const [selectedFocus, setSelectedFocus] = useState(FOCUS_AREAS[0]);
  const [notes, setNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate next 7 days for the picker
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cts"][d.getDay()];
    const dayNumber = d.getDate();
    const monthName = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"
    ][d.getMonth()];
    return { dateStr, dayName, dayNumber, monthName };
  });

  const handleFinishBooking = () => {
    const result = bookSession({
      coachId: selectedCoach.id,
      coachName: selectedCoach.name,
      coachTitle: selectedCoach.title,
      coachAvatar: selectedCoach.image,
      date: selectedDate,
      timeSlot: selectedTime,
      focusArea: selectedFocus,
      station: "Nişantaşı Özel İstasyon",
      notes: notes || undefined,
    });

    if (result.success) {
      setBookingWizardOpen(false);
      setStep(1);
      setToastMessage(result.message);
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-[#0F172A]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-[#ECFDF5] border border-[#10B981] text-[#065F46] rounded-2xl shadow-lg flex items-center gap-3 font-medium text-xs"
          >
            <Check className="w-5 h-5 text-[#10B981] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-sans text-[#10B981] uppercase tracking-wider font-bold block">
            RANDEVU VE DERS TAKVİMİ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] mt-0.5">
            Seanslarım & Randevu Planlama
          </h2>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Kalan Seans Krediniz:{" "}
            <span className="text-[#10B981] font-bold">{remainingSessions} Seans</span>
          </p>
        </div>

        <button
          onClick={() => {
            if (remainingSessions <= 0) {
              if (confirm("Seans krediniz kalmamıştır. Yeni paket yüklemek ister misiniz?")) {
                setActiveTab("store");
              }
            } else {
              setBookingWizardOpen(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#10B981]" />
          <span>Yeni Seans Ayırt</span>
        </button>
      </div>

      {/* Booked Sessions List */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold font-sans text-[#64748B] uppercase tracking-wider">
          Planlanmış Seanslar ({bookedSessions.length})
        </h3>

        {bookedSessions.length > 0 ? (
          bookedSessions.map((session) => {
            const coachName = "İlker Yüksel";
            const coachTitle = "Kurucu & Baş Antrenör (Founder & Head Coach)";
            return (
              <div
                key={session.id}
                className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-black/10 shrink-0 shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80"
                      alt={coachName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold font-sans text-[#2563EB]">
                        {session.date} • {session.timeSlot}
                      </span>
                      <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[10px] font-bold rounded-full uppercase">
                        {session.status === "confirmed" ? "ONAYLANDI (1:1)" : "TAMAMLANDI"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#0F172A] uppercase font-display">
                      {coachName} — {session.focusArea}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#64748B] flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{session.station}</span>
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Bizzat Kurucu Baş Antrenör Eşliğinde
                      </span>
                    </div>

                    {session.notes && (
                      <p className="text-xs text-[#475569] italic bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-black/[0.04] mt-1">
                        &ldquo;{session.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-black/[0.06]">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Bu seansı iptal etmek istediğinize emin misiniz? Seans krediniz hesabınıza derhal iade edilecektir."
                        )
                      ) {
                        cancelSession(session.id);
                      }
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    İptal Et
                  </button>
                  <div className="px-3.5 py-2 bg-[#F1F5F9] text-[#0F172A] rounded-xl text-xs font-semibold">
                    1:1 Özel Seans
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white border border-black/[0.06] rounded-3xl space-y-3 shadow-xs">
            <CalendarIcon className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <p className="text-xs text-[#64748B]">
              Şu anda planlanmış bir seansınız bulunmuyor.
            </p>
            <button
              onClick={() => setBookingWizardOpen(true)}
              className="px-5 py-2.5 bg-[#0F172A] text-white font-bold text-xs uppercase font-sans rounded-full hover:bg-[#1E293B]"
            >
              Hemen Seans Ayırt
            </button>
          </div>
        )}
      </div>

      {/* Interactive Booking Wizard Modal (Apple White Style) */}
      <AnimatePresence>
        {bookingWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white border border-black/[0.08] rounded-3xl p-7 shadow-2xl text-[#0F172A] my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setBookingWizardOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Wizard Steps Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  <span>YENİ SEANS REZERVASYONU</span>
                  <span className="text-[#0F172A]">ADIM {step} / 4</span>
                </div>
                <div className="grid grid-cols-4 gap-2 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className={`h-full ${step >= 1 ? "bg-[#0F172A]" : "bg-transparent"}`} />
                  <div className={`h-full ${step >= 2 ? "bg-[#0F172A]" : "bg-transparent"}`} />
                  <div className={`h-full ${step >= 3 ? "bg-[#0F172A]" : "bg-transparent"}`} />
                  <div className={`h-full ${step >= 4 ? "bg-[#0F172A]" : "bg-transparent"}`} />
                </div>
              </div>

              {/* Step 1: Select Coach (Ultra Detailed Solo Coach Presentation) */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                      ● TEK KOÇLU BUTİK STÜDYO MODELİ
                    </span>
                    <h3 className="text-xl font-bold uppercase font-display text-[#0F172A]">
                      1. Birebir Antrenörünüz
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Core & Fit&apos;te tüm seanslar yalnızca kurucu baş antrenör İlker Yüksel tarafından 1:1 yönetilir. Stajyer veya asistan çalıştırılmaz.
                    </p>
                  </div>

                  {/* Detailed Solo Coach Spotlight Card */}
                  <div className="p-5 rounded-2xl border-2 border-[#0F172A] bg-[#F8FAFC] shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-black/10 shrink-0 shadow-xs">
                        <img
                          src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80"
                          alt="İlker Yüksel"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-[#0F172A] block uppercase font-display">
                            İlker Yüksel
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            ✓ Doğrulanmış Kurucu
                          </span>
                        </div>
                        <span className="text-xs text-[#2563EB] font-bold block">
                          Kurucu & Baş Antrenör (Founder & Head Coach)
                        </span>
                        <span className="text-[11px] text-[#64748B] mt-0.5 block font-medium">
                          10+ Yıl Deneyim • Marmara BESYO • Nişantaşı Studio
                        </span>
                      </div>
                    </div>

                    {/* Certifications & Specialties Badges */}
                    <div className="space-y-2 pt-1 border-t border-black/[0.05]">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        AKREDİTASYON & UZMANLIKLAR:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                        <span className="px-2 py-0.5 bg-white border border-black/[0.08] rounded-md text-[#0F172A]">
                          NSCA - CSCS
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-black/[0.08] rounded-md text-[#0F172A]">
                          NASM - CES
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-black/[0.08] rounded-md text-[#0F172A]">
                          FMS Level 1 & 2
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-black/[0.08] rounded-md text-[#0F172A]">
                          EXOS Specialist
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md">
                          Biyomekanik & Omurga
                        </span>
                      </div>
                    </div>

                    {/* Studio Guarantee Callout */}
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl text-[11px] text-emerald-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>%100 Birebir Kurucu Koçluğu Garantisi</span>
                      </div>
                      <p className="text-[#334155] leading-relaxed">
                        Tüm randevularınız bizzat İlker Yüksel eşliğinde gerçekleşir. Antrenman programınız, form kontrolleriniz ve biyomekanik analizleriniz doğrudan baş antrenör tarafından takip edilir.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] flex items-center gap-2 shadow-sm"
                    >
                      <span>Tarih Seçimine Geç</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Date */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-xl font-bold uppercase font-display text-[#0F172A]">
                      2. Antrenman Gününü Seçiniz
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {days.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`p-3.5 rounded-2xl border text-center transition-all ${
                          selectedDate === d.dateStr
                            ? "border-[#0F172A] bg-[#0F172A] text-white font-bold shadow-md"
                            : "border-black/[0.06] bg-[#F8FAFC] text-[#0F172A] hover:border-black/[0.15]"
                        }`}
                      >
                        <span className="text-[10px] font-sans block uppercase">
                          {d.dayName}
                        </span>
                        <span className="text-2xl font-bold font-display block my-1">
                          {d.dayNumber}
                        </span>
                        <span className="text-[10px] font-sans block uppercase">
                          {d.monthName}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                    >
                      Geri
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] flex items-center gap-2 shadow-sm"
                    >
                      <span>Saat Seçimine Geç</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Select Time Slot */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-xl font-bold uppercase font-display text-[#0F172A]">
                      3. Seans Saatini Seçiniz
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {TIME_SLOTS.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-3.5 rounded-2xl border font-sans text-xs text-center transition-all ${
                          selectedTime === slot
                            ? "border-[#0F172A] bg-[#0F172A] text-white font-bold shadow-md"
                            : "border-black/[0.06] bg-[#F8FAFC] text-[#0F172A] hover:border-black/[0.15]"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                    >
                      Geri
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="px-6 py-3 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] flex items-center gap-2 shadow-sm"
                    >
                      <span>Hedef & Onay</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm & Details */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(3)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-xl font-bold uppercase font-display text-[#0F172A]">
                      4. Seans Odağı & Onay
                    </h3>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-[#F8FAFC] border border-black/[0.06] rounded-2xl space-y-2.5 font-sans text-xs">
                    <div className="flex justify-between border-b border-black/[0.06] pb-2">
                      <span className="text-[#64748B]">Seçilen Koç:</span>
                      <span className="font-bold text-[#0F172A]">{selectedCoach.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/[0.06] pb-2">
                      <span className="text-[#64748B]">Tarih & Saat:</span>
                      <span className="font-bold text-[#2563EB]">
                        {selectedDate} • {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Düşülecek Seans:</span>
                      <span className="font-bold text-[#0F172A]">1 Seans Kredisi</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                      SEANS ODAK BÖLGESİ
                    </label>
                    <select
                      value={selectedFocus}
                      onChange={(e) => setSelectedFocus(e.target.value)}
                      className="w-full bg-white border border-black/[0.12] rounded-2xl px-3.5 py-3 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#0F172A]"
                    >
                      {FOCUS_AREAS.map((f, i) => (
                        <option key={i} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">
                      KOÇUNUZA ÖZEL NOT (İSTEĞE BAĞLI)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Örn: Bugün deadlift PR veya mobiliteye ağırlık vermek istiyorum..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-black/[0.12] rounded-2xl p-3.5 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                    >
                      Geri
                    </button>
                    <button
                      onClick={handleFinishBooking}
                      className="px-8 py-3.5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] shadow-lg shadow-slate-900/10"
                    >
                      Seansı Onayla & Ayırt
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
