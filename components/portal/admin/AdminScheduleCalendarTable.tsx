"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  MessageSquare,
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldCheck,
  LayoutGrid,
  List,
  CalendarDays,
  Dumbbell,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { BookedSession, StudioMemberCRM } from "@/types/portal";

interface AdminScheduleCalendarTableProps {
  bookedSessions: BookedSession[];
  onOpenCreateSession: (date?: string, timeSlot?: string) => void;
  onOpenWhatsApp: (
    name: string,
    phone: string,
    sessionInfo?: { date: string; timeSlot: string; focusArea?: string }
  ) => void;
  onOpenSessionAction: (session: BookedSession) => void;
  onCompleteSession: (session: BookedSession) => void;
  onOpenMemberDetail?: (member: StudioMemberCRM) => void;
  onNavigateToCoachSlots?: () => void;
}

// 9 standard studio time slots
const TIME_SLOTS = [
  { time: "08:00 - 09:00", label: "08:00", isBreak: false },
  { time: "09:30 - 10:30", label: "09:30", isBreak: false },
  { time: "11:00 - 12:00", label: "11:00", isBreak: false },
  { time: "13:00 - 14:00", label: "13:00", isBreak: true, breakTitle: "Öğle Arası & Dezenfeksiyon" },
  { time: "14:30 - 15:30", label: "14:30", isBreak: false },
  { time: "16:00 - 17:00", label: "16:00", isBreak: false },
  { time: "17:30 - 18:30", label: "17:30", isBreak: false },
  { time: "19:00 - 20:00", label: "19:00", isBreak: false },
  { time: "20:30 - 21:30", label: "20:30", isBreak: false },
];

export const AdminScheduleCalendarTable: React.FC<AdminScheduleCalendarTableProps> = ({
  bookedSessions,
  onOpenCreateSession,
  onOpenWhatsApp,
  onOpenSessionAction,
  onCompleteSession,
  onOpenMemberDetail,
  onNavigateToCoachSlots,
}) => {
  // Calendar View Mode: weekly calendar table vs day timeline vs classic list
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "list">("table");

  // Week offset: 0 = current week, -1 = last week, +1 = next week
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // For timeline view: selected single day
  const [selectedTimelineDayIndex, setSelectedTimelineDayIndex] = useState<number>(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "completed">("all");

  // Hovered / selected session for popover / preview
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

  // Today ISO string (e.g. "2026-09-19")
  const todayIso = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  // Compute 7 days of the selected week (Monday -> Sunday)
  const weekDays = useMemo(() => {
    const now = new Date();
    // Move to Monday of current week
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ...
    const diffToMonday = (dayOfWeek + 6) % 7; // days to subtract to get to Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday + weekOffset * 7);

    const days = [];
    const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const shortNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];
    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const dateStr = current.toISOString().split("T")[0];
      const isToday = dateStr === todayIso;

      days.push({
        dateStr,
        dayName: dayNames[i],
        shortName: shortNames[i],
        dayNumber: current.getDate(),
        monthName: monthNames[current.getMonth()],
        monthShort: monthNames[current.getMonth()].slice(0, 3),
        year: current.getFullYear(),
        isToday,
        isWeekend: i >= 5,
      });
    }
    return days;
  }, [weekOffset, todayIso]);

  // Week Title (e.g. "14 - 20 Eylül 2026" or "21 - 27 Eylül 2026")
  const weekTitle = useMemo(() => {
    if (weekDays.length < 7) return "";
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.monthName === end.monthName) {
      return `${start.dayNumber} - ${end.dayNumber} ${start.monthName} ${start.year}`;
    }
    return `${start.dayNumber} ${start.monthShort} - ${end.dayNumber} ${end.monthShort} ${end.year}`;
  }, [weekDays]);

  // Helper to find session matching day & time slot
  const findSessionForSlot = (dateStr: string, slotTime: string): BookedSession | undefined => {
    const slotStart = slotTime.split(" ")[0].trim(); // e.g. "08:00"

    return bookedSessions.find((sess) => {
      // Must match date
      if (sess.date !== dateStr) return false;

      // Status filter
      if (statusFilter !== "all" && sess.status !== statusFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const memberName = (sess.memberName || "").toLowerCase();
        const memberNo = (sess.memberNo || "").toLowerCase();
        const focus = (sess.focusArea || "").toLowerCase();
        if (!memberName.includes(query) && !memberNo.includes(query) && !focus.includes(query)) {
          return false;
        }
      }

      // Time match (exact or start matching)
      const sessStart = sess.timeSlot.split(" ")[0].trim();
      return (
        sess.timeSlot === slotTime ||
        sess.timeSlot.startsWith(slotStart) ||
        sessStart === slotStart ||
        slotTime.includes(sess.timeSlot)
      );
    });
  };

  // Occupancy statistics for current week
  const weekStats = useMemo(() => {
    const weekDateStrings = new Set(weekDays.map((d) => d.dateStr));
    const sessionsThisWeek = bookedSessions.filter((s) => weekDateStrings.has(s.date));
    const confirmedCount = sessionsThisWeek.filter((s) => s.status === "confirmed").length;
    const completedCount = sessionsThisWeek.filter((s) => s.status === "completed").length;
    // Total workable slots (7 days * 8 slots - weekends lighter)
    const maxCapacity = 7 * 8;
    const occupancyPercent = Math.min(100, Math.round((sessionsThisWeek.length / maxCapacity) * 100));

    return {
      total: sessionsThisWeek.length,
      confirmed: confirmedCount,
      completed: completedCount,
      occupancyPercent,
    };
  }, [bookedSessions, weekDays]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Bar */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-black/[0.05] pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>1:1 SOLO BUTİK STÜDYO ÇİZELGESİ</span>
              </span>
              <span className="px-2.5 py-0.5 bg-slate-100 text-[#0F172A] rounded-full text-[10px] font-semibold">
                Kurucu Baş Antrenör: <strong>İlker Yüksel</strong>
              </span>
            </div>
            <h3 className="font-bold text-xl sm:text-2xl uppercase font-display text-[#0F172A] tracking-tight">
              Seans Programı & Takvim Tablosu
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Tüm randevuları haftalık ve günlük takvim tablosunda canlı izleyin, boş saatlere anında yeni randevu atayın.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenCreateSession()}
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>+ Yeni Seans Planla</span>
            </button>

            {onNavigateToCoachSlots && (
              <button
                type="button"
                onClick={onNavigateToCoachSlots}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Antrenörün müsaitlik saatlerini ve mola düzenini ayarla"
              >
                <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Müsaitlik & Mola Ayarları</span>
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: Navigation, View Modes & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Week Navigator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F8FAFC] border border-black/[0.06] rounded-2xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="p-2 hover:bg-white text-[#0F172A] rounded-xl transition-all active:scale-95"
                title="Önceki Hafta"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3.5 py-1 text-center min-w-[190px]">
                <span className="text-xs font-bold text-[#0F172A] block leading-tight font-sans">
                  {weekTitle}
                </span>
                {weekOffset === 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    ● BU HAFTA
                  </span>
                )}
                {weekOffset !== 0 && (
                  <span className="text-[10px] text-[#64748B] font-semibold">
                    {weekOffset > 0 ? `+${weekOffset} Hafta Sonra` : `${Math.abs(weekOffset)} Hafta Önce`}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="p-2 hover:bg-white text-[#0F172A] rounded-xl transition-all active:scale-95"
                title="Sonraki Hafta"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-xl text-xs font-bold transition-colors active:scale-95"
              >
                Bugüne Dön
              </button>
            )}
          </div>

          {/* View Mode Switcher: Takvim Tablosu / Günlük Çizelge / Liste */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-[#F1F5F9] rounded-2xl border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#0F172A] shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
                <span>Haftalık Takvim</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "timeline"
                    ? "bg-white text-[#0F172A] shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                <span>Günlük Çizelge</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-white text-[#0F172A] shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <List className="w-3.5 h-3.5 text-slate-600" />
                <span>Liste</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar & Occupancy Chips */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-black/[0.04]">
          {/* Search & Status Filters */}
          <div className="flex items-center gap-2.5 flex-wrap flex-1">
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Danışan, üye no veya hedef ara..."
                className="w-full pl-9 pr-3.5 py-2 bg-[#F8FAFC] border border-black/[0.06] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#64748B] hover:text-black font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-black/[0.04]">
              {(["all", "confirmed", "completed"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? "bg-white text-[#0F172A] shadow-2xs font-bold"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {st === "all" ? "Tüm Durumlar" : st === "confirmed" ? "Onaylı 1:1" : "Tamamlandı"}
                </button>
              ))}
            </div>
          </div>

          {/* Mini Stats Chips */}
          <div className="flex items-center gap-2 text-xs font-semibold shrink-0 flex-wrap">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/60 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Haftalık: <strong>{weekStats.total} Seans</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200/60 rounded-xl">
              <span>{weekStats.confirmed} Onaylı</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl">
              <span>{weekStats.completed} Tamamlandı</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: HAFTALIK TAKVİM TABLOSU (WEEKLY CALENDAR TABLE GRID)              */}
      {/* ========================================================================= */}
      {viewMode === "table" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Haftalık Seans Dağılım Tablosu (Pzt - Paz)
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Boş kutucuğa tıklayarak hızlı seans ekleyin
              </span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              Toplam <strong>{TIME_SLOTS.length} Saat Aralığı</strong> × 7 Gün
            </div>
          </div>

          {/* Calendar Table Container with smooth horizontal scroll */}
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] shadow-2xs">
            <table className="w-full border-collapse min-w-[960px] text-left">
              {/* Header Row: Days of Week */}
              <thead>
                <tr className="bg-slate-900 text-white border-b border-black/[0.1]">
                  {/* Left-top Corner: Time Label */}
                  <th className="p-3.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 w-24 sticky left-0 z-20 bg-slate-900 border-r border-slate-800">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SAAT</span>
                    </div>
                  </th>

                  {/* 7 Days Columns */}
                  {weekDays.map((day) => (
                    <th
                      key={day.dateStr}
                      className={`p-3.5 text-center transition-colors border-r border-slate-800 last:border-r-0 ${
                        day.isToday ? "bg-slate-800/90" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                          {day.dayName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-sm font-black font-display ${
                              day.isToday ? "text-emerald-400" : "text-white"
                            }`}
                          >
                            {day.dayNumber} {day.monthShort}
                          </span>
                          {day.isToday && (
                            <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider shadow-2xs">
                              BUGÜN
                            </span>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body: Time Slot Rows */}
              <tbody className="divide-y divide-black/[0.06] text-xs font-sans">
                {TIME_SLOTS.map((slot) => {
                  return (
                    <tr key={slot.time} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Left Column: Time Slot */}
                      <td className="p-3 font-bold text-[#0F172A] whitespace-nowrap bg-slate-50/80 sticky left-0 z-10 border-r border-black/[0.06] group-hover:bg-slate-100/80">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold tracking-tight">{slot.label}</span>
                          <span className="text-[10px] font-semibold text-[#64748B]">
                            {slot.time.split(" - ")[1] || ""}
                          </span>
                        </div>
                      </td>

                      {/* 7 Day Cells */}
                      {weekDays.map((day) => {
                        const session = findSessionForSlot(day.dateStr, slot.time);

                        return (
                          <td
                            key={`${day.dateStr}-${slot.time}`}
                            className={`p-2 border-r border-black/[0.04] last:border-r-0 align-top transition-all h-28 relative ${
                              day.isToday ? "bg-emerald-500/[0.02]" : ""
                            }`}
                          >
                            {/* CASE 1: Booked Session Exists */}
                            {session ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`h-full rounded-xl p-2.5 flex flex-col justify-between transition-all border shadow-xs select-none ${
                                  session.status === "completed"
                                    ? "bg-slate-100/90 border-slate-200 text-[#0F172A]"
                                    : "bg-gradient-to-br from-white to-emerald-50/40 border-emerald-200/80 text-[#0F172A] hover:shadow-md hover:border-emerald-400"
                                }`}
                              >
                                <div className="space-y-1">
                                  {/* Member Name & Status */}
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[9px] flex items-center justify-center shrink-0">
                                        {(session.memberName || "Ege Mert")
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </div>
                                      <span className="font-black text-xs text-[#0F172A] truncate">
                                        {session.memberName || "Ege Mert"}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 uppercase ${
                                        session.status === "completed"
                                          ? "bg-slate-200 text-slate-700"
                                          : "bg-emerald-100 text-emerald-800"
                                      }`}
                                    >
                                      {session.status === "completed" ? "Bitti" : "1:1"}
                                    </span>
                                  </div>

                                  {/* Focus Pill */}
                                  <div className="text-[10px] text-[#475569] font-medium truncate">
                                    {session.focusArea.split(" ")[0]} {session.focusArea.split(" ")[1] || ""}
                                  </div>

                                  {/* Station Pill */}
                                  <div className="text-[9px] text-blue-700 font-semibold truncate bg-blue-50/80 px-1 rounded inline-block">
                                    {session.station ? session.station.split("(")[0] : "İstasyon A"}
                                  </div>
                                </div>

                                {/* Quick Action Trigger Icons on Hover */}
                                <div className="flex items-center justify-end gap-1 pt-1.5 border-t border-black/[0.04] mt-1">
                                  {/* WhatsApp button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenWhatsApp(session.memberName || "Danışan", "+90 532 555 0124", {
                                        date: session.date,
                                        timeSlot: session.timeSlot,
                                        focusArea: session.focusArea,
                                      });
                                    }}
                                    className="p-1 text-[#128C7E] hover:bg-emerald-100 rounded transition-colors"
                                    title="WhatsApp Hatırlatması Gönder"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                  </button>

                                  {/* Reschedule / Cancel button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenSessionAction(session);
                                    }}
                                    className="p-1 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                    title="Seansı Ertele veya İptal Et"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Complete button */}
                                  {session.status !== "completed" && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onCompleteSession(session);
                                      }}
                                      className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
                                      title="Seansı Tamamla"
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            ) : slot.isBreak ? (
                              /* CASE 2: Break / Decontamination slot */
                              <div className="h-full rounded-xl p-2 bg-[#F8FAFC] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center text-[#94A3B8] select-none">
                                <span className="text-[10px] font-semibold block">{slot.breakTitle}</span>
                                <span className="text-[9px] text-slate-400">Hijyen & Mola</span>
                              </div>
                            ) : (
                              /* CASE 3: Empty Open Slot (Click to add session) */
                              <button
                                type="button"
                                onClick={() => onOpenCreateSession(day.dateStr, slot.time)}
                                className="w-full h-full rounded-xl border border-transparent hover:border-emerald-300 hover:bg-emerald-50/40 p-2 flex flex-col items-center justify-center gap-1 text-[#94A3B8] hover:text-emerald-700 transition-all group/cell"
                                title={`${day.dayName} ${slot.time} için seans planla`}
                              >
                                <Plus className="w-4 h-4 opacity-0 group-hover/cell:opacity-100 group-hover/cell:scale-110 transition-all text-emerald-600" />
                                <span className="text-[10px] font-semibold opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                  + Seans Ekle
                                </span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-white to-emerald-100 border border-emerald-300" />
                <span>Onaylı 1:1 Seans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                <span>Tamamlanmış Seans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#F8FAFC] border border-dashed border-slate-200" />
                <span>Mola & Dezenfeksiyon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border border-emerald-300 bg-emerald-50" />
                <span>Müsait Slot (Tıklayıp Ekleyin)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              * Tüm seanslar NSCA-CSCS standartlarında sterilize istasyonlarda gerçekleşir.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: GÜNLÜK ÇİZELGE (DAY-BY-DAY HOURLY TIMELINE)                        */}
      {/* ========================================================================= */}
      {viewMode === "timeline" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {weekDays.map((day, idx) => {
              const isSelected = selectedTimelineDayIndex === idx;
              const countForDay = bookedSessions.filter((s) => s.date === day.dateStr).length;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedTimelineDayIndex(idx)}
                  className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-[#0F172A] text-white shadow-md"
                      : "bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-black/[0.04]"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {day.shortName}
                  </span>
                  <span className="text-sm font-black">{day.dayNumber} {day.monthShort}</span>
                  {countForDay > 0 && (
                    <span
                      className={`text-[9px] font-bold px-1.5 rounded-full ${
                        isSelected ? "bg-emerald-400 text-slate-950" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {countForDay} Seans
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Day Header */}
          {(() => {
            const activeDay = weekDays[selectedTimelineDayIndex] || weekDays[0];
            const activeDaySessions = bookedSessions.filter((s) => s.date === activeDay.dateStr);

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                  <div>
                    <h4 className="font-extrabold text-lg text-[#0F172A] uppercase font-display">
                      {activeDay.dayName}, {activeDay.dayNumber} {activeDay.monthName} {activeDay.year} Çizelgesi
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Bu gün için kayıtlı <strong>{activeDaySessions.length} seans</strong> bulunuyor.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCreateSession(activeDay.dateStr)}
                    className="px-3.5 py-2 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bu Güne Seans Ekle</span>
                  </button>
                </div>

                {/* Timeline Hour Cards */}
                <div className="space-y-3">
                  {TIME_SLOTS.map((slot) => {
                    const sess = findSessionForSlot(activeDay.dateStr, slot.time);

                    if (sess) {
                      return (
                        <div
                          key={slot.time}
                          className="p-4 sm:p-5 bg-gradient-to-r from-white via-white to-emerald-50/30 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="px-3 py-2 bg-[#0F172A] text-white rounded-xl text-center shrink-0">
                              <span className="text-xs font-black block">{slot.label}</span>
                              <span className="text-[10px] text-emerald-400 font-semibold">60 Dk</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-extrabold text-sm sm:text-base text-[#0F172A]">
                                  {sess.memberName || "Ege Mert"}
                                </h5>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">
                                  {sess.status === "completed" ? "TAMAMLANDI" : "ONAYLI 1:1"}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">
                                  {sess.station || "İstasyon A"}
                                </span>
                              </div>

                              <p className="text-xs text-[#475569]">
                                🎯 <strong>Odak:</strong> {sess.focusArea}
                              </p>

                              {sess.notes && (
                                <p className="text-xs text-[#64748B] italic bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-black/[0.04]">
                                  &ldquo;{sess.notes}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                            <button
                              type="button"
                              onClick={() =>
                                onOpenWhatsApp(sess.memberName || "Danışan", "+90 532 555 0124", {
                                  date: sess.date,
                                  timeSlot: sess.timeSlot,
                                  focusArea: sess.focusArea,
                                })
                              }
                              className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenSessionAction(sess)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>Ertele / İptal</span>
                            </button>

                            {sess.status !== "completed" && (
                              <button
                                type="button"
                                onClick={() => onCompleteSession(sess)}
                                className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                <span>Tamamla</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (slot.isBreak) {
                      return (
                        <div
                          key={slot.time}
                          className="p-3 bg-[#F8FAFC] border border-dashed border-slate-200 rounded-2xl flex items-center justify-between text-xs text-[#64748B]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-slate-700">{slot.label} - {slot.time.split(" - ")[1]}</span>
                            <span>• {slot.breakTitle}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Stüdyo Havalandırma</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={slot.time}
                        className="p-3 bg-white border border-black/[0.04] rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 text-xs text-[#64748B]">
                          <span className="font-bold text-[#0F172A]">{slot.label} - {slot.time.split(" - ")[1]}</span>
                          <span className="text-[11px] text-emerald-600 font-medium">Randevuya Açık Slot</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenCreateSession(activeDay.dateStr, slot.time)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-emerald-600" />
                          <span>Seans Ata</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: KLASİK LİSTE GÖRÜNÜMÜ (DETAILED CARDS LIST)                        */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {bookedSessions.length === 0 ? (
            <div className="p-8 text-center bg-white border border-black/[0.06] rounded-3xl space-y-3 shadow-xs">
              <CalendarIcon className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="text-xs text-[#64748B]">Henüz planlanmış seans bulunmuyor.</p>
              <button
                type="button"
                onClick={() => onOpenCreateSession()}
                className="px-5 py-2.5 bg-[#0F172A] text-white font-bold text-xs uppercase rounded-full hover:bg-black"
              >
                Hemen Seans Ekle
              </button>
            </div>
          ) : (
            bookedSessions.map((sess) => {
              const coachName = "İlker Yüksel";
              const memberName = sess.memberName || "Ege Mert";
              const stationName = sess.station || "Özel İstasyon A (Kuvvet Alanı)";
              const focusArea = sess.focusArea || "Kuvvet & Biyomekanik (Deadlift & Core)";
              const notes = sess.notes || "Ağır çekiş bloğu ve core stabilizasyonu çalışılacak.";

              return (
                <div
                  key={sess.id}
                  className="p-5 sm:p-6 bg-white hover:border-black/[0.12] border border-black/[0.06] rounded-3xl transition-all space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.05] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1.5 rounded-2xl bg-[#0F172A] text-white flex items-center gap-2 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-sm font-black tracking-tight">{sess.timeSlot}</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-black/[0.06] rounded-xl text-xs font-semibold text-[#0F172A]">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{sess.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase">
                        {stationName}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          sess.status === "completed"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                        }`}
                      >
                        {sess.status === "completed" ? "✓ Tamamlandı" : "✓ Onaylı 1:1"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Danışan Bilgi Kartı */}
                    <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] uppercase">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>DANIŞAN PROFİLİ</span>
                        </span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          VIP 1:1 Personal Training
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {memberName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">{memberName}</h4>
                          <p className="text-[10px] text-[#64748B]">Nişantaşı Özel İstasyon</p>
                        </div>
                      </div>
                    </div>

                    {/* Koç Kartı */}
                    <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase">
                        <span>BAŞ ANTRENÖR</span>
                        <span className="text-[9px] px-2 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                          1:1 Solo
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold text-xs shrink-0">
                          İY
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-1">
                            <span>{coachName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </h4>
                          <p className="text-[10px] text-slate-300">Kurucu & Baş Antrenör • NSCA-CSCS</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Odak ve Protokol */}
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-black/[0.04] space-y-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        🎯 ODAK ALANI
                      </span>
                      <span className="font-bold text-[#0F172A]">{focusArea}</span>
                    </div>
                    {notes && (
                      <p className="text-[11px] text-[#475569] leading-relaxed italic pl-1 border-l-2 border-emerald-500 mt-1">
                        &ldquo;{notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>İstasyon sterilize • Nabız bandı hazır</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWhatsApp(memberName, "+90 532 555 0124", {
                            date: sess.date,
                            timeSlot: sess.timeSlot,
                            focusArea,
                          })
                        }
                        className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenSessionAction(sess)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Ertele / İptal</span>
                      </button>

                      {sess.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => onCompleteSession(sess)}
                          className="px-4 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          <span>Seansı Tamamla</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
