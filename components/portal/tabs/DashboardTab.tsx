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
  CheckCircle2,
  AlertCircle,
  Zap,
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
            <span className="text-[11px] font-mono text-[#10B981] uppercase tracking-wider font-bold">
              KİŞİSEL ANTRENMAN PANELİ
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-[11px] font-mono text-[#64748B]">Nişantaşı Private Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
            Hoş Geldin, {user.fullName.split(" ")[0]}
          </h2>
        </div>

        {/* Quick Booking Button */}
        <button
          onClick={() => setActiveTab("sessions")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Calendar className="w-4 h-4 text-[#10B981]" />
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

      {/* Upcoming Session Card (Apple Design) */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase font-display text-[#0F172A] tracking-tight">
                YAKLAŞAN İLK SEANSINIZ
              </h4>
              <span className="text-[10px] font-mono text-[#64748B] uppercase">
                BİREBİR REZERVE EDİLMİŞ ANTRENMAN
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("sessions")}
            className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            <span>Tüm Seanslarım</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingSession ? (
          <div className="bg-[#F8FAFC] border border-black/[0.04] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-black/10 shrink-0 shadow-xs">
                <img
                  src={upcomingSession.coachAvatar}
                  alt={upcomingSession.coachName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-[#2563EB]">
                    {upcomingSession.date} • {upcomingSession.timeSlot}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[10px] font-bold rounded-full uppercase">
                    ONAYLANDI
                  </span>
                </div>

                <h5 className="text-base font-bold text-[#0F172A] uppercase font-display mt-1">
                  {upcomingSession.coachName} ile {upcomingSession.focusArea}
                </h5>

                <p className="text-xs text-[#64748B] font-mono flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{upcomingSession.station}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-black/[0.06]">
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Bu seansı iptal etmek istediğinize emin misiniz? 1 seans krediniz iade edilecektir."
                    )
                  ) {
                    cancelSession(upcomingSession.id);
                  }
                }}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                İptal Et
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className="px-4 py-2 bg-white border border-black/[0.08] text-[#0F172A] text-xs font-semibold rounded-xl hover:bg-[#F1F5F9] transition-colors shadow-xs"
              >
                Detaylar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#F8FAFC] rounded-2xl border border-dashed border-black/[0.08] space-y-3">
            <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p className="text-xs text-[#64748B]">
              Şu anda planlanmış bir seansınız bulunmuyor.
            </p>
            <button
              onClick={() => setActiveTab("sessions")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] text-white font-bold text-xs uppercase font-mono rounded-full hover:bg-[#1E293B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Hemen Seans Ayırt</span>
            </button>
          </div>
        )}
      </div>

      {/* Weekly Attendance Matrix (Apple Health Style) */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#FEF2F2] text-[#EF4444]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase font-display text-[#0F172A] tracking-tight">
                HAFTALIK ANTRENMAN DİSİPLİNİ
              </h4>
              <span className="text-[10px] font-mono text-[#64748B] uppercase">
                BU HAFTA 2 SEANS TAMAMLANDI • 1 SEANS BEKLİYOR
              </span>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold rounded-full uppercase">
            3 HAFTALIK SERİ 🔥
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 sm:gap-3.5">
          {weekDays.map((w, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                w.visited && !w.isUpcoming
                  ? "bg-[#ECFDF5] border-[#10B981]/30 text-[#0F172A]"
                  : w.isUpcoming
                  ? "bg-[#EFF6FF] border-[#2563EB]/40 text-[#0F172A]"
                  : "bg-[#F8FAFC] border-black/[0.04] text-[#94A3B8]"
              }`}
            >
              <span className="text-xs font-bold block">{w.day}</span>
              <span className="text-[10px] text-[#64748B] block mt-0.5">{w.date}</span>
              <div className="mt-2.5 flex justify-center">
                {w.visited && !w.isUpcoming ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ) : w.isUpcoming ? (
                  <Clock className="w-4 h-4 text-[#2563EB] animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
