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
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-[#162B16] border border-[#25D366] text-white rounded-xl shadow-xl flex items-center gap-3 font-mono text-xs"
          >
            <Check className="w-5 h-5 text-[#25D366] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider font-bold block">
            RANDEVU VE DERS TAKVİMİ
          </span>
          <h2 className="text-2xl font-extrabold uppercase font-display text-white mt-0.5">
            Seanslarım & Randevu Planlama
          </h2>
          <p className="text-xs text-[#A5A7AD] font-mono mt-1">
            Kalan Seans Hakkınız:{" "}
            <span className="text-[#E8FF36] font-bold">{remainingSessions} Seans</span>
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Seans Ayırt</span>
        </button>
      </div>

      {/* Booked Sessions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-mono text-[#A5A7AD] uppercase tracking-wider">
          Planlanmış Aktif Seanslar ({bookedSessions.length})
        </h3>

        {bookedSessions.length > 0 ? (
          bookedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-[#343A46]"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#23272F] shrink-0">
                  <img
                    src={session.coachAvatar}
                    alt={session.coachName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#E8FF36] font-bold uppercase">
                      {session.date} • {session.timeSlot}
                    </span>
                    <span className="px-2 py-0.5 bg-[#25D366]/20 text-[#25D366] text-[9px] font-mono rounded-full font-bold uppercase">
                      {session.status === "confirmed" ? "ONAYLANDI" : "TAMAMLANDI"}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white uppercase font-display mt-0.5">
                    {session.coachName} — {session.focusArea}
                  </h4>

                  <p className="text-xs text-[#72757C] font-mono flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E8FF36]" />
                    {session.station}
                  </p>

                  {session.notes && (
                    <p className="text-[11px] text-[#A5A7AD] italic mt-1 bg-[#131519] px-2 py-1 rounded border border-[#191B20]">
                      "{session.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#191B20]">
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
                  className="px-3 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors uppercase"
                >
                  İptal Et
                </button>
                <div className="px-3 py-2 bg-[#131519] text-[#A5A7AD] border border-[#23272F] rounded-lg text-xs font-mono">
                  1:1 Özel Seans
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-[#0D0F12] border border-[#23272F] rounded-2xl space-y-3">
            <CalendarIcon className="w-10 h-10 text-[#72757C] mx-auto" />
            <p className="text-xs text-[#A5A7AD] font-mono">
              Şu anda planlanmış bir seansınız bulunmuyor.
            </p>
            <button
              onClick={() => setBookingWizardOpen(true)}
              className="px-4 py-2 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase font-mono rounded-lg hover:bg-[#D4EB2B]"
            >
              Hemen Seans Ayırt
            </button>
          </div>
        )}
      </div>

      {/* Interactive Booking Wizard Modal */}
      <AnimatePresence>
        {bookingWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0D0F12] border border-[#23272F] rounded-2xl p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setBookingWizardOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#72757C] hover:text-white rounded-full bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Wizard Steps Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider mb-2">
                  <span>YENİ SEANS REZERVASYONU</span>
                  <span>ADIM {step} / 4</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5 bg-[#191B20] rounded-full overflow-hidden">
                  <div className={`h-full ${step >= 1 ? "bg-[#E8FF36]" : "bg-transparent"}`} />
                  <div className={`h-full ${step >= 2 ? "bg-[#E8FF36]" : "bg-transparent"}`} />
                  <div className={`h-full ${step >= 3 ? "bg-[#E8FF36]" : "bg-transparent"}`} />
                  <div className={`h-full ${step >= 4 ? "bg-[#E8FF36]" : "bg-transparent"}`} />
                </div>
              </div>

              {/* Step 1: Select Coach */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase font-display text-white">
                    1. Antrenörünüzü Seçiniz
                  </h3>
                  <p className="text-xs text-[#A5A7AD] font-mono">
                    Nişantaşı stüdyomuzda seansınızı yönetecek uzman koç:
                  </p>

                  <div className="space-y-2.5">
                    {COACHES_DATA.map((coach) => (
                      <button
                        key={coach.id}
                        type="button"
                        onClick={() => setSelectedCoach(coach)}
                        className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                          selectedCoach.id === coach.id
                            ? "border-[#E8FF36] bg-[#E8FF36]/10 text-white"
                            : "border-[#23272F] bg-[#131519] text-[#A5A7AD] hover:border-[#343A46]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#23272F] shrink-0">
                            <img
                              src={coach.image}
                              alt={coach.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block uppercase">
                              {coach.name}
                            </span>
                            <span className="text-xs text-[#E8FF36] font-mono block">
                              {coach.title}
                            </span>
                            <span className="text-[10px] text-[#72757C] font-mono">
                              {coach.experience}
                            </span>
                          </div>
                        </div>

                        {selectedCoach.id === coach.id && (
                          <Check className="w-5 h-5 text-[#E8FF36] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] flex items-center gap-2"
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
                      className="p-1.5 text-[#72757C] hover:text-white rounded bg-white/5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-lg font-bold uppercase font-display text-white">
                      2. Antrenman Gününü Seçiniz
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {days.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedDate === d.dateStr
                            ? "border-[#E8FF36] bg-[#E8FF36] text-[#08090B] font-bold shadow-md"
                            : "border-[#23272F] bg-[#131519] text-white hover:border-[#343A46]"
                        }`}
                      >
                        <span className="text-[11px] font-mono block uppercase">
                          {d.dayName}
                        </span>
                        <span className="text-xl font-bold font-display block my-1">
                          {d.dayNumber}
                        </span>
                        <span className="text-[10px] font-mono block uppercase">
                          {d.monthName}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-xs font-mono text-[#A5A7AD] hover:text-white uppercase"
                    >
                      Geri
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] flex items-center gap-2"
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
                      className="p-1.5 text-[#72757C] hover:text-white rounded bg-white/5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-lg font-bold uppercase font-display text-white">
                      3. Seans Saatini Seçiniz
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {TIME_SLOTS.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-3 rounded-xl border font-mono text-xs text-center transition-all ${
                          selectedTime === slot
                            ? "border-[#E8FF36] bg-[#E8FF36] text-[#08090B] font-bold shadow-md"
                            : "border-[#23272F] bg-[#131519] text-white hover:border-[#343A46]"
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
                      className="px-4 py-2 text-xs font-mono text-[#A5A7AD] hover:text-white uppercase"
                    >
                      Geri
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="px-6 py-2.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] flex items-center gap-2"
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
                      className="p-1.5 text-[#72757C] hover:text-white rounded bg-white/5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-lg font-bold uppercase font-display text-white">
                      4. Seans Odağı & Onay
                    </h3>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-[#131519] border border-[#23272F] rounded-xl space-y-2 font-mono text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#72757C]">Seçilen Koç:</span>
                      <span className="font-bold text-white">{selectedCoach.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#72757C]">Tarih & Saat:</span>
                      <span className="font-bold text-[#E8FF36]">
                        {selectedDate} • {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#72757C]">Düşülecek Hak:</span>
                      <span className="font-bold text-white">1 Seans</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#72757C] uppercase block mb-1.5">
                      SEANS ODAK ALANI
                    </label>
                    <select
                      value={selectedFocus}
                      onChange={(e) => setSelectedFocus(e.target.value)}
                      className="w-full bg-[#131519] border border-[#23272F] rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#E8FF36]"
                    >
                      {FOCUS_AREAS.map((f, i) => (
                        <option key={i} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#72757C] uppercase block mb-1.5">
                      KOÇUNUZA NOT (İSTEĞE BAĞLI)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Örn: Bugün alt gövde veya deadlift PR çalışmak istiyorum..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#131519] border border-[#23272F] rounded-xl p-3 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 py-2 text-xs font-mono text-[#A5A7AD] hover:text-white uppercase"
                    >
                      Geri
                    </button>
                    <button
                      onClick={handleFinishBooking}
                      className="px-8 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] shadow-[0_0_20px_rgba(232,255,54,0.2)]"
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
