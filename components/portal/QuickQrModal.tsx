"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  QrCode,
  ShieldCheck,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { useMemberPass } from "@/components/portal/useMemberPass";
import { todayIso } from "@/lib/slots";
import { ACTIVE_BOOKING_STATUSES, workoutLabel } from "@/lib/training";

interface QuickQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickQrModal: React.FC<QuickQrModalProps> = ({ isOpen, onClose }) => {
  const { user, remainingSessions, bookedSessions } = useMember();
  // Sunucunun imzaladığı kısa ömürlü QR; pencere açıkken otomatik yenilenir.
  const { qrDataUrl, code, secondsLeft, refresh } = useMemberPass(isOpen);

  const upcomingSession = bookedSessions.find(
    (s) => s.date === todayIso() && ACTIVE_BOOKING_STATUSES.includes(s.status)
  );

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white rounded-[36px] border border-white/15 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col items-center select-none"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mt-20" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md transition-colors z-20"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Apple Wallet Brand Header */}
          <div className="flex items-center gap-2 mb-4 z-10">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
              CF
            </div>
            <span className="font-display font-extrabold text-xs tracking-wider uppercase text-white/90">
              CORE & FIT • DİJİTAL TURNİKE KARTI
            </span>
          </div>

          {/* Member Card Summary Header */}
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-400/40 shrink-0 shadow-xs"
              />
              <div className="text-left">
                <h4 className="font-bold text-xs text-white leading-tight flex items-center gap-1">
                  <span>{user.fullName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.memberNo}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">KALAN BAKİYE</span>
              <span className="text-base font-black text-white">{remainingSessions} Seans</span>
            </div>
          </div>

          {/* High-Contrast Dynamic QR Code Box */}
          <div className="relative p-4 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center z-10 w-60 h-60">
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Giriş QR kodu" className="w-44 h-44 object-contain" />
              ) : (
                <QrCode className="w-44 h-44 text-slate-300 animate-pulse" />
              )}
            </div>

            <div className="mt-1 font-mono text-[10px] font-bold text-slate-700 tracking-[0.25em]">
              {code}
            </div>
          </div>

          {/* Dynamic 60s Refresh Bar & Optical Indicator */}
          <div className="w-full mt-4 flex items-center justify-between px-2 text-xs z-10">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Optik Okuyucuya Gösterin</span>
            </div>

            <button
              type="button"
              onClick={refresh}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{secondsLeft}s Yenileniyor</span>
            </button>
          </div>

          {/* Station & Gate Status Pill */}
          <div className="w-full mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-center justify-between text-[11px] z-10">
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Nişantaşı Giriş Kapısı: <strong>Turnike 1</strong></span>
            </div>
            <span className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black rounded uppercase">
              AKTİF
            </span>
          </div>

          {/* Next Session Context */}
          {upcomingSession && (
            <div className="w-full mt-2 text-center text-[10px] text-slate-400 font-sans z-10">
              Bugün {upcomingSession.timeSlot} • {workoutLabel(upcomingSession.workoutType)}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
