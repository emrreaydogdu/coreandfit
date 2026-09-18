"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Camera,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Zap,
  Volume2,
  VolumeX,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

interface AdminQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCoach?: string;
}

export const AdminQrScannerModal: React.FC<AdminQrScannerModalProps> = ({
  isOpen,
  onClose,
  defaultCoach = "Mert Aksoy",
}) => {
  const { user, remainingSessions, adminCheckInMember } = useMember();
  const [cameraActive, setCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error";
    memberName: string;
    memberNo: string;
    remaining: number;
    message: string;
    time: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play synthesized electronic turnstile chime
  const playTurnstileSound = (type: "success" | "error") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        // High double-beep (turnstile unlock)
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        // Low error buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Start / Stop Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      return;
    }

    startCamera();
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      }
    } catch (err) {
      // Camera permission denied or not available (desktop webcam)
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Process Scanned QR
  const handleProcessScan = (memberNoToScan: string = "CF-89210") => {
    if (remainingSessions <= 0) {
      playTurnstileSound("error");
      setScanResult({
        status: "error",
        memberName: user?.fullName || "Ege Mert",
        memberNo: memberNoToScan,
        remaining: 0,
        message: "GEÇİŞ REDDEDİLDİ: Üyenin kalan seansı yok (0 Seans)!",
        time: new Date().toLocaleTimeString("tr-TR"),
      });
      return;
    }

    // Deduct 1 session automatically
    const res = adminCheckInMember({
      coachName: defaultCoach,
      sessionType: "1:1 Birebir Antrenman (Turnike Girişi)",
      performanceNote: "Turnike otomatik QR okuyucu ile giriş yapıldı.",
      keyMetric: "Otomatik Turnike Geçişi",
    });

    playTurnstileSound("success");
    setScanResult({
      status: "success",
      memberName: user?.fullName || "Ege Mert",
      memberNo: memberNoToScan,
      remaining: remainingSessions - 1,
      message: "TURNİKE AÇILDI • 1 SEANS DÜŞÜLDÜ",
      time: new Date().toLocaleTimeString("tr-TR"),
    });

    // Auto reset back to scanner after 3.5 seconds
    setTimeout(() => {
      setScanResult(null);
    }, 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#0B131E] border border-white/15 rounded-3xl p-6 shadow-2xl text-white overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight text-white">
                Otomatik Turnike QR Okuyucu
              </h3>
              <p className="text-[10px] text-slate-400">Kapı Giriş Sensörü & Kamera Terminali</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 transition-colors"
              title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Window */}
        <div className="relative aspect-square w-full rounded-2xl bg-black border border-white/10 overflow-hidden flex flex-col items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Digital HUD Target Overlay */
            <div className="absolute inset-0 bg-radial from-slate-900/60 to-black flex items-center justify-center">
              <div className="text-center space-y-2 p-4">
                <Camera className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400">Kamera aktif değil veya tarama modu hazır</p>
              </div>
            </div>
          )}

          {/* Scanner Optical Viewfinder Reticle */}
          <div className="relative z-10 w-56 h-56 border border-white/20 rounded-2xl flex items-center justify-center pointer-events-none">
            {/* 4 Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-xl" />

            {/* Animated Laser Scanning Line */}
            <motion.div
              animate={{
                y: [-90, 90, -90],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            />

            <span className="absolute bottom-2 text-[10px] text-emerald-400 font-mono font-bold tracking-wider bg-black/60 px-2 py-0.5 rounded-full border border-emerald-400/30">
              60s DİNAMİK QR BEKLENİYOR
            </span>
          </div>

          {/* Result Overlay (When Turnstile Triggers) */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md ${
                  scanResult.status === "success"
                    ? "bg-emerald-950/90 text-white"
                    : "bg-rose-950/90 text-white"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg ${
                    scanResult.status === "success"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {scanResult.status === "success" ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : (
                    <AlertCircle className="w-10 h-10" />
                  )}
                </div>

                <h4 className="text-xl font-bold uppercase tracking-tight">
                  {scanResult.message}
                </h4>

                <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/10 w-full space-y-1 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Üye:</span>
                    <span className="font-bold">{scanResult.memberName} ({scanResult.memberNo})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kalan Seans:</span>
                    <span className="font-bold text-emerald-400">{scanResult.remaining} Seans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saat:</span>
                    <span className="font-mono">{scanResult.time}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 mt-3">
                  Turnike kapısı 3 saniye sonra otomatik kilitlenecektir.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleProcessScan("CF-89210")}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
          >
            <QrCode className="w-4 h-4" />
            <span>Simüle Et: Üye QR'ını Okut (CF-89210)</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Üyenin ekranındaki 60 saniyelik dinamik kod okutulduğunda sistemden otomatik olarak 1 seans düşülür.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
