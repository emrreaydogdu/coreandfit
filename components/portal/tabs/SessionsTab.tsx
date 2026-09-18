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
          bookedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-black/10 shrink-0 shadow-xs">
                  <img
                    src={session.coachAvatar}
                    alt={session.coachName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#2563EB]">
                      {session.date} • {session.timeSlot}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[10px] font-bold rounded-full uppercase">
                      {session.status === "confirmed" ? "ONAYLANDI" : "TAMAMLANDI"}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#0F172A] uppercase font-display mt-0.5">
                    {session.coachName} — {session.focusArea}
                  </h4>

                  <p className="text-xs text-[#64748B] font-sans flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{session.station}</span>
                  </p>

                  {session.notes && (
                    <p className="text-xs text-[#475569] italic mt-1 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-black/[0.04]">
                      "{session.notes}"
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
          ))
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

              {/* Step 1: Select Coach */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold uppercase font-display text-[#0F172A]">
                    1. Antrenörünüzü Seçiniz
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Nişantaşı stüdyomuzda seansınızı yönetecek uzman koç:
                  </p>

                  <div className="space-y-3">
                    {COACHES_DATA.map((coach) => (
                      <button
                        key={coach.id}
                        type="button"
                        onClick={() => setSelectedCoach(coach)}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                          selectedCoach.id === coach.id
                            ? "border-[#0F172A] bg-[#F8FAFC] shadow-sm"
                            : "border-black/[0.06] bg-white hover:border-black/[0.15]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-black/10 shrink-0 shadow-xs">
                            <img
                              src={coach.image}
                              alt={coach.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#0F172A] block uppercase font-display">
                              {coach.name}
                            </span>
                            <span className="text-xs text-[#2563EB] font-medium block">
                              {coach.title}
                            </span>
                            <span className="text-[11px] text-[#94A3B8] mt-0.5 block">
                              {coach.experience}
                            </span>
                          </div>
                        </div>

                        {selectedCoach.id === coach.id && (
                          <div className="w-6 h-6 rounded-full bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
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
