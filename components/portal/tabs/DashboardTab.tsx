"use client";

import React, { useState, useEffect } from "react";
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
  Droplets,
  Trophy,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  QrCode,
  ArrowRight,
  Share2,
  Dumbbell,
  Quote,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { DigitalPassCard } from "@/components/portal/DigitalPassCard";
import { SessionRingGauge } from "@/components/portal/SessionRingGauge";
import { downloadIcsFile, generateGoogleCalendarUrl } from "@/lib/calendar";

export const DashboardTab: React.FC = () => {
  const {
    user,
    remainingSessions,
    totalSessions,
    packageExpiry,
    bookedSessions,
    setActiveTab,
    cancelSession,
    waterIntakeMl,
    addWater,
    resetWater,
    userBadges,
    streakWeeks,
    setIsQuickQrOpen,
  } = useMember();

  if (!user) return null;

  const upcomingSession = bookedSessions[0];

  // Daily Water Goal: 2500 ml
  const waterTargetMl = 2500;
  const waterPercent = Math.min(100, Math.round((waterIntakeMl / waterTargetMl) * 100));

  const handleAddToCalendar = () => {
    if (!upcomingSession) return;
    downloadIcsFile({
      title: `Core & Fit: ${upcomingSession.focusArea}`,
      description: `Kurucu & Baş Antrenör ${upcomingSession.coachName} ile 1:1 Kişisel Antrenman Seansı.\nİstasyon: ${upcomingSession.station}\nNotlar: ${upcomingSession.notes || "Biyomekanik çalışma."}`,
      location: "Core & Fit Nişantaşı Studio, Abdi İpekçi Cad., İstanbul",
      startDate: upcomingSession.date,
      timeSlot: upcomingSession.timeSlot,
    });
  };

  const handleOpenWhatsAppCoach = () => {
    if (!upcomingSession) return;
    const text = encodeURIComponent(
      `Merhaba İlker Hocam, ${upcomingSession.date} saat ${upcomingSession.timeSlot} seansım hakkında bilgi almak istiyorum.`
    );
    window.open(`https://wa.me/905325550124?text=${text}`, "_blank");
  };

  const weekDays = [
    { day: "Pzt", date: "14 Eyl", visited: true },
    { day: "Sal", date: "15 Eyl", visited: false },
    { day: "Çar", date: "16 Eyl", visited: true },
    { day: "Per", date: "17 Eyl", visited: false },
    { day: "Cum", date: "18 Eyl", visited: false },
    { day: "Cts", date: "19 Eyl", visited: true, isUpcoming: true },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Welcome & Quick App Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans text-emerald-600 uppercase tracking-wider font-bold">
              KİŞİSEL ANTRENMAN PANELİ
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-[11px] font-sans text-[#64748B]">Nişantaşı Private Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
            Hoş Geldin, {(user?.fullName || "Ege Mert").split(" ")[0]}
          </h2>
        </div>

        {/* Header Quick Buttons: Turnstile Pass & New Booking */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsQuickQrOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-xs active:scale-95"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Turnike QR Aç</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-black transition-all shadow-xs active:scale-95 shrink-0"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Yeni Seans</span>
          </button>
        </div>
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

      {/* Upcoming Session Card with Native App Actions (Calendar, WhatsApp, QR) */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase font-display text-[#0F172A] tracking-tight">
                YAKLAŞAN İLK SEANSINIZ
              </h4>
              <span className="text-[10px] font-sans text-[#64748B] uppercase">
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
          <div className="bg-[#F8FAFC] border border-black/[0.04] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
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
                  <span className="text-xs font-bold font-sans text-[#2563EB]">
                    📅 {upcomingSession.date} • ⏰ {upcomingSession.timeSlot}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[10px] font-bold rounded-full uppercase">
                    ONAYLANDI
                  </span>
                </div>

                <h5 className="text-base font-bold text-[#0F172A] uppercase font-display mt-1">
                  {upcomingSession.coachName} ile {upcomingSession.focusArea}
                </h5>

                <p className="text-xs text-[#64748B] font-sans flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{upcomingSession.station}</span>
                </p>
              </div>
            </div>

            {/* Smart Actions: Add to Calendar, QR, WhatsApp, Cancel */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-black/[0.06]">
              <button
                type="button"
                onClick={handleAddToCalendar}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-black/[0.08] text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Apple veya Google Takviminize Ekleyin"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Takvime Ekle</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsAppCoach}
                className="px-3 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Koça WhatsApp'tan Yaz"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Koça Yaz</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Bu seansı iptal etmek istediğinize emin misiniz? 1 seans krediniz iade edilecektir."
                    )
                  ) {
                    cancelSession(upcomingSession.id);
                  }
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                İptal Et
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] text-white font-bold text-xs uppercase font-sans rounded-full hover:bg-[#1E293B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Hemen Seans Ayırt</span>
            </button>
          </div>
        )}
      </div>

      {/* 2-Column Row: Daily Water (Hydration) & Program Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apple Health Daily Water Tracker */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-display">
                  GÜNLÜK SU TÜKETİMİ
                </h4>
                <span className="text-[10px] text-[#64748B]">Hedef: 2.5 Litre (2500 ml)</span>
              </div>
            </div>

            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              %{waterPercent}
            </span>
          </div>

          {/* Progress Bar & Numbers */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5 text-xs font-mono">
              <span className="text-lg font-black text-[#0F172A]">{waterIntakeMl} ml</span>
              <span className="text-[11px] text-[#64748B]">/ {waterTargetMl} ml</span>
            </div>
            <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden p-0.5 border border-black/[0.04]">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                animate={{ width: `${waterPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addWater(250)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold transition-all active:scale-95"
              >
                +250 ml (1 Bardak)
              </button>
              <button
                type="button"
                onClick={() => addWater(500)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold transition-all active:scale-95"
              >
                +500 ml (Şişe)
              </button>
            </div>

            {waterIntakeMl > 0 && (
              <button
                type="button"
                onClick={resetWater}
                className="text-[10px] text-[#94A3B8] hover:text-[#0F172A] font-semibold"
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>

        {/* Personalized Workout Routine Shortcut Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Dumbbell className="w-3 h-3" />
              <span>GÜNCEL ANTRENMAN PLANI</span>
            </div>
            <h4 className="text-base font-bold font-display uppercase tracking-tight text-white">
              Posterior Chain & Core Hipertrofi
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              İlker Hoca tarafından hazırlanan trap bar deadlift ve tek bacak stabilizasyon protokolü.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("workout")}
            className="relative z-10 w-full py-2.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
          >
            <span>Egzersizleri & Formu İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gamification Badges Shelf */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-display">
                BAŞARI ROZETLERİ & KULÜP SEVİYESİ
              </h4>
              <span className="text-[10px] text-[#64748B]">Stüdyo disiplini ve kaldırış başarıları</span>
            </div>
          </div>

          <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full uppercase">
            {userBadges.filter((b) => b.isUnlocked).length} / {userBadges.length} KAZANILDI
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {userBadges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                badge.isUnlocked
                  ? "bg-[#F8FAFC] border-black/[0.06] shadow-2xs"
                  : "bg-slate-50/50 border-dashed border-slate-200 opacity-60"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl mx-auto flex items-center justify-center mb-2 ${
                  badge.isUnlocked
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Trophy className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#0F172A] truncate">{badge.title}</h5>
              <p className="text-[10px] text-[#64748B] truncate mt-0.5">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Attendance Matrix (Apple Health Style) */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#FEF2F2] text-[#EF4444]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase font-display text-[#0F172A] tracking-tight">
                HAFTALIK ANTRENMAN DİSİPLİNİ
              </h4>
              <span className="text-[10px] font-sans text-[#64748B] uppercase">
                BU HAFTA 2 SEANS TAMAMLANDI • 1 SEANS BEKLİYOR
              </span>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold rounded-full uppercase">
            {streakWeeks} HAFTALIK SERİ 🔥
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 sm:gap-3.5">
          {weekDays.map((w, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-3.5 rounded-2xl border text-center transition-all ${
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
