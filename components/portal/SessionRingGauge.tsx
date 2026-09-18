"use client";

import React from "react";
import { motion } from "motion/react";
import { Flame, Plus, Calendar, CheckCircle2 } from "lucide-react";

interface SessionRingGaugeProps {
  remaining: number;
  total: number;
  expiryDate: string;
  onAddSessions: () => void;
}

export const SessionRingGauge: React.FC<SessionRingGaugeProps> = ({
  remaining,
  total,
  expiryDate,
  onAddSessions,
}) => {
  const safeTotal = Math.max(total, 1);
  const percentage = Math.min(Math.round((remaining / safeTotal) * 100), 100);
  const used = Math.max(0, total - remaining);

  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#E8FF36]/10 text-[#E8FF36]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase font-display text-white">
              SEANS BAKIYESİ & KULLANIM
            </h4>
            <span className="text-[10px] font-mono text-[#72757C] uppercase">
              1:1 PERSONAL TRAINING HAKLARI
            </span>
          </div>
        </div>

        <button
          onClick={onAddSessions}
          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#08090B] bg-[#E8FF36] hover:bg-[#D4EB2B] px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Paket Yükle</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Animated Circular Progress Gauge */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1F232B"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Dynamic Progress Ring */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#E8FF36"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          {/* Center Metric Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono text-white tracking-tighter leading-none">
              {remaining}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A5A7AD] mt-1">
              SEANS KALDI
            </span>
            <span className="text-[9px] font-mono text-[#E8FF36] font-bold mt-0.5">
              %{percentage} Kalan
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 w-full space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#131519] border border-[#23272F] rounded-xl">
            <span className="text-[#A5A7AD]">Tamamlanan Ders:</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
              {used} Seans
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#131519] border border-[#23272F] rounded-xl">
            <span className="text-[#A5A7AD]">Toplam Paket Kapasitesi:</span>
            <span className="font-bold text-white">{total} Seans</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#131519] border border-[#23272F] rounded-xl">
            <span className="text-[#A5A7AD]">Son Geçerlilik:</span>
            <span className="font-bold text-[#E8FF36] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {expiryDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
