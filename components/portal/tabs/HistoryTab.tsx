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
  Scale,
  Plus,
  Activity,
  Check,
  X,
  Sparkles,
  FileText,
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
export const HistoryTab: React.FC = () => {
  const { checkInLogs, bookedSessions, bodyMeasurements, addBodyMeasurement } = useMember();
  const [activeSubTab, setActiveSubTab] = useState<"inbody" | "checkins">("inbody");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // Modal State for New Measurement
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newWeight, setNewWeight] = useState<string>("");
  const [newBodyFat, setNewBodyFat] = useState<string>("");
  const [newMuscle, setNewMuscle] = useState<string>("");
  const [newWaist, setNewWaist] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");

  const latestMeas = bodyMeasurements[0];
  const initialMeas = bodyMeasurements[bodyMeasurements.length - 1];

  const weightDelta = latestMeas && initialMeas ? (latestMeas.weightKg - initialMeas.weightKg).toFixed(1) : "0";
  const fatDelta = latestMeas && initialMeas ? (latestMeas.bodyFatPercent - initialMeas.bodyFatPercent).toFixed(1) : "0";
  const muscleDelta = latestMeas && initialMeas ? (latestMeas.muscleMassKg - initialMeas.muscleMassKg).toFixed(1) : "0";
  const waistDelta = latestMeas?.waistCm && initialMeas?.waistCm ? (latestMeas.waistCm - initialMeas.waistCm) : 0;

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    addBodyMeasurement({
      date: new Date().toISOString().split("T")[0],
      weightKg: parseFloat(newWeight) || 78,
      bodyFatPercent: parseFloat(newBodyFat) || 14.5,
      muscleMassKg: parseFloat(newMuscle) || 37,
      waistCm: parseFloat(newWaist) || undefined,
      note: newNote || "Üye portalından yeni tartı & kompozisyon girişi",
    });
    setNewWeight("");
    setNewBodyFat("");
    setNewMuscle("");
    setNewWaist("");
    setNewNote("");
    setIsAddModalOpen(false);
  };

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
    <div className="space-y-6 pb-20">
      {/* Page Header & SubTab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              BİYOMETRİK TAKİP & PERFORMANS
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-[11px] text-[#64748B]">Tanita MC-780 Profesyonel Analiz</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-0.5 font-display uppercase">
            Gelişim & Kayıtlar
          </h2>
          <p className="text-[13px] text-[#64748B] mt-0.5 max-w-lg">
            Vücut kompozisyonu değişimleriniz, kuvvet rekorlarınız ve stüdyo seans geçmişiniz.
          </p>
        </div>

        {/* SubTab Toggle Bar */}
        <div className="flex items-center p-1 bg-black/[0.04] rounded-2xl border border-black/[0.05] self-start sm:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveSubTab("inbody")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "inbody"
                ? "bg-white text-[#0F172A] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>InBody & Kompozisyon</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("checkins")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "checkins"
                ? "bg-white text-[#0F172A] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Turnike & Seanslar</span>
          </button>
        </div>
      </div>

      {activeSubTab === "inbody" && (
        <div className="space-y-6">
          {/* 4 Core Transformation Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Weight */}
            <div className="p-4 sm:p-5 bg-white border border-black/[0.06] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  VÜCUT AĞIRLIĞI
                </span>
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Scale className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-3xl font-black text-[#0F172A] font-display">
                  {latestMeas?.weightKg || 78.4}
                </span>
                <span className="text-xs text-[#64748B] font-semibold">kg</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span>{parseFloat(weightDelta) <= 0 ? weightDelta : `+${weightDelta}`} kg</span>
                <span className="text-[10px] text-[#94A3B8] font-medium font-sans">(Başlangıç: {initialMeas?.weightKg} kg)</span>
              </div>
            </div>

            {/* Body Fat % */}
            <div className="p-4 sm:p-5 bg-white border border-black/[0.06] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  YAĞ ORANI
                </span>
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-3xl font-black text-[#0F172A] font-display">
                  %{latestMeas?.bodyFatPercent || 14.8}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span>{parseFloat(fatDelta) <= 0 ? fatDelta : `+${fatDelta}`}%</span>
                <span className="text-[10px] text-[#94A3B8] font-medium font-sans">(Başlangıç: %{initialMeas?.bodyFatPercent})</span>
              </div>
            </div>

            {/* Muscle Mass */}
            <div className="p-4 sm:p-5 bg-white border border-black/[0.06] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  İSKELET KASI
                </span>
                <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Dumbbell className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-3xl font-black text-[#0F172A] font-display">
                  {latestMeas?.muscleMassKg || 37.1}
                </span>
                <span className="text-xs text-[#64748B] font-semibold">kg</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span>+{muscleDelta} kg</span>
                <span className="text-[10px] text-[#94A3B8] font-medium font-sans">Net Hipertrofi</span>
              </div>
            </div>

            {/* Waist */}
            <div className="p-4 sm:p-5 bg-white border border-black/[0.06] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  BEL ÇEVRESİ
                </span>
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-3xl font-black text-[#0F172A] font-display">
                  {latestMeas?.waistCm || 82}
                </span>
                <span className="text-xs text-[#64748B] font-semibold">cm</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span>{waistDelta <= 0 ? waistDelta : `+${waistDelta}`} cm</span>
                <span className="text-[10px] text-[#94A3B8] font-medium font-sans">İncelme</span>
              </div>
            </div>
          </div>

          {/* Personal Strength Records (PR) Board */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                  BİYOMEKANİK KUVVET REKORLARI (PR)
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-white mt-0.5">
                  Kişisel Kaldırış Zirveleri
                </h3>
              </div>
              <span className="text-xs text-slate-400">Koç İlker Yüksel Gözetiminde Onaylanmıştır</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">TRAP BAR DEADLIFT</span>
                <div className="text-2xl font-black text-white font-mono mt-1">160 KG</div>
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">Hedef: 180 KG</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">BACK SQUAT (BOX)</span>
                <div className="text-2xl font-black text-white font-mono mt-1">130 KG</div>
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">90° Güvenli Açı</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">BARBELL BENCH PRESS</span>
                <div className="text-2xl font-black text-white font-mono mt-1">95 KG</div>
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">Skapular Kilit</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">WEIGHTED PULL-UP</span>
                <div className="text-2xl font-black text-white font-mono mt-1">+15 KG</div>
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">Tam Ekstansiyon</span>
              </div>
            </div>
          </div>

          {/* InBody Measurement Records Table */}
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display uppercase text-[#0F172A]">
                  Tanita InBody Ölçüm Geçmişi
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Her ay stüdyomuzda gerçekleştirilen profesyonel segmental vücut analizleri.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-2xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Yeni Tartı / Ölçüm Ekle</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
              <table className="w-full border-collapse min-w-[650px] text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-black/[0.06]">
                    <th className="p-3 text-[10px] uppercase tracking-wider">Tarih</th>
                    <th className="p-3 text-[10px] uppercase tracking-wider">Kilo</th>
                    <th className="p-3 text-[10px] uppercase tracking-wider">Yağ %</th>
                    <th className="p-3 text-[10px] uppercase tracking-wider">Kas Kütlesi</th>
                    <th className="p-3 text-[10px] uppercase tracking-wider">Bel Çevresi</th>
                    <th className="p-3 text-[10px] uppercase tracking-wider">Koç Değerlendirmesi & Not</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] font-sans">
                  {bodyMeasurements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0F172A] whitespace-nowrap">
                        📅 {m.date}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#0F172A]">
                        {m.weightKg} kg
                      </td>
                      <td className="p-3 font-mono font-semibold text-blue-700">
                        %{m.bodyFatPercent}
                      </td>
                      <td className="p-3 font-mono font-semibold text-purple-700">
                        {m.muscleMassKg} kg
                      </td>
                      <td className="p-3 font-mono text-[#475569]">
                        {m.waistCm ? `${m.waistCm} cm` : "-"}
                      </td>
                      <td className="p-3 text-xs text-[#334155] max-w-xs truncate">
                        {m.note || "Standart kontrol"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Measurement */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A] space-y-4"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5">
                  YENİ BİYOMETRİK VERİ
                </span>
                <h3 className="text-xl font-bold font-display text-[#0F172A]">
                  Ölçüm & Tartı Kaydet
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Evdeki veya stüdyo tartısındaki güncel değerlerinizi ekleyin.
                </p>
              </div>

              <form onSubmit={handleSaveMeasurement} className="space-y-3 text-xs font-sans">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      Kilo (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Örn: 78.2"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      Yağ Oranı (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Örn: 14.5"
                      value={newBodyFat}
                      onChange={(e) => setNewBodyFat(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      Kas Kütlesi (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Örn: 37.2"
                      value={newMuscle}
                      onChange={(e) => setNewMuscle(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      Bel Çevresi (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Örn: 81.5"
                      value={newWaist}
                      onChange={(e) => setNewWaist(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Ölçüm Notu
                  </label>
                  <input
                    type="text"
                    placeholder="Sabah aç karnına ölçüldü vb."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-black/[0.08] text-[#64748B] rounded-xl text-xs font-semibold"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {activeSubTab === "checkins" && (
        <div className="space-y-6">

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
      )}
    </div>
  );
};
