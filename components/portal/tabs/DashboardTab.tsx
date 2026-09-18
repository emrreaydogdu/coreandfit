"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  ChevronRight,
  Flame,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { DigitalPassCard } from "@/components/portal/DigitalPassCard";
import { SessionRingGauge } from "@/components/portal/SessionRingGauge";

export const DashboardTab: React.FC = () => {
  const {
    user,
    remainingSessions,
    totalSessions,
    packageExpiry,
    bookedSessions,
    setActiveTab,
    cancelSession,
  } = useMember();

  if (!user) return null;

  const upcomingSession = bookedSessions[0];

  const weekDays = [
    { day: "Pzt", date: "14 Eyl", visited: true },
    { day: "Sal", date: "15 Eyl", visited: false },
    { day: "Çar", date: "16 Eyl", visited: true },
    { day: "Per", date: "17 Eyl", visited: false },
    { day: "Cum", date: "18 Eyl", visited: false },
    { day: "Cts", date: "19 Eyl", visited: true, isUpcoming: true },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider font-bold">
              KİŞİSEL ANTRENMAN PANELİ
            </span>
            <span className="text-[#72757C]">•</span>
            <span className="text-[11px] font-mono text-[#A5A7AD]">Nişantaşı Stüdyo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-white tracking-tight mt-0.5">
            Hoş Geldin, {user.fullName.split(" ")[0]}
          </h2>
        </div>

        {/* Quick Booking Button */}
        <button
          onClick={() => setActiveTab("sessions")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] transition-all shadow-md active:scale-95 shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Yeni Seans Ayırt</span>
        </button>
      </div>

      {/* 2-Column Grid: Digital Pass & Session Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DigitalPassCard user={user} remainingSessions={remainingSessions} />
        <SessionRingGauge
          remaining={remainingSessions}
          total={totalSessions}
          expiryDate={packageExpiry}
          onAddSessions={() => setActiveTab("store")}
        />
      </div>

      {/* Upcoming Session Card */}
      <div className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E8FF36]/10 text-[#E8FF36]">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold uppercase font-display text-white">
              YAKLAŞAN İLK SEANSINIZ
            </h4>
          </div>

          <button
            onClick={() => setActiveTab("sessions")}
            className="text-[11px] font-mono text-[#E8FF36] hover:underline flex items-center gap-1 uppercase"
          >
            <span>Tüm Seanslarım</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingSession ? (
          <div className="bg-[#131519] border border-[#23272F] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#23272F] shrink-0">
                <img
                  src={upcomingSession.coachAvatar}
                  alt={upcomingSession.coachName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#E8FF36] uppercase font-bold">
                    {upcomingSession.date} • {upcomingSession.timeSlot}
                  </span>
                  <span className="px-2 py-0.5 bg-[#25D366]/20 text-[#25D366] text-[9px] font-mono rounded-full font-bold uppercase">
                    ONAYLANDI
                  </span>
                </div>

                <h5 className="text-base font-bold text-white uppercase font-display mt-0.5">
                  {upcomingSession.coachName} ile {upcomingSession.focusArea}
                </h5>

                <p className="text-xs text-[#72757C] font-mono flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E8FF36]" />
                  {upcomingSession.station}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#23272F]">
              <button
                onClick={() => {
                  if (confirm("Bu seansı iptal etmek istediğinize emin misiniz? 1 seans krediniz iade edilecektir.")) {
                    cancelSession(upcomingSession.id);
                  }
                }}
                className="px-3 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors uppercase"
              >
                İptal Et
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className="px-3.5 py-2 bg-[#1A1D24] text-white text-xs font-mono rounded-lg hover:bg-[#23272F] transition-colors uppercase font-semibold"
              >
                Detaylar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#131519] rounded-xl border border-dashed border-[#23272F] space-y-3">
            <AlertCircle className="w-8 h-8 text-[#72757C] mx-auto" />
            <p className="text-xs text-[#A5A7AD] font-mono">
              Yaklaşan aktif bir seansınız bulunmamaktadır.
            </p>
            <button
              onClick={() => setActiveTab("sessions")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase font-mono rounded-lg hover:bg-[#D4EB2B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Hemen Seans Ayırt</span>
            </button>
          </div>
        )}
      </div>

      {/* Weekly Attendance Matrix */}
      <div className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E8FF36]/10 text-[#E8FF36]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase font-display text-white">
                HAFTALIK ANTRENMAN DİSİPLİNİ
              </h4>
              <span className="text-[10px] font-mono text-[#72757C] uppercase">
                BU HAFTA 2 SEANS TAMAMLANDI • 1 SEANS BEKLİYOR
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-[#E8FF36]/10 text-[#E8FF36] text-[10px] font-mono rounded-full font-bold uppercase">
            3 HAFTALIK SERİ 🔥
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {weekDays.map((w, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                w.visited && !w.isUpcoming
                  ? "bg-[#162B16]/30 border-[#25D366]/40 text-white"
                  : w.isUpcoming
                  ? "bg-[#E8FF36]/10 border-[#E8FF36] text-white"
                  : "bg-[#131519] border-[#23272F] text-[#72757C]"
              }`}
            >
              <span className="text-xs font-bold font-mono block">{w.day}</span>
              <span className="text-[10px] text-[#A5A7AD] block mt-0.5">{w.date}</span>
              <div className="mt-2 flex justify-center">
                {w.visited && !w.isUpcoming ? (
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                ) : w.isUpcoming ? (
                  <Clock className="w-4 h-4 text-[#E8FF36] animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#343A46]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
