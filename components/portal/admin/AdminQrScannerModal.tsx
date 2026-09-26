"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import jsQR from "jsqr";
import {
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Zap,
  Volume2,
  VolumeX,
  Upload,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

interface AdminQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminQrScannerModal: React.FC<AdminQrScannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { adminCheckIn } = useMember();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  const [scanResult, setScanResult] = useState<{
    status: "success" | "error";
    memberName: string;
    memberNo: string;
    message: string;
    time: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play synthesized electronic turnstile chime
  const playTurnstileSound = (type: "success" | "error") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
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

  const processingRef = useRef(false);

  // QR içeriğinden üye numarasını çıkarır ve girişi sunucuda işler (bakiye kontrolü sunucuda yapılır).
  const handleDecodedData = async (decodedString: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessingScan(true);

    // Biçim: CF-PASS|<üye no>|<ad>|<dakika>|<özet> veya yalnızca üye numarası
    let memberNo = "";
    let memberName = "";
    if (decodedString.includes("|")) {
      const parts = decodedString.split("|");
      memberNo = parts[1] || "";
      memberName = parts[2] || "";
    } else {
      memberNo = decodedString.match(/CF-\d+/)?.[0] ?? "";
    }

    const res = memberNo ? await adminCheckIn(memberNo) : { ok: false as const, error: "QR kodu okunamadı." };
    playTurnstileSound(res.ok ? "success" : "error");
    setScanResult({
      status: res.ok ? "success" : "error",
      memberName,
      memberNo,
      message: res.ok ? res.message ?? "Giriş onaylandı." : res.error,
      time: new Date().toLocaleTimeString("tr-TR"),
    });

    setTimeout(() => {
      setScanResult(null);
      setIsProcessingScan(false);
      processingRef.current = false;
    }, 3500);
  };

  // Kamera döngüsü her zaman en güncel işleyiciyi çağırır.
  const decodeRef = useRef(handleDecodedData);
  useEffect(() => {
    decodeRef.current = handleDecodedData;
  });

  // Modal açıkken kamerayı başlatır, kapanınca akışı durdurur. "Tekrar Dene" cameraAttempt'i artırır.
  const [cameraAttempt, setCameraAttempt] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && !processingRef.current && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          if (code?.data?.trim()) void decodeRef.current(code.data);
        }
      }
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
        }
        setCameraError(null);
        setCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      } catch (err) {
        if (cancelled) return;
        setCameraActive(false);
        setCameraError(
          err instanceof Error && err.message === "unsupported"
            ? "Tarayıcınız kamera akışını desteklemiyor."
            : err instanceof DOMException && err.name === "NotAllowedError"
              ? "Kamera erişim izni verilmedi. Tarayıcı izinlerinden kamerayı aktif edebilir veya görsel yükleyebilirsiniz."
              : "Kamera bulunamadı veya başka bir uygulama tarafından kullanılıyor."
        );
      }
    };

    void startCamera();
    return () => {
      cancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    };
  }, [isOpen, cameraAttempt]);

  // Decode QR from uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleDecodedData(code.data);
        } else {
          alert("Görselde geçerli bir QR kod tespit edilemedi. Lütfen daha net bir fotoğraf deneyin.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#0B131E] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl text-white overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight text-white flex items-center gap-1.5">
                <span>Canlı Optik QR Okuyucu</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-400">jsQR Optik Tarayıcı & Turnike Otomasyonu</p>
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
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
          />

          {!cameraActive && (
            <div className="text-center space-y-2 p-6 z-10">
              <Camera className="w-10 h-10 text-slate-500 mx-auto animate-pulse" />
              <p className="text-xs text-slate-300 font-medium">
                {cameraError || "Kamera akışı başlatılıyor..."}
              </p>
              <p className="text-[11px] text-slate-500">
                Aşağıdaki butonlarla kamerayı açabilir, fotoğraf yükleyebilir veya test edebilirsiniz.
              </p>
            </div>
          )}

          {/* Scanner Optical Reticle */}
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
                duration: 2.0,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)]"
            />

            <span className="absolute bottom-2 text-[9px] text-emerald-400 font-mono font-bold tracking-wider bg-black/75 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
              {isProcessingScan ? "KOD DOĞRULANIYOR..." : "GERÇEK QR KODU HİZALAYIN"}
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
                    ? "bg-emerald-950/95 text-white"
                    : "bg-rose-950/95 text-white"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-lg ${
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

                <h4 className="text-lg font-bold uppercase tracking-tight">
                  {scanResult.message}
                </h4>

                <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/10 w-full space-y-1 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Üye:</span>
                    <span className="font-bold">{scanResult.memberName} ({scanResult.memberNo})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Giriş Saati:</span>
                    <span className="font-mono">{scanResult.time}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-300 mt-2">
                  Turnike kapısı 3 saniye sonra otomatik kilitlenecektir.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="mt-3.5 space-y-2">
          {/* File Upload for QR Screenshot */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>QR Fotoğrafı Yükle</span>
            </button>

            <button
              type="button"
              onClick={() => setCameraAttempt((n) => n + 1)}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>Kamerayı Yenile</span>
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 leading-relaxed">
            Üyenin paneldeki QR kodunu kameraya tutun veya fotoğrafını yükleyin. Bugün onaylı randevusu varsa tamamlanır, yoksa 1 ders düşülür.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
