"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageSquare,
  RotateCcw,
  LayoutGrid,
  List,
  CalendarDays,
} from "lucide-react";
import type { BookedSession } from "@/types/portal";
import type { BookingStatus } from "@/lib/training";
import { useMember } from "@/context/MemberContext";
import { formatDateLong } from "@/lib/format";
import { timeSlotsOverlap, todayIso } from "@/lib/slots";
import { BOOKING_STATUS_LABEL, BOOKING_STATUS_STYLE, HEAD_COACH_NAME, STUDIO_AREA, workoutLabel } from "@/lib/training";

interface AdminScheduleCalendarTableProps {
  bookedSessions: BookedSession[];
  onOpenCreateSession: (date?: string, timeSlot?: string) => void;
  onOpenWhatsApp: (name: string, phone: string, sessionInfo?: { date: string; timeSlot: string }) => void;
  onOpenSessionAction: (session: BookedSession) => void;
  onCompleteSession: (session: BookedSession) => void;
  onConfirmSession: (session: BookedSession) => void;
  onNavigateToCoachSlots?: () => void;
}

const DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type StatusFilter = "all" | Exclude<BookingStatus, "CANCELLED">;

export const AdminScheduleCalendarTable: React.FC<AdminScheduleCalendarTableProps> = ({
  bookedSessions,
  onOpenCreateSession,
  onOpenWhatsApp,
  onOpenSessionAction,
  onCompleteSession,
  onConfirmSession,
  onNavigateToCoachSlots,
}) => {
  const { coachSchedules } = useMember();
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "list">("table");
  const [weekOffset, setWeekOffset] = useState(0);
  const [timelineDay, setTimelineDay] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const today = todayIso();

  const slotTimes = useMemo(() => {
    const times = new Set<string>();
    coachSchedules[0]?.weeklySchedule.forEach((d) => d.slots.forEach((s) => times.add(s.time)));
    return [...times].sort();
  }, [coachSchedules]);

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

  const visible = bookedSessions.filter((s) => {
    if (s.status === "CANCELLED") return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    return !q || (s.memberName ?? "").toLowerCase().includes(q) || (s.memberNo ?? "").toLowerCase().includes(q);
  });

  const findSession = (date: string, slot: string) => visible.find((s) => s.date === date && timeSlotsOverlap(s.timeSlot, slot));

  const weekSet = new Set(weekDays.map((d) => d.dateStr));
  const weekSessions = visible.filter((s) => weekSet.has(s.date));

  const actions = (sess: BookedSession, compact = false) => (
    <div className={`flex items-center justify-end ${compact ? "gap-0.5" : "gap-2 flex-wrap"}`}>
      <button
        type="button"
        onClick={() => onOpenWhatsApp(sess.memberName ?? "", sess.memberPhone ?? "", { date: sess.date, timeSlot: sess.timeSlot })}
        className={compact ? "p-1 text-[#128C7E] hover:bg-emerald-100 rounded" : "min-h-10 px-3 bg-[#25D366]/10 text-[#128C7E] rounded-xl text-xs font-bold flex items-center gap-1"}
        title="WhatsApp"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        {!compact && <span>WhatsApp</span>}
      </button>
      {sess.status === "PENDING" && (
        <button
          type="button"
          onClick={() => onConfirmSession(sess)}
          className={compact ? "p-1 text-amber-700 hover:bg-amber-100 rounded" : "min-h-10 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"}
          title="Onayla"
        >
          <Check className="w-3.5 h-3.5" />
          {!compact && <span>Onayla</span>}
        </button>
      )}
      {sess.status !== "COMPLETED" && (
        <button
          type="button"
          onClick={() => onOpenSessionAction(sess)}
          className={compact ? "p-1 text-slate-600 hover:bg-slate-200 rounded" : "min-h-10 px-3 bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1"}
          title="Ertele / İptal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {!compact && <span>Ertele / İptal</span>}
        </button>
      )}
      {sess.status === "CONFIRMED" && (
        <button
          type="button"
          onClick={() => onCompleteSession(sess)}
          className={compact ? "p-1 text-emerald-700 hover:bg-emerald-100 rounded" : "min-h-10 px-3 bg-[#0F172A] text-white rounded-xl text-xs font-bold flex items-center gap-1"}
          title="Tamamla"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          {!compact && <span>Tamamla</span>}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-xl">Seans Programı</h3>
            <p className="text-xs text-[#64748B]">
              {HEAD_COACH_NAME} • {STUDIO_AREA}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenCreateSession()}
              className="min-h-10 px-4 bg-[#0F172A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Randevu Oluştur
            </button>
            {onNavigateToCoachSlots && (
              <button type="button" onClick={onNavigateToCoachSlots} className="min-h-10 px-3.5 bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Müsaitlik Ayarları
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center bg-[#F8FAFC] border border-black/[0.06] rounded-2xl p-1 self-start">
            <button type="button" onClick={() => setWeekOffset((p) => p - 1)} className="p-2 hover:bg-white rounded-xl" aria-label="Önceki hafta">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold min-w-[140px] text-center">
              {weekDays[0].label} - {weekDays[6].label}
            </span>
            <button type="button" onClick={() => setWeekOffset((p) => p + 1)} className="p-2 hover:bg-white rounded-xl" aria-label="Sonraki hafta">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center p-1 bg-[#F1F5F9] rounded-2xl self-start">
            {([
              ["table", "Haftalık", LayoutGrid],
              ["timeline", "Günlük", CalendarDays],
              ["list", "Liste", List],
            ] as const).map(([mode, label, Icon]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${viewMode === mode ? "bg-white shadow-xs" : "text-[#64748B]"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-black/[0.04]">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Üye adı veya numarası ara"
                className="w-full min-h-10 pl-9 pr-3 bg-[#F8FAFC] border border-black/[0.06] rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl overflow-x-auto no-scrollbar">
              {(["all", "PENDING", "CONFIRMED", "COMPLETED"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    statusFilter === st ? "bg-white shadow-2xs font-bold" : "text-[#64748B]"
                  }`}
                >
                  {st === "all" ? "Tümü" : BOOKING_STATUS_LABEL[st]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl">Bu hafta: {weekSessions.length}</span>
            <span className="px-3 py-1.5 bg-amber-50 text-amber-900 rounded-xl">
              Onay bekleyen: {weekSessions.filter((s) => s.status === "PENDING").length}
            </span>
          </div>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-3 sm:p-6">
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full border-collapse min-w-[900px] text-left">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-[11px] font-extrabold uppercase text-slate-400 w-20 sticky left-0 z-10 bg-slate-900">Saat</th>
                  {weekDays.map((day) => (
                    <th key={day.dateStr} className={`p-3 text-center border-l border-slate-800 ${day.dateStr === today ? "bg-slate-800" : ""}`}>
                      <span className="text-[10px] uppercase text-slate-300 block">{day.dayName}</span>
                      <span className={`text-sm font-black ${day.dateStr === today ? "text-emerald-400" : "text-white"}`}>{day.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] text-xs">
                {slotTimes.map((slot) => (
                  <tr key={slot}>
                    <td className="p-3 font-extrabold bg-slate-50 sticky left-0 z-10 border-r border-black/[0.06]">{slot.split(" - ")[0]}</td>
                    {weekDays.map((day) => {
                      const sess = findSession(day.dateStr, slot);
                      return (
                        <td key={day.dateStr} className="p-1.5 h-24 align-top border-l border-black/[0.04]">
                          {sess ? (
                            <div
                              className={`h-full rounded-xl p-2 flex flex-col justify-between border ${
                                sess.status === "PENDING"
                                  ? "bg-amber-50/70 border-amber-200"
                                  : sess.status === "COMPLETED"
                                  ? "bg-slate-100 border-slate-200"
                                  : "bg-emerald-50/50 border-emerald-200"
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0">
                                <span className="font-black text-xs block truncate">{sess.memberName}</span>
                                <span className="text-[10px] text-[#475569] block truncate">{workoutLabel(sess.workoutType)}</span>
                                <span className={`inline-block text-[9px] font-bold px-1.5 rounded ${BOOKING_STATUS_STYLE[sess.status]}`}>
                                  {BOOKING_STATUS_LABEL[sess.status]}
                                </span>
                              </div>
                              {actions(sess, true)}
                            </div>
                          ) : day.dateStr >= today ? (
                            <button
                              type="button"
                              onClick={() => onOpenCreateSession(day.dateStr, slot)}
                              className="w-full h-full rounded-xl border border-transparent hover:border-emerald-300 hover:bg-emerald-50/40 flex items-center justify-center text-emerald-600 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                              aria-label={`${day.dayName} ${slot} randevu ekle`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          ) : null}
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

      {viewMode === "timeline" && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {weekDays.map((day, idx) => (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setTimelineDay(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap flex flex-col items-center ${
                  timelineDay === idx ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC] text-[#64748B]"
                }`}
              >
                <span className="text-[10px] uppercase">{day.dayName.slice(0, 3)}</span>
                <span className="text-sm font-black">{day.label}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2.5">
            {slotTimes.map((slot) => {
              const day = weekDays[timelineDay];
              const sess = findSession(day.dateStr, slot);
              return sess ? (
                <div key={slot} className="p-4 border border-black/[0.08] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-black" data-keep-white>
                      {slot.split(" - ")[0]}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm">{sess.memberName}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${BOOKING_STATUS_STYLE[sess.status]}`}>
                          {BOOKING_STATUS_LABEL[sess.status]}
                        </span>
                      </div>
                      <span className="text-xs text-[#475569]">{workoutLabel(sess.workoutType)}</span>
                    </div>
                  </div>
                  {actions(sess)}
                </div>
              ) : (
                <div key={slot} className="p-3 border border-black/[0.04] rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold">{slot}</span>
                  {day.dateStr >= today && (
                    <button
                      type="button"
                      onClick={() => onOpenCreateSession(day.dateStr, slot)}
                      className="min-h-9 px-3 bg-slate-100 rounded-xl font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-emerald-600" />
                      Randevu
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-3">
          {visible.length === 0 ? (
            <div className="p-8 text-center bg-white border border-black/[0.06] rounded-3xl space-y-3">
              <CalendarIcon className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="text-xs text-[#64748B]">Kayıt bulunamadı.</p>
            </div>
          ) : (
            [...visible]
              .sort((a, b) => (b.date + b.timeSlot).localeCompare(a.date + a.timeSlot))
              .map((sess) => (
                <div key={sess.id} className="p-4 sm:p-5 bg-white border border-black/[0.06] rounded-3xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1.5 rounded-xl bg-[#0F172A] text-white text-xs font-black" data-keep-white>
                        {sess.timeSlot}
                      </span>
                      <span className="text-xs font-semibold">{formatDateLong(sess.date)}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${BOOKING_STATUS_STYLE[sess.status]}`}>
                      {BOOKING_STATUS_LABEL[sess.status]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Üye</span>
                      <span className="font-bold">{sess.memberName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Antrenman</span>
                      <span className="font-semibold">{workoutLabel(sess.workoutType)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Antrenör</span>
                      <span className="font-semibold">{HEAD_COACH_NAME}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Oluşturan</span>
                      <span className="font-semibold">{sess.createdBy === "admin" ? "Stüdyo" : "Üye"}</span>
                    </div>
                  </div>
                  {(sess.memberNote || sess.internalNote) && (
                    <div className="text-[11px] text-[#475569] bg-[#F8FAFC] px-3 py-2 rounded-xl space-y-0.5">
                      {sess.memberNote && <p>Üye notu: {sess.memberNote}</p>}
                      {sess.internalNote && <p>Dahili not: {sess.internalNote}</p>}
                    </div>
                  )}
                  {actions(sess)}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};
