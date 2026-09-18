"use client";

import React, { useState } from "react";
import {
  Calendar,
  Award,
  TrendingUp,
  UserCheck,
  Flame,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Star,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMember } from "@/context/MemberContext";

/* ------------------------------------------------------------------ */
/*  Activity Calendar Mini Heatmap (Integrated with Real Sessions)     */
/* ------------------------------------------------------------------ */
const MONTH_MAP: Record<string, number> = {
  Ocak: 0,
  Şubat: 1,
  Mart: 2,
  Nisan: 3,
  Mayıs: 4,
  Haziran: 5,
  Temmuz: 6,
  Ağustos: 7,
  Eylül: 8,
  Ekim: 9,
  Kasım: 10,
  Aralık: 11,
};

const ActivityCalendar: React.FC<{
  checkInLogs: any[];
  bookedSessions: any[];
  onSelectDate?: (dateStr: string) => void;
}> = ({ checkInLogs, bookedSessions, onSelectDate }) => {
  const [selectedDayInfo, setSelectedDayInfo] = useState<string | null>(null);

  // Use fixed studio reference date: 18 September 2026
  const refDate = new Date(2026, 8, 18); // 18 Sep 2026

  // Create a set of formatted date strings for check-in logs
  const activeDateMap = new Map<string, any>();
  checkInLogs.forEach((log) => {
    // Format: "16 Eylül 2026"
    const parts = log.date.split(" ");
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monthName = parts[1];
      const year = parseInt(parts[2], 10);
      const month = MONTH_MAP[monthName] ?? 8;
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      activeDateMap.set(key, log);
    }
  });

  // Upcoming booked sessions map
  const upcomingDateMap = new Map<string, any>();
  bookedSessions.forEach((sess) => {
    upcomingDateMap.set(sess.date, sess);
  });

  // Build the 28-day window ending on Sep 18, plus 3 upcoming days for context
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - (24 - i)); // window showing ~4 days ahead and 24 days past

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const checkIn = activeDateMap.get(dateKey);
    const upcoming = upcomingDateMap.get(dateKey);

    const isToday =
      d.getDate() === refDate.getDate() &&
      d.getMonth() === refDate.getMonth() &&
      d.getFullYear() === refDate.getFullYear();

    return {
      date: d,
      dateKey,
      dayNum: d.getDate(),
      isActive: !!checkIn,
      isUpcoming: !!upcoming && !checkIn,
      isToday,
      checkIn,
      upcoming,
    };
  });

  const weekDayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0F172A]">Aktivite & Antrenman Takvimi</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            Stüdyo girişleriniz ve planlanan randevularınızla entegre
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[4px] bg-emerald-500 shadow-2xs" />
            <span className="text-[#0F172A] font-medium">Giriş Yapıldı ({checkInLogs.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[4px] bg-blue-500 shadow-2xs" />
            <span className="text-[#0F172A] font-medium">Randevu ({bookedSessions.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[4px] bg-[#F1F5F9]" />
            <span>Dinlenme</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDayLabels.map((label) => (
          <div key={label} className="text-center text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wide pb-1">
            {label}
          </div>
        ))}
        {Array.from({ length: (days[0].date.getDay() + 6) % 7 }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          let badgeStyle = "bg-[#F1F5F9] text-[#94A3B8]";
          if (day.isActive) {
            badgeStyle =
              "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)] cursor-pointer hover:scale-105";
          } else if (day.isUpcoming) {
            badgeStyle =
              "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] cursor-pointer hover:scale-105";
          }

          return (
            <button
              type="button"
              key={day.dateKey}
              onClick={() => {
                if (day.checkIn) {
                  setSelectedDayInfo(
                    `✓ ${day.checkIn.date} (${day.checkIn.time}): ${day.checkIn.sessionType} — Koç: ${day.checkIn.coachName}`
                  );
                } else if (day.upcoming) {
                  setSelectedDayInfo(
                    `📅 ${day.upcoming.date} (${day.upcoming.timeSlot}): ${day.upcoming.focusArea} — Koç: ${day.upcoming.coachName}`
                  );
                } else {
                  setSelectedDayInfo(null);
                }
              }}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-semibold transition-all relative
                ${day.isToday ? "ring-2 ring-emerald-500 ring-offset-1 font-bold" : ""}
                ${badgeStyle}
              `}
            >
              <span>{day.dayNum}</span>
              {day.isActive && <span className="w-1 h-1 rounded-full bg-white/80 mt-0.5" />}
              {day.isUpcoming && <span className="w-1 h-1 rounded-full bg-white/80 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Selected day banner */}
      {selectedDayInfo && (
        <div className="mt-3.5 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
          <span>{selectedDayInfo}</span>
          <button
            onClick={() => setSelectedDayInfo(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main HistoryTab Component                                          */
/* ------------------------------------------------------------------ */
export const HistoryTab: React.FC = () => {
  const { checkInLogs, bookedSessions } = useMember();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const stats = [
    {
      label: "Toplam Giriş",
      value: `${checkInLogs.length + 8}`,
      suffix: "seans",
      icon: UserCheck,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-700",
      trend: "+2.6 / hafta",
      trendUp: true,
    },
    {
      label: "Devamlılık",
      value: "%94",
      suffix: "skor",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-700",
      trend: "Son 30 gün",
      trendUp: true,
    },
    {
      label: "Aktif Seri",
      value: "4",
      suffix: "hafta",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-700",
      trend: "Kesintisiz 🔥",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
          Antrenman Geçmişi
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-0.5">
          Girişlerim
        </h2>
        <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed max-w-lg">
          Stüdyo girişleriniz, seans detayları ve koçunuzun gelişim notları.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.color} opacity-80`} />

            <div className={`w-8 h-8 rounded-xl ${stat.bgLight} flex items-center justify-center ${stat.textColor} mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0F172A] tracking-tight">{stat.value}</span>
              <span className="text-[11px] text-[#94A3B8] font-medium">{stat.suffix}</span>
            </div>

            <p className="text-[10px] text-[#94A3B8] mt-1 font-medium uppercase tracking-wide">{stat.label}</p>

            <div className="mt-2 flex items-center gap-1">
              <span className={`text-[10px] font-semibold ${stat.textColor}`}>
                {stat.trendUp && "↑"} {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Calendar */}
      <ActivityCalendar
        checkInLogs={checkInLogs}
        bookedSessions={bookedSessions}
      />

      {/* Session History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#0F172A]">
            Seans Kayıtları
            <span className="ml-2 text-[11px] font-medium text-[#94A3B8]">
              ({checkInLogs.length})
            </span>
          </h3>
        </div>

        <div className="space-y-3">
          {checkInLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="p-4 flex items-center gap-3.5">
                {/* Day indicator circle */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center text-white shrink-0 shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                  <span className="text-[9px] font-semibold uppercase leading-none opacity-80">
                    EYL
                  </span>
                  <span className="text-lg font-bold leading-none mt-0.5">
                    {log.date.split(" ")[0]}
                  </span>
                </div>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#0F172A] truncate">
                      {log.sessionType}
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full shrink-0">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[12px] text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {log.coachName}
                    </span>
                  </div>
                </div>

                {/* Expand chevron */}
                <motion.div
                  animate={{ rotate: expandedLog === log.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#CBD5E1] group-hover:text-[#64748B] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Expandable Detail */}
              <AnimatePresence>
                {expandedLog === log.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 space-y-3">
                      <div className="h-px bg-black/[0.05]" />

                      {/* Coach Note */}
                      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] p-4 rounded-xl border border-blue-100/50 relative">
                        <Quote className="w-4 h-4 text-blue-300 absolute top-3 right-3 opacity-60" />
                        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
                          Koç Notu
                        </p>
                        <p className="text-[13px] text-[#334155] leading-relaxed italic">
                          &ldquo;{log.performanceNote}&rdquo;
                        </p>
                      </div>

                      {/* Key Metric */}
                      {log.keyMetric && (
                        <div className="flex items-center gap-2.5 bg-amber-50/80 p-3 rounded-xl border border-amber-100/60">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Award className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">Öne Çıkan Veri</p>
                            <p className="text-sm font-semibold text-[#0F172A]">{log.keyMetric}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
