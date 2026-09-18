"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, X, ShieldCheck, Maximize2, Zap, Sparkles } from "lucide-react";
import { MemberUser } from "@/types/portal";

interface DigitalPassCardProps {
  user: MemberUser;
  remainingSessions: number;
}

export const DigitalPassCard: React.FC<DigitalPassCardProps> = ({
  user,
  remainingSessions,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <>
      {/* Apple Wallet Style Ceramic White & Silver Pass Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#FAFAFC] to-[#F0F2F6] border border-black/[0.08] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all duration-300 text-[#0F172A] group cursor-pointer"
        onClick={() => setShowQrModal(true)}
      >
        {/* Subtle Pearlescent Silver Refraction & Iridescent Ambient Light */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-100/40 via-blue-100/30 to-amber-100/20 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[195px]">
          {/* Top Pass Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#0F172A] flex items-center justify-center font-sans font-black text-white text-xs shadow-sm">
                CF
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-[10px] tracking-[0.25em] text-[#64748B] uppercase font-bold">
                    DIGITAL MEMBER PASS
                  </span>
                  <Sparkles className="w-3 h-3 text-[#10B981]" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight text-[#0F172A]">
                  CORE & FIT NIŞANTAŞI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-black/[0.06] rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-sans font-bold tracking-wider text-[#0F172A] uppercase">
                AKTİF ÜYE
              </span>
            </div>
          </div>

          {/* Member Name & Status */}
          <div className="my-3 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-sans text-[#94A3B8] uppercase tracking-wider block mb-0.5">
                ÜYE STATÜSÜ
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                {user.fullName}
              </h3>
              <p className="text-xs text-[#475569] font-medium mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{user.membershipTier}</span>
              </p>
            </div>

            {/* Apple Wallet Style QR Preview Box */}
            <div className="flex flex-col items-center gap-1 bg-white border border-black/[0.08] p-2.5 rounded-2xl shadow-xs group-hover:border-[#0F172A] transition-colors">
              <QrCode className="w-9 h-9 text-[#0F172A]" />
              <span className="text-[8px] font-sans text-[#64748B] uppercase tracking-wider flex items-center gap-0.5 font-bold">
                <span>DOKUN</span>
                <Maximize2 className="w-2 h-2" />
              </span>
            </div>
          </div>

          {/* Bottom Pass Meta */}
          <div className="pt-3.5 border-t border-black/[0.06] flex items-center justify-between text-xs font-sans">
            <div>
              <span className="text-[9px] text-[#94A3B8] uppercase font-bold block">ÜYE KODU</span>
              <span className="text-[#0F172A] font-bold tracking-widest">{user.memberNo}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#94A3B8] uppercase font-bold block">KALAN SEANS HAKKI</span>
              <span className="text-[#10B981] font-bold tracking-wider text-sm">
                {remainingSessions} Seans
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Turnstile / Reception QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border border-black/[0.08] rounded-3xl p-7 shadow-2xl text-center text-[#0F172A]"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F1F5F9] text-[#0F172A] rounded-full text-xs font-sans font-bold uppercase tracking-wider mb-4 border border-black/[0.04]">
                <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                <span>STÜDYO TURNİKE & GİRİŞ KARTI</span>
              </div>

              <h4 className="text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                {user.fullName}
              </h4>
              <p className="text-xs font-sans text-[#64748B] mt-1 mb-6">
                ÜYE NO: <span className="font-bold text-[#0F172A]">{user.memberNo}</span>
              </p>

              {/* High Contrast QR Box */}
              <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-3xl border-2 border-[#0F172A] shadow-lg flex flex-col items-center justify-center">
                <div className="w-full h-full p-2 flex flex-col items-center justify-center bg-white">
                  <QrCode className="w-36 h-36 text-[#0F172A]" />
                  <span className="font-sans text-[10px] font-black tracking-widest text-[#0F172A] mt-1">
                    {user.memberNo}
                  </span>
                </div>
                <div className="absolute -bottom-3 bg-[#0F172A] text-white px-4 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider shadow">
                  GİRİŞTE OKUTUNUZ
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-black/[0.06] text-xs font-sans text-[#64748B] space-y-1">
                <p>Nişantaşı Private Studio Resepsiyon Turnikesi</p>
                <p className="text-[#10B981] font-bold text-sm">
                  Aktif Bakiye: {remainingSessions} Seans
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
