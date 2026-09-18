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
/*  Activity Calendar Mini Heatmap (Apple Fitness+ style)              */
/* ------------------------------------------------------------------ */
const ActivityCalendar: React.FC<{ checkInCount: number }> = ({ checkInCount }) => {
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (27 - i));
    const dayOfWeek = date.getDay();
    const isActive =
      i > 20
        ? Math.random() > 0.3
        : dayOfWeek !== 0 && dayOfWeek !== 6
        ? Math.random() > 0.45
        : Math.random() > 0.75;
    return {
      date,
      dayNum: date.getDate(),
      isActive,
      isToday: i === 27,
    };
  });

  const weekDayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0F172A]">Aktivite Takvimi</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Son 4 hafta</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[4px] bg-emerald-500" />
            <span>Aktif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[4px] bg-[#F1F5F9]" />
            <span>Boş</span>
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
        {days.map((day, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.015, duration: 0.25 }}
            className={`
              aspect-square rounded-lg flex items-center justify-center text-[10px] font-semibold transition-all relative
              ${day.isToday ? "ring-2 ring-emerald-500 ring-offset-1" : ""}
              ${day.isActive
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                : "bg-[#F1F5F9] text-[#94A3B8]"
              }
            `}
          >
            {day.dayNum}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main HistoryTab Component                                          */
/* ------------------------------------------------------------------ */
export const HistoryTab: React.FC = () => {
  const { checkInLogs } = useMember();
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
      <ActivityCalendar checkInCount={checkInLogs.length + 8} />

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
