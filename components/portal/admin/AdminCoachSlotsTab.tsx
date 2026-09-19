"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  CalendarDays,
  Check,
  Coffee,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { COACHES_DATA } from "@/data/coaches";

const DAYS_META: { key: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz"; name: string; short: string }[] = [
  { key: "pzt", name: "Pazartesi", short: "Pzt" },
  { key: "sal", name: "Salı", short: "Sal" },
  { key: "car", name: "Çarşamba", short: "Çar" },
  { key: "per", name: "Perşembe", short: "Per" },
  { key: "cum", name: "Cuma", short: "Cum" },
  { key: "cts", name: "Cumartesi", short: "Cts" },
  { key: "paz", name: "Pazar", short: "Paz" },
];

export const AdminCoachSlotsTab: React.FC = () => {
  const {
    coachSchedules,
    updateCoachDayStatus,
    toggleCoachSlotAvailability,
    addCoachSlot,
    removeCoachSlot,
    copyCoachScheduleToWeekdays,
    checkSlotAvailability,
    toggleCoachSlotForDate,
    coachBlockedDateSlots,
  } = useMember();

  const [selectedCoachId, setSelectedCoachId] = useState<string>("coach-1");
  const [selectedDayKey, setSelectedDayKey] = useState<"pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz">("pzt");
  const [viewMode, setViewMode] = useState<"matrix" | "day_detail">("matrix");
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // New slot modal / inline
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState("");
  const [newSlotLabel, setNewSlotLabel] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find active coach profile
  const currentCoachProfile = coachSchedules.find((c) => c.coachId === selectedCoachId) || coachSchedules[0];
  const currentDaySchedule = currentCoachProfile?.weeklySchedule.find((d) => d.dayKey === selectedDayKey);
  const currentCoachMeta = COACHES_DATA.find((c) => c.id === selectedCoachId) || COACHES_DATA[0];

  // Compute 7 days of the selected week (Monday -> Sunday)
  const weekDays = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday + weekOffset * 7);

    const dayKeys: ("pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz")[] = [
      "pzt", "sal", "car", "per", "cum", "cts", "paz"
    ];
    const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const shortNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];
    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    const monthShorts = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const year = current.getFullYear();
      const month = current.getMonth();
      const dayNum = current.getDate();
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

      days.push({
        key: dayKeys[i],
        name: dayNames[i],
        short: shortNames[i],
        dateStr,
        dayNumber: dayNum,
        monthShort: monthShorts[month],
        monthName: monthNames[month],
        year,
        displayDate: `${dayNum} ${monthShorts[month]}`,
        fullText: `${dayNum} ${monthNames[month]} ${year} ${dayNames[i]}`,
        isToday: dateStr === todayStr,
      });
    }
    return days;
  }, [weekOffset]);

  const weekTitle = useMemo(() => {
    if (weekDays.length < 7) return "";
    const first = weekDays[0];
    const last = weekDays[6];
    if (first.monthName === last.monthName) {
      return `${first.dayNumber} - ${last.dayNumber} ${first.monthName} ${first.year}`;
    }
    return `${first.dayNumber} ${first.monthShort} - ${last.dayNumber} ${last.monthShort} ${last.year}`;
  }, [weekDays]);

  const handleToggleSlot = (dayKey: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz", slotId: string) => {
    toggleCoachSlotAvailability(selectedCoachId, dayKey, slotId);
    setToastMessage("Slot randevu durumu güncellendi.");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleToggleDateSlot = (dateStr: string, timeSlot: string, dayText: string) => {
    toggleCoachSlotForDate(dateStr, timeSlot);
    const prevStatus = checkSlotAvailability(dateStr, timeSlot);
    if (prevStatus.isAvailable) {
      setToastMessage(`${dayText} saat ${timeSlot} DOLU / BLOKELİ yapıldı. Müşteriler randevu alırken bu saati DOLU görecek.`);
    } else {
      setToastMessage(`${dayText} saat ${timeSlot} tekrar randevuya açıldı.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDayWorking = (dayKey: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz", working: boolean) => {
    updateCoachDayStatus(selectedCoachId, dayKey, working);
    setToastMessage(working ? "Gün randevuya açıldı." : "Gün dinlenme/izinli gününe alındı.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddNewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) return;

    addCoachSlot(selectedCoachId, selectedDayKey, newSlotTime.trim(), newSlotLabel.trim() || undefined);
    setNewSlotTime("");
    setNewSlotLabel("");
    setIsAddingSlot(false);
    setToastMessage("Yeni seans saati eklendi.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyWeekdays = () => {
    copyCoachScheduleToWeekdays(selectedCoachId, selectedDayKey);
    setToastMessage(`${currentDaySchedule?.dayName} programı tüm hafta içi günlerine (Pzt-Cum) başarıyla kopyalandı.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Collect all unique time slot strings across the week for the calendar table
  const allTimeSlotStrings = useMemo(() => {
    const set = new Set<string>();
    currentCoachProfile?.weeklySchedule.forEach((day) => {
      day.slots.forEach((s) => set.add(s.time));
    });
    return Array.from(set);
  }, [currentCoachProfile]);

  // Total available slots count
  const totalAvailableSlots = useMemo(() => {
    let count = 0;
    currentCoachProfile?.weeklySchedule.forEach((day) => {
      if (day.isWorkingDay) {
        day.slots.forEach((s) => {
          if (s.isAvailable) count++;
        });
      }
    });
    return count;
  }, [currentCoachProfile]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Coach Switcher Card */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>KOÇ ÇALIŞMA SAATLERİ & MÜSAİTLİK ÇİZELGESİ</span>
              </span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl uppercase text-[#0F172A] font-display">
              İlker Yüksel Müsaitlik & Randevu Saatleri
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Haftanın 7 günü için koçun randevuya açık saatlerini, mola aralıklarını ve tatil günlerini takvim tablosunda yönetin.
            </p>
          </div>

          {/* View Switcher: Haftalık Takvim Tablosu vs Günlük Detay */}
          <div className="flex items-center p-1 bg-[#F1F5F9] rounded-2xl border border-black/[0.04]">
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "matrix"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
              <span>Haftalık Takvim Tablosu</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("day_detail")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "day_detail"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
              <span>Günlük Detay Düzenle</span>
            </button>
          </div>
        </div>

        {/* Solo Coach Profile Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#1E293B] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentCoachMeta.image}
              alt={currentCoachMeta.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base text-white">
                  {currentCoachMeta.name}
                </h4>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-[10px] font-bold">
                  ● Kurucu & Baş Antrenör (1:1 Solo)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentCoachMeta.title} • {currentCoachMeta.experience}
              </p>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Nişantaşı Private Studio seansları ve haftalık randevu takvimi
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
            <div className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Haftalık <strong>{totalAvailableSlots} Müsait Slot</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-xs font-semibold text-white border border-white/10">
              <span>Seans: <strong>{currentCoachProfile?.sessionDurationMin || 60} Dk</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: HAFTALIK MÜSAİTLİK TAKVİM TABLOSU (WEEKLY AVAILABILITY MATRIX)    */}
      {/* ========================================================================= */}
      {viewMode === "matrix" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>TARİH ENTEGRELİ CANLI TAKVİM</span>
                </span>
                <span className="text-xs font-semibold text-slate-500">• {weekTitle}</span>
              </div>
              <h4 className="font-bold text-base text-[#0F172A] uppercase font-display">
                7 Günlük Müsaitlik Matrisi & Takvim Tablosu
              </h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                Danışan rezervasyonları (Örn: Deniz Aydın) ve koç blokajları tarihe bağlı olarak canlı yansır. Slotlara tıklayarak o tarihi müşterilere kapatabilir veya açabilirsiniz.
              </p>
            </div>

            {/* Week Navigation Controls */}
            <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
              <div className="flex items-center bg-[#F1F5F9] rounded-2xl p-1 border border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="p-1.5 hover:bg-white text-[#0F172A] rounded-xl transition-all active:scale-95"
                  title="Önceki Hafta"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-3 text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{weekTitle}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="p-1.5 hover:bg-white text-[#0F172A] rounded-xl transition-all active:scale-95"
                  title="Sonraki Hafta"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {weekOffset !== 0 && (
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  Bugüne Dön
                </button>
              )}
            </div>
          </div>

          {/* Quick Helper Callouts / Status Legend */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200/60 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Yeşil = Müsait (Açık)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-900 rounded-xl border border-blue-200/60 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Mavi = DOLU (Rezerve Seans)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-900 rounded-xl border border-rose-200/60 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Kırmızı = DOLU (Koç Bloke)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl text-[11px]">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Gri = Mola / İzinli Gün</span>
            </span>
          </div>

          {/* Table Matrix Container */}
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] shadow-2xs">
            <table className="w-full border-collapse min-w-[920px] text-left">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800">
                  <th className="p-3.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 w-28 sticky left-0 z-20 bg-slate-900 border-r border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SAAT</span>
                    </div>
                  </th>

                  {weekDays.map((day) => {
                    const daySchedule = currentCoachProfile?.weeklySchedule.find((d) => d.dayKey === day.key);
                    const isWorking = daySchedule?.isWorkingDay ?? true;

                    return (
                      <th
                        key={day.dateStr}
                        className={`p-3 text-center border-r border-slate-800 last:border-r-0 ${
                          day.isToday ? "bg-slate-800/90" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                            {day.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-sm font-black font-display ${
                                day.isToday ? "text-emerald-400" : "text-white"
                              }`}
                            >
                              {day.displayDate}
                            </span>
                            {day.isToday && (
                              <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider">
                                BUGÜN
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleDayWorking(day.key, !isWorking)}
                            className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                              isWorking
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
                                : "bg-rose-500/20 text-rose-300 border border-rose-400/30 hover:bg-rose-500/30"
                            }`}
                            title="Günün çalışma durumunu aç/kapat"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isWorking ? "bg-emerald-400" : "bg-rose-400"}`} />
                            <span>{isWorking ? "Açık" : "İzinli"}</span>
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-black/[0.06] text-xs font-sans">
                {allTimeSlotStrings.map((timeStr) => (
                  <tr key={timeStr} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-3 font-bold text-[#0F172A] whitespace-nowrap bg-slate-50/80 sticky left-0 z-10 border-r border-black/[0.06] group-hover:bg-slate-100/80">
                      <span className="text-xs font-extrabold tracking-tight">{timeStr}</span>
                    </td>

                    {weekDays.map((day) => {
                      const daySchedule = currentCoachProfile?.weeklySchedule.find((d) => d.dayKey === day.key);
                      const isWorking = daySchedule?.isWorkingDay ?? true;
                      const slot = daySchedule?.slots.find((s) => s.time === timeStr);

                      if (!isWorking) {
                        return (
                          <td
                            key={`${day.dateStr}-${timeStr}`}
                            className="p-2 border-r border-black/[0.04] last:border-r-0 text-center bg-slate-50/70"
                          >
                            <span className="text-[10px] text-slate-400 font-semibold italic">İzinli Gün</span>
                          </td>
                        );
                      }

                      // Check date-integrated slot availability
                      const slotStatus = checkSlotAvailability(day.dateStr, timeStr);

                      // 1. Randevulu seans (Örn: Deniz Aydın, 21 Eylül Pazartesi 09:30)
                      if (!slotStatus.isAvailable && slotStatus.reason === "booked") {
                        const bookedSess = slotStatus.session;
                        return (
                          <td
                            key={`${day.dateStr}-${timeStr}`}
                            className="p-1.5 border-r border-black/[0.04] last:border-r-0 align-middle"
                          >
                            <div className="w-full p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-950 flex flex-col justify-between gap-1 shadow-2xs">
                              <div className="flex items-center justify-between gap-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-tight">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                  DOLU
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 text-blue-800 font-bold rounded">
                                  1:1 Seans
                                </span>
                              </div>
                              <div className="text-[11px] font-bold text-slate-900 truncate" title={bookedSess?.memberName}>
                                {bookedSess?.memberName || "Danışan Randevusu"}
                              </div>
                              <div className="text-[9px] text-blue-700/90 truncate font-medium">
                                {bookedSess?.focusArea?.split("&")[0] || "Özel Seans"}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // 2. Koç tarafından o spesifik tarihe özel kapatılmış slot
                      if (!slotStatus.isAvailable && slotStatus.reason === "blocked") {
                        return (
                          <td
                            key={`${day.dateStr}-${timeStr}`}
                            className="p-1.5 border-r border-black/[0.04] last:border-r-0 align-middle"
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleDateSlot(day.dateStr, timeStr, day.fullText)}
                              className="w-full p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-950 flex flex-col items-center justify-center gap-1 transition-all group/btn shadow-2xs"
                              title="Bu slot bu tarihte DOLU / BLOKELİ. Tıklayarak randevuya açabilirsiniz."
                            >
                              <div className="flex items-center gap-1 text-[10px] font-black text-rose-700 uppercase">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                ⛔ DOLU / BLOKE
                              </div>
                              <span className="text-[9px] font-semibold text-rose-600 group-hover/btn:underline">
                                Tıkla: Müsait Yap
                              </span>
                            </button>
                          </td>
                        );
                      }

                      // 3. Genel haftalık mola
                      if (!slotStatus.isAvailable && slotStatus.reason === "break") {
                        return (
                          <td
                            key={`${day.dateStr}-${timeStr}`}
                            className="p-1.5 border-r border-black/[0.04] last:border-r-0 align-middle"
                          >
                            <button
                              type="button"
                              onClick={() => slot && handleToggleSlot(day.key, slot.id)}
                              className="w-full p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex flex-col items-center justify-center gap-0.5 transition-all"
                              title="Genel haftalık mola saati. Tıklayarak genel plana açabilirsiniz."
                            >
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Mola / Kapalı
                              </div>
                              <span className="text-[9px] text-slate-500 truncate max-w-[80px]">
                                {slot?.label || "Haftalık Mola"}
                              </span>
                            </button>
                          </td>
                        );
                      }

                      // 4. Müsait Slot (Açık) -> Tıklanınca o tarihte DOLU yapılır
                      return (
                        <td
                          key={`${day.dateStr}-${timeStr}`}
                          className="p-1.5 border-r border-black/[0.04] last:border-r-0 align-middle"
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleDateSlot(day.dateStr, timeStr, day.fullText)}
                            className="w-full p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300 text-emerald-950 flex flex-col items-center justify-center gap-1 transition-all group/btn shadow-2xs active:scale-95"
                            title="Slot randevuya MÜSAİT. Tıklayarak bu tarihi müşterilere DOLU / BLOKELİ yapabilirsiniz."
                          >
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-800">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              ✓ Müsait (Açık)
                            </div>
                            <span className="text-[9px] font-semibold text-emerald-700 group-hover/btn:text-rose-700 group-hover/btn:underline">
                              Tıkla: Dolu Yap
                            </span>
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

      {/* ========================================================================= */}
      {/* MODE 2: GÜNLÜK DETAY DÜZENLEME (SINGLE DAY PILLS + SLOT CARDS)             */}
      {/* ========================================================================= */}
      {viewMode === "day_detail" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
            {/* Day Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {DAYS_META.map((d) => {
                const isSelected = selectedDayKey === d.key;
                const dayData = currentCoachProfile?.weeklySchedule.find((s) => s.dayKey === d.key);
                const isWorking = dayData?.isWorkingDay ?? true;

                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDayKey(d.key)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#0F172A] text-white shadow-sm"
                        : "bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] border border-black/[0.04]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isWorking ? "bg-emerald-400" : "bg-slate-300"
                      }`}
                    />
                    <span>{d.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Copy to Weekdays Button */}
            <button
              type="button"
              onClick={handleCopyWeekdays}
              className="px-3.5 py-2 bg-[#F1F5F9] hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
              title="Bu günün saat ayarlarını tüm hafta içine kopyala"
            >
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Hafta İçi Günlerine Kopyala</span>
            </button>
          </div>

          {/* Selected Day Status Bar */}
          <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#0F172A]">
                  {currentCoachMeta.name} • {currentDaySchedule?.dayName} Programı
                </h4>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    currentDaySchedule?.isWorkingDay
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {currentDaySchedule?.isWorkingDay ? "Randevuya Açık" : "İzinli Gün"}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Slot kartlarına tıklayarak seansları randevuya açabilir veya mola/kapalı duruma getirebilirsiniz.
              </p>
            </div>

            {/* Working Toggle Switch */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="text-xs font-semibold text-[#0F172A]">
                {currentDaySchedule?.isWorkingDay ? "Çalışıyor" : "İzinli"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentDaySchedule?.isWorkingDay ?? true}
                  onChange={(e) => handleToggleDayWorking(selectedDayKey, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Add custom slot button / inline form */}
          <div className="flex items-center justify-between">
            <div className="font-bold text-xs uppercase text-[#0F172A]">
              Saat Aralıkları & Mola Planı ({currentDaySchedule?.slots.length || 0} Slot)
            </div>

            <button
              type="button"
              onClick={() => setIsAddingSlot(!isAddingSlot)}
              className="px-3 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Yeni Saat Aralığı Ekle</span>
            </button>
          </div>

          {/* Inline Slot Adder */}
          {isAddingSlot && (
            <form
              onSubmit={handleAddNewSlot}
              className="p-4 bg-slate-50 border border-black/[0.08] rounded-2xl flex flex-col sm:flex-row items-end gap-3 text-xs"
            >
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  Saat Aralığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 12:30 - 13:30 veya 21:00"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  Etiket / Açıklama (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: VIP Slot, Mola vb."
                  value={newSlotLabel}
                  onChange={(e) => setNewSlotLabel(e.target.value)}
                  className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              <div className="flex items-center gap-2 self-end">
                <button
                  type="button"
                  onClick={() => setIsAddingSlot(false)}
                  className="px-3 py-2 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors"
                >
                  Ekle
                </button>
              </div>
            </form>
          )}

          {/* Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentDaySchedule?.slots.map((slot) => {
              const isAvail = slot.isAvailable && (currentDaySchedule.isWorkingDay ?? true);
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isAvail
                      ? "bg-white border-black/[0.08] hover:border-emerald-500 shadow-2xs"
                      : "bg-slate-50 border-black/[0.04] opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`w-4 h-4 ${
                            isAvail ? "text-emerald-600" : "text-[#94A3B8]"
                          }`}
                        />
                        <span className="font-bold text-sm text-[#0F172A]">
                          {slot.time}
                        </span>
                      </div>
                      {slot.label && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-[#64748B] text-[10px] font-semibold rounded-md">
                          {slot.label}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCoachSlot(selectedCoachId, selectedDayKey, slot.id)}
                      className="text-[#94A3B8] hover:text-rose-600 p-1 transition-colors"
                      title="Bu slotu kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Click to toggle status */}
                  <button
                    type="button"
                    onClick={() => handleToggleSlot(selectedDayKey, slot.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isAvail
                        ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvail ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    <span>
                      {isAvail ? "✓ Randevuya Açık (Müsait)" : "⛔ Kapalı / Mola / Blokeli"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
