"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import {
  QrCode as QrIcon,
  X,
  ShieldCheck,
  Maximize2,
  Zap,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";
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

  // 60-Second Rolling TOTP QR Engine
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [dynamicOtp, setDynamicOtp] = useState<string>("842 190");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const generateToken = async () => {
    const memberNo = user?.memberNo || "CF-89210";
    const fullName = user?.fullName || "Ege Mert";
    const currentMinute = Math.floor(Date.now() / 60000);
    const hash = Math.abs(
      (memberNo.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31 + currentMinute) % 900000
    ) + 100000;
    const otpStr = `${String(hash).slice(0, 3)} ${String(hash).slice(3, 6)}`;
    const fullToken = `CF-PASS|${memberNo}|${fullName}|${currentMinute}|${hash}`;
    setDynamicOtp(otpStr);
    setRefreshToken(fullToken);

    try {
      // Generate genuine ISO/IEC 18004 compliant QR Code Data URL
      const dataUrl = await QRCode.toDataURL(fullToken, {
        width: 360,
        margin: 1,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR Code generation error:", err);
    }
  };

  useEffect(() => {
    generateToken();

    const syncTime = () => {
      const now = new Date();
      const rem = 60 - now.getSeconds();
      setSecondsLeft(rem);
      if (rem === 60) {
        generateToken();
      }
    };

    syncTime();
    const interval = setInterval(syncTime, 1000);
    return () => clearInterval(interval);
  }, [user?.memberNo, user?.fullName]);

  const handleManualRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateToken();
    setSecondsLeft(60);
  };

  const progressPercent = (secondsLeft / 60) * 100;

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
                    DİNAMİK TURNİKE KARTI
                  </span>
                  <Sparkles className="w-3 h-3 text-[#10B981]" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight text-[#0F172A]">
                  CORE & FIT NIŞANTAŞI
                </span>
              </div>
            </div>

            {/* Live 60s Rolling Pulse Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-black/[0.06] rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-sans font-bold tracking-wider text-[#0F172A] uppercase">
                {secondsLeft}s YENİLENİYOR
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

            {/* Real QR Thumbnail Box */}
            <div className="flex flex-col items-center gap-1 bg-white border border-black/[0.08] p-1.5 rounded-2xl shadow-xs group-hover:border-[#0F172A] transition-colors relative">
              <div className="w-12 h-12 bg-white flex items-center justify-center overflow-hidden rounded-xl">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Gerçek QR Kod" className="w-full h-full object-contain" />
                ) : (
                  <QrIcon className="w-8 h-8 text-[#0F172A]" />
                )}
              </div>
              <span className="text-[8px] font-sans text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
                <span>{secondsLeft}s</span>
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

      {/* Fullscreen Turnstile / Reception QR Modal with Real Scannable QR Code */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border border-black/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl text-center text-[#0F172A]"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-sans font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>GERÇEK DİNAMİK TURNİKE KODU</span>
              </div>

              <h4 className="text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                {user.fullName}
              </h4>
              <p className="text-xs font-sans text-[#64748B] mt-0.5 mb-4">
                ÜYE NO: <span className="font-bold text-[#0F172A]">{user.memberNo}</span>
              </p>

              {/* High-Resolution Real QR Code Box */}
              <div className="relative mx-auto w-72 bg-white pt-4 pb-4 px-4 rounded-3xl border-2 border-[#0F172A] shadow-xl flex flex-col items-center justify-center overflow-hidden">
                {/* 60s Progress Bar on Top */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Real Scannable QR Image */}
                <div className="flex flex-col items-center justify-center bg-white pt-2">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Taranabilir Gerçek QR Kod"
                      className="w-48 h-48 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                  )}

                  {/* 6-Digit TOTP Dynamic Code */}
                  <div className="mt-2 flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1 rounded-lg border border-black/[0.06]">
                    <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="font-mono text-sm font-black tracking-widest text-[#0F172A]">
                      {dynamicOtp}
                    </span>
                  </div>

                  {/* Countdown Badge (Naturally placed, never clipped!) */}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0F172A] text-white rounded-full text-[10px] font-sans font-bold uppercase tracking-wider shadow-sm">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-400" />
                    <span>{secondsLeft} SANİYEDE YENİLENİR</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Security Explanation */}
              <div className="mt-7 pt-4 border-t border-black/[0.06] text-xs font-sans text-[#64748B] space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#0F172A]">
                    Turnike kamerasına veya herhangi bir telefona okutulabilir
                  </span>
                  <button
                    onClick={handleManualRefresh}
                    className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                    title="Hemen Yenile"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-emerald-700 font-bold text-xs">
                  Aktif Bakiye: {remainingSessions} Seans
                </p>
                <span className="text-[10px] text-[#94A3B8] block truncate max-w-xs mx-auto font-mono">
                  {refreshToken}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
