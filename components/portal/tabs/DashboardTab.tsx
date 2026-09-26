"use client";

import React, { useState } from "react";
import { Calendar, Plus, Clock, MapPin, ChevronRight, AlertCircle, MessageSquare, QrCode, Gift, Scale } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { DigitalPassCard } from "@/components/portal/DigitalPassCard";
import { SessionRingGauge } from "@/components/portal/SessionRingGauge";
import { ReferralCard } from "@/components/portal/ReferralCard";
import { downloadIcsFile } from "@/lib/calendar";
import { formatDateLong, formatDateMedium } from "@/lib/format";
import { firstVsLatest, signed, formatNumber } from "@/lib/measurements";
import { todayIso } from "@/lib/slots";
import {
  ACTIVE_BOOKING_STATUSES,
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_STYLE,
  HEAD_COACH_NAME,
  STUDIO_AREA,
  workoutLabel,
} from "@/lib/training";

const COACH_AVATAR = "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80";

export const DashboardTab: React.FC = () => {
  const {
    user,
    remainingSessions,
    totalSessions,
    packageExpiry,
    bookedSessions,
    bodyMeasurements,
    gifts,
    referral,
    setActiveTab,
    cancelSession,
    setIsQuickQrOpen,
  } = useMember();
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return null;

  const today = todayIso();
  const upcomingSession = bookedSessions
    .filter((s) => ACTIVE_BOOKING_STATUSES.includes(s.status) && s.date >= today)
    .sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot))[0];

  const weight = firstVsLatest(bodyMeasurements, "weightKg");
  const activeGifts = gifts.filter((g) => g.status === "available");

  const handleAddToCalendar = () => {
    if (!upcomingSession) return;
    downloadIcsFile({
      title: `Core & Fit: ${workoutLabel(upcomingSession.workoutType)}`,
      description: `${HEAD_COACH_NAME} ile birebir antrenman. Lütfen seanstan 10 dakika önce stüdyoda olun.`,
      location: `${STUDIO_AREA}, Nişantaşı, İstanbul`,
      startDate: upcomingSession.date,
      timeSlot: upcomingSession.timeSlot,
    });
  };

  const handleOpenWhatsAppCoach = () => {
    if (!upcomingSession) return;
    const text = encodeURIComponent(
      `Merhaba İlker Hocam, ${formatDateMedium(upcomingSession.date)} saat ${upcomingSession.timeSlot} seansım hakkında bilgi almak istiyorum.`
    );
    window.open(`https://wa.me/905318477882?text=${text}`, "_blank");
  };

  const handleCancel = async () => {
    if (!upcomingSession) return;
    if (!confirm("Bu seansı iptal etmek istediğinize emin misiniz? Ders hakkınız iade edilecek.")) return;
    const res = await cancelSession(upcomingSession.id);
    setMessage(res.ok ? res.message ?? null : res.error);
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-emerald-600 uppercase tracking-wider font-bold">Kişisel Antrenman Paneli</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
            Hoş Geldin, {user.fullName.split(" ")[0]}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsQuickQrOpen(true)}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold text-xs uppercase tracking-wider rounded-full transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Turnike QR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-black transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Yeni Seans</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-medium">{message}</div>
      )}

      {/* Sonraki seans */}
      <section className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold uppercase font-display text-[#0F172A] tracking-tight">Yaklaşan İlk Seansınız</h4>
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
              <img
                src={COACH_AVATAR}
                alt={HEAD_COACH_NAME}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-black/10 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#2563EB]">
                    {formatDateLong(upcomingSession.date)} • {upcomingSession.timeSlot}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${BOOKING_STATUS_STYLE[upcomingSession.status]}`}>
                    {BOOKING_STATUS_LABEL[upcomingSession.status]}
                  </span>
                </div>
                <h5 className="text-base font-bold text-[#0F172A] mt-1">
                  {HEAD_COACH_NAME} ile {workoutLabel(upcomingSession.workoutType)}
                </h5>
                <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{STUDIO_AREA}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-black/[0.06]">
              <button
                type="button"
                onClick={handleAddToCalendar}
                className="min-h-10 px-3 bg-white hover:bg-slate-50 border border-black/[0.08] text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Takvime Ekle</span>
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsAppCoach}
                className="min-h-10 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Koça Yaz</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="min-h-10 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                İptal Et
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#F8FAFC] rounded-2xl border border-dashed border-black/[0.08] space-y-3">
            <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p className="text-xs text-[#64748B]">Şu anda planlanmış bir seansınız bulunmuyor.</p>
            <button
              onClick={() => setActiveTab("sessions")}
              className="inline-flex items-center gap-1.5 min-h-10 px-4 bg-[#0F172A] text-white font-bold text-xs uppercase rounded-full hover:bg-[#1E293B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Hemen Seans Ayırt</span>
            </button>
          </div>
        )}
      </section>

      {/* Dijital kart ve ders hakkı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DigitalPassCard user={user} remainingSessions={remainingSessions} />
        <SessionRingGauge
          remaining={remainingSessions}
          total={totalSessions}
          packageName={totalSessions > 0 ? user.membershipTier : "Henüz paket yok"}
          expiryDate={packageExpiry ? formatDateMedium(packageExpiry) : "—"}
          onAddSessions={() => setActiveTab("store")}
        />
      </div>

      {/* Vücut ağırlığı özeti ve hediye */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className="text-left bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-black/[0.14] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Vücut Ağırlığı</h4>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
          </div>
          {weight ? (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-[#64748B] block">İlk</span>
                <span className="text-base font-black text-[#0F172A]">{formatNumber(weight.first)} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">Güncel</span>
                <span className="text-base font-black text-[#0F172A]">{formatNumber(weight.latest)} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">Değişim</span>
                <span className={`text-base font-black ${weight.diff <= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {signed(weight.diff)} kg
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#64748B]">Henüz ölçüm yok. İlk ölçümünüz stüdyoda alınacak.</p>
          )}
        </button>

        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg" data-keep-white>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Hediye</h4>
          </div>
          {activeGifts.length > 0 ? (
            <ul className="space-y-3">
              {activeGifts.map((g) => (
                <li key={g.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{g.title}</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">Kullanılabilir</span>
                  </div>
                  {g.description && <p className="text-xs text-white/80 mt-1 leading-relaxed">{g.description}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-white/80 leading-relaxed">
              Şu an tanımlı bir hediyen yok. Ücretsiz ders, kampanya ve üyelik avantajları burada görünecek.
            </p>
          )}
        </section>
      </div>

      {referral && <ReferralCard referral={referral} />}
    </div>
  );
};
