"use client";

import React from "react";
import { motion } from "motion/react";
import { Plus, Calendar, CheckCircle2, Activity, ArrowUpRight } from "lucide-react";

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

  const radius = 62;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] relative overflow-hidden text-[#0F172A]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-[#ECFDF5] text-[#10B981]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase font-display text-[#0F172A] tracking-tight">
              SEANS BAKIYESİ & İLERLEME
            </h4>
            <span className="text-[10px] font-mono text-[#64748B] uppercase">
              1:1 PERSONAL TRAINING HAKLARI
            </span>
          </div>
        </div>

        <button
          onClick={onAddSessions}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] px-3.5 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Paket Ekle</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Apple Fitness Activity Ring */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Activity Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Apple Activity Ring Dynamic Gradient */}
            <defs>
              <linearGradient id="appleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#appleRingGrad)"
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
            <span className="text-4xl font-black font-display text-[#0F172A] tracking-tighter leading-none">
              {remaining}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] mt-1">
              SEANS KALDI
            </span>
            <span className="text-[10px] font-bold text-[#10B981] mt-0.5 bg-[#ECFDF5] px-2 py-0.5 rounded-full">
              %{percentage} Kalan
            </span>
          </div>
        </div>

        {/* Breakdown Stats (Apple Health Style) */}
        <div className="flex-1 w-full space-y-2.5 font-sans text-xs">
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
            <span className="text-[#64748B] font-medium">Tamamlanan Seans:</span>
            <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              {used} Seans
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
            <span className="text-[#64748B] font-medium">Toplam Paket Kapasitesi:</span>
            <span className="font-bold text-[#0F172A]">{total} Seans</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
            <span className="text-[#64748B] font-medium">Son Geçerlilik:</span>
            <span className="font-bold text-[#2563EB] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {expiryDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
