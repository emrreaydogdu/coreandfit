"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, Sparkles, X, ShieldCheck, Maximize2, Zap } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1D24] via-[#0E1015] to-[#08090B] border border-[#2D3340] p-5 sm:p-6 shadow-2xl text-white group cursor-pointer"
        onClick={() => setShowQrModal(true)}
      >
        {/* Holographic metallic reflection shimmer */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#E8FF36]/10 blur-3xl pointer-events-none group-hover:bg-[#E8FF36]/20 transition-all duration-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
          {/* Top Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E8FF36] flex items-center justify-center font-mono font-black text-[#08090B] text-sm shadow-[0_0_12px_rgba(232,255,54,0.3)]">
                CF
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#E8FF36] uppercase block font-bold">
                  PRIVATE PASS
                </span>
                <span className="font-display font-bold text-sm tracking-wider text-white">
                  CORE & FIT NIŞANTAŞI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider text-white/80 uppercase">
                AKTİF ÜYE
              </span>
            </div>
          </div>

          {/* Center Info */}
          <div className="my-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#72757C] uppercase tracking-wider block mb-0.5">
                ÜYE ADI & STATÜ
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-white">
                {user.fullName}
              </h3>
              <p className="text-xs text-[#A5A7AD] font-mono mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8FF36]" />
                {user.membershipTier}
              </p>
            </div>

            {/* Quick QR Snapshot */}
            <div className="flex flex-col items-center gap-1 bg-[#131519] border border-[#23272F] p-2 rounded-xl group-hover:border-[#E8FF36]/60 transition-colors">
              <QrCode className="w-9 h-9 text-[#E8FF36]" />
              <span className="text-[8px] font-mono text-[#72757C] uppercase tracking-wider flex items-center gap-0.5">
                <span>DOKUN</span>
                <Maximize2 className="w-2 h-2" />
              </span>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[9px] text-[#72757C] uppercase block">ÜYE NO</span>
              <span className="text-white font-bold tracking-widest">{user.memberNo}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#72757C] uppercase block">KALAN SEANS</span>
              <span className="text-[#E8FF36] font-bold tracking-wider">
                {remainingSessions} DERS
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Turnstile / Reception QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#0D0F12] border border-[#23272F] rounded-3xl p-6 shadow-2xl text-center"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 text-[#A5A7AD] hover:text-white rounded-full bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8FF36]/10 border border-[#E8FF36]/30 text-[#E8FF36] rounded-full text-xs font-mono uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5" />
                STÜDYO GİRİŞ KARTI
              </div>

              <h4 className="text-xl font-bold font-display uppercase text-white">
                {user.fullName}
              </h4>
              <p className="text-xs font-mono text-[#72757C] mt-1 mb-6">
                ÜYE KODU: {user.memberNo}
              </p>

              {/* Large High-Contrast QR Box */}
              <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                <div className="w-full h-full border-4 border-[#08090B] p-2 flex flex-col items-center justify-center bg-white">
                  <QrCode className="w-36 h-36 text-black" />
                  <span className="font-mono text-[9px] font-black tracking-widest text-black mt-1">
                    {user.memberNo}
                  </span>
                </div>
                <div className="absolute -bottom-3 bg-[#E8FF36] text-[#08090B] px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow">
                  RESEPSİYONA OKUTUNUZ
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#191B20] text-xs font-mono text-[#A5A7AD] space-y-1">
                <p>Nişantaşı Private Studio Turnike Girişi</p>
                <p className="text-[#E8FF36] font-bold">Kalan Hak: {remainingSessions} Seans</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
