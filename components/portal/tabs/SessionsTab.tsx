"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Check,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  X,
  LayoutGrid,
  List,
  CalendarPlus,
  MessageCircle,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { downloadIcsFile } from "@/lib/calendar";
import { formatDateLong } from "@/lib/format";
import { todayIso, timeSlotsOverlap, SLOT_REASON_TEXT } from "@/lib/slots";
import {
  ACTIVE_BOOKING_STATUSES,
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_STYLE,
  HEAD_COACH_NAME,
  STUDIO_AREA,
  WORKOUT_TYPES,
  WORKOUT_TYPE_LIST,
  dayKeyFromDate,
  workoutLabel,
  type WorkoutType,
} from "@/lib/training";
import type { BookedSession } from "@/types/portal";

const COACH_AVATAR = "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80";
const DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const SessionsTab: React.FC = () => {
  const {
    remainingSessions,
    bookedSessions,
    program,
    coachSchedules,
    bookSession,
    cancelSession,
    setActiveTab,
    checkSlotAvailability,
  } = useMember();

  const today = todayIso();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState<WorkoutType>("FULL");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [weekOffset, setWeekOffset] = useState(0);

  const showToast = (ok: boolean, text: string) => {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 4500);
  };

  // Admin'in tanımladığı koç takvimindeki tüm saatler (tek kaynak)
  const allSlotTimes = useMemo(() => {
    const times = new Set<string>();
    coachSchedules[0]?.weeklySchedule.forEach((d) => d.slots.forEach((s) => times.add(s.time)));
    return [...times].sort();
  }, [coachSchedules]);

  const slotsForDate = (date: string) => {
    const day = coachSchedules[0]?.weeklySchedule.find((d) => d.dayKey === dayKeyFromDate(date));
    return day ? day.slots.map((s) => s.time) : [];
  };

  const weekDays = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { dateStr: isoOf(d), dayName: DAY_NAMES[i], label: `${d.getDate()} ${MONTHS[d.getMonth()]}` };
    });
  }, [weekOffset]);

  const pickerDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          dateStr: isoOf(d),
          dayName: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cts"][d.getDay()],
          dayNumber: d.getDate(),
          monthName: MONTHS[d.getMonth()],
        };
      }),
    []
  );

  const myVisible = bookedSessions.filter((s) => s.status !== "CANCELLED");
  const sortedList = [...bookedSessions].sort((a, b) => (b.date + b.timeSlot).localeCompare(a.date + a.timeSlot));

  const findMySession = (dateStr: string, slotTime: string) =>
    myVisible.find((s) => s.date === dateStr && timeSlotsOverlap(s.timeSlot, slotTime));

  const openWizard = (date?: string, time?: string) => {
    if (remainingSessions <= 0) {
      if (confirm("Ders hakkınız kalmadı. Yeni paket almak ister misiniz?")) setActiveTab("store");
      return;
    }
    const d = date ?? today;
    setSelectedDate(d);
    setSelectedTime(time ?? "");
    setSelectedType(program.find((p) => p.dayKey === dayKeyFromDate(d))?.type ?? "FULL");
    setNotes("");
    setStep(time ? 3 : 1);
    setWizardOpen(true);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    const res = await bookSession({ date: selectedDate, timeSlot: selectedTime, workoutType: selectedType, memberNote: notes });
    setSubmitting(false);
    if (res.ok) {
      setWizardOpen(false);
      showToast(true, res.message ?? "Randevu talebiniz alındı.");
    } else {
      showToast(false, res.error);
    }
  };

  const handleCancel = async (session: BookedSession) => {
    if (!confirm("Bu seansı iptal etmek istediğinize emin misiniz? Ders hakkınız iade edilecek.")) return;
    const res = await cancelSession(session.id);
    showToast(res.ok, res.ok ? res.message ?? "İptal edildi." : res.error);
  };

  const addToCalendar = (session: BookedSession) =>
    downloadIcsFile({
      title: `Core & Fit: ${workoutLabel(session.workoutType)}`,
      description: `${HEAD_COACH_NAME} ile birebir antrenman.`,
      location: `${STUDIO_AREA}, Nişantaşı, İstanbul`,
      startDate: session.date,
      timeSlot: session.timeSlot,
    });

  return (
    <div className="space-y-6 pb-28 text-[#0F172A]">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 border rounded-2xl shadow-lg flex items-center gap-3 font-medium text-xs ${
              toast.ok ? "bg-[#ECFDF5] border-[#10B981] text-[#065F46]" : "bg-rose-50 border-rose-300 text-rose-800"
            }`}
          >
            {toast.ok ? <Check className="w-5 h-5 text-[#10B981] shrink-0" /> : <X className="w-5 h-5 text-rose-500 shrink-0" />}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-[#10B981] uppercase tracking-wider font-bold block">Randevu ve Ders Takvimi</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] mt-0.5">Seanslarım</h2>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Kalan ders hakkınız: <span className="text-[#10B981] font-bold">{remainingSessions}</span>
          </p>
        </div>
        <button
          onClick={() => openWizard()}
          className="inline-flex items-center justify-center gap-2 min-h-12 px-5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#10B981]" />
          <span>Yeni Seans Ayırt</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 sm:p-4 bg-white border border-black/[0.06] rounded-3xl">
        <div className="flex items-center p-1 bg-[#F1F5F9] rounded-2xl self-start">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "list" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Randevularım ({myVisible.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "calendar" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
            <span>Haftalık Takvim</span>
          </button>
        </div>

        {viewMode === "calendar" && (
          <div className="flex items-center bg-[#F8FAFC] border border-black/[0.06] rounded-2xl p-1 self-start">
            <button type="button" onClick={() => setWeekOffset((p) => p - 1)} className="p-2 hover:bg-white rounded-xl" aria-label="Önceki hafta">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold min-w-[150px] text-center">
              {weekDays[0].label} - {weekDays[6].label}
            </span>
            <button type="button" onClick={() => setWeekOffset((p) => p + 1)} className="p-2 hover:bg-white rounded-xl" aria-label="Sonraki hafta">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {viewMode === "calendar" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-3 sm:p-6 space-y-3">
          <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block font-medium">
            Boş saatlere dokunarak randevu talebi oluşturabilirsiniz
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full border-collapse min-w-[760px] text-left">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-[11px] font-extrabold uppercase text-slate-400 w-20 sticky left-0 bg-slate-900">Saat</th>
                  {weekDays.map((day) => (
                    <th
                      key={day.dateStr}
                      className={`p-3 text-center border-l border-slate-800 ${day.dateStr === today ? "bg-slate-800" : ""}`}
                    >
                      <span className="text-[10px] uppercase text-slate-300 block">{day.dayName}</span>
                      <span className={`text-sm font-black ${day.dateStr === today ? "text-emerald-400" : "text-white"}`}>{day.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] text-xs">
                {allSlotTimes.map((slotTime) => (
                  <tr key={slotTime}>
                    <td className="p-3 font-extrabold bg-slate-50 sticky left-0 border-r border-black/[0.06]">{slotTime.split(" - ")[0]}</td>
                    {weekDays.map((day) => {
                      const mine = findMySession(day.dateStr, slotTime);
                      if (mine) {
                        return (
                          <td key={day.dateStr} className="p-1.5 h-20 align-top">
                            <div className="h-full rounded-xl p-2 bg-[#0F172A] text-white flex flex-col justify-between" data-keep-white>
                              <span className="text-[11px] font-bold leading-tight">{workoutLabel(mine.workoutType)}</span>
                              <span className="text-[9px] font-bold uppercase">{BOOKING_STATUS_LABEL[mine.status]}</span>
                            </div>
                          </td>
                        );
                      }
                      const status = checkSlotAvailability(day.dateStr, slotTime);
                      if (!status.isAvailable) {
                        return (
                          <td key={day.dateStr} className="p-1.5 h-20">
                            <div className="h-full rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-center px-1">
                              <span className="text-[9px] font-semibold text-slate-400">
                                {status.reason === "booked" || status.reason === "blocked"
                                  ? "Dolu"
                                  : status.reason === "day_off"
                                  ? "Kapalı"
                                  : status.reason === "past"
                                  ? "—"
                                  : "Mola"}
                              </span>
                            </div>
                          </td>
                        );
                      }
                      return (
                        <td key={day.dateStr} className="p-1.5 h-20">
                          <button
                            type="button"
                            onClick={() => openWizard(day.dateStr, slotTime)}
                            className="w-full h-full rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300 flex flex-col items-center justify-center gap-0.5 text-emerald-700 transition-all"
                            aria-label={`${day.dayName} ${slotTime} için randevu al`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-semibold">Müsait</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-3">
          {sortedList.length > 0 ? (
            sortedList.map((session) => {
              const isActive = ACTIVE_BOOKING_STATUSES.includes(session.status) && session.date >= today;
              return (
                <div
                  key={session.id}
                  className={`bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    session.status === "CANCELLED" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <img src={COACH_AVATAR} alt={HEAD_COACH_NAME} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#2563EB]">
                          {formatDateLong(session.date)} • {session.timeSlot}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${BOOKING_STATUS_STYLE[session.status]}`}>
                          {BOOKING_STATUS_LABEL[session.status]}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F172A]">
                        {HEAD_COACH_NAME} ile {workoutLabel(session.workoutType)}
                      </h4>
                      <p className="flex items-center gap-1 text-xs text-[#64748B]">
                        <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{STUDIO_AREA}</span>
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-black/[0.06] flex-wrap">
                      <button
                        type="button"
                        onClick={() => addToCalendar(session)}
                        className="min-h-10 px-3 text-xs font-semibold bg-white hover:bg-slate-50 border border-black/[0.08] rounded-xl flex items-center gap-1.5"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Takvime Ekle</span>
                      </button>
                      <a
                        href={`https://wa.me/905318477882?text=${encodeURIComponent(
                          `Merhaba İlker Hocam, ${session.date} ${session.timeSlot} seansımız ile ilgili yazıyorum.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-10 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCancel(session)}
                        className="min-h-10 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        İptal Et
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white border border-black/[0.06] rounded-3xl space-y-3">
              <CalendarIcon className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="text-xs text-[#64748B]">Henüz bir randevunuz yok.</p>
              <button
                onClick={() => openWizard()}
                className="min-h-11 px-5 bg-[#0F172A] text-white font-bold text-xs uppercase rounded-full hover:bg-[#1E293B]"
              >
                Hemen Seans Ayırt
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-7 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto overscroll-contain"
            >
              <button
                onClick={() => setWizardOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5 pr-10">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  <span>Yeni Randevu</span>
                  <span className="text-[#0F172A]">Adım {step} / 3</span>
                </div>
                <div className="grid grid-cols-3 gap-2 h-1.5">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className={`h-full rounded-full ${step >= n ? "bg-[#0F172A]" : "bg-[#F1F5F9]"}`} />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold uppercase font-display">Gün Seçin</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {pickerDays.map((d) => (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.dateStr);
                          setSelectedType(program.find((p) => p.dayKey === dayKeyFromDate(d.dateStr))?.type ?? "FULL");
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          selectedDate === d.dateStr
                            ? "border-[#0F172A] bg-[#0F172A] text-white font-bold"
                            : "border-black/[0.06] bg-[#F8FAFC] hover:border-black/[0.15]"
                        }`}
                      >
                        <span className="text-[10px] block uppercase">{d.dayName}</span>
                        <span className="text-xl font-bold block">{d.dayNumber}</span>
                        <span className="text-[10px] block uppercase">{d.monthName}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="min-h-12 px-6 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-2"
                    >
                      <span>Saat Seçimine Geç</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(1)} className="p-1.5 rounded-full bg-[#F1F5F9]" aria-label="Geri">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-xl font-bold uppercase font-display">Saat Seçin</h3>
                  </div>
                  <p className="text-xs text-[#64748B]">{formatDateLong(selectedDate)}</p>
                  {slotsForDate(selectedDate).length === 0 ? (
                    <p className="text-xs text-[#64748B] p-4 bg-[#F8FAFC] rounded-2xl">Bu gün stüdyo kapalı. Lütfen başka bir gün seçin.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {slotsForDate(selectedDate).map((slot) => {
                        const status = checkSlotAvailability(selectedDate, slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!status.isAvailable}
                            onClick={() => {
                              setSelectedTime(slot);
                              setStep(3);
                            }}
                            title={status.isAvailable ? undefined : SLOT_REASON_TEXT[status.reason]}
                            className={`min-h-12 p-3 rounded-2xl border text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                              !status.isAvailable
                                ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed line-through"
                                : selectedTime === slot
                                ? "border-[#0F172A] bg-[#0F172A] text-white font-bold"
                                : "border-black/[0.06] bg-[#F8FAFC] hover:border-black/[0.15]"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(2)} className="p-1.5 rounded-full bg-[#F1F5F9]" aria-label="Geri">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-xl font-bold uppercase font-display">Antrenman Tipi</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {WORKOUT_TYPE_LIST.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedType(t)}
                        className={`min-h-16 p-2.5 rounded-2xl border text-center transition-all ${
                          selectedType === t
                            ? "border-[#0F172A] bg-[#0F172A] text-white"
                            : "border-black/[0.06] bg-[#F8FAFC] hover:border-black/[0.15]"
                        }`}
                      >
                        <span className="text-sm font-bold block">{WORKOUT_TYPES[t].label}</span>
                        <span className="text-[10px] opacity-70">{WORKOUT_TYPES[t].en}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-[#F8FAFC] border border-black/[0.06] rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="text-[#64748B]">Tarih ve saat</span>
                      <span className="font-bold text-right">
                        {formatDateLong(selectedDate)} • {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Antrenör</span>
                      <span className="font-bold">{HEAD_COACH_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Konum</span>
                      <span className="font-bold">{STUDIO_AREA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Ders hakkından</span>
                      <span className="font-bold">1 ders</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1.5">Koçunuza not (isteğe bağlı)</label>
                    <textarea
                      rows={2}
                      placeholder="Örn: Bugün biraz yorgunum, hafif bir tempo istiyorum."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-black/[0.12] rounded-2xl p-3.5 text-xs focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    Randevunuz önce &quot;Onay Bekliyor&quot; olarak oluşturulur. Stüdyo onayladığında &quot;Onaylandı&quot; olarak güncellenir.
                  </p>

                  <button
                    onClick={handleFinish}
                    disabled={submitting || !selectedTime}
                    className="w-full min-h-12 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] disabled:opacity-50"
                  >
                    {submitting ? "Gönderiliyor..." : "Randevu Talebi Oluştur"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
