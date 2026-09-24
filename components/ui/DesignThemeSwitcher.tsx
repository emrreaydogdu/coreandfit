"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { cn } from "@/lib/utils";
import { Sparkles, Zap } from "lucide-react";

interface DesignThemeSwitcherProps {
  className?: string;
  variant?: "floating-bar" | "inline" | "drawer";
}

export const DesignThemeSwitcher: React.FC<DesignThemeSwitcherProps> = ({
  className,
  variant = "floating-bar",
}) => {
  const { designMode, setDesignMode, mounted } = useDesignMode();
  const pathname = usePathname();

  // Müşteri paneli ve admin kısımlarında tema seçici butonunu gizle
  if (!mounted || pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  const isApple = designMode === "apple";

  // Cam temada tema seçimi header'daki "Görünüm" panelinde; yüzen çubuk yalnızca orijinal temada görünür
  if (variant === "floating-bar" && isApple) {
    return null;
  }

  if (variant === "drawer") {
    return (
      <div className={cn("w-full p-3 rounded-2xl liquid-glass-card mb-2", className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Canlı Tasarım Teması
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
            {isApple ? "CAM TEMA" : "ORİJİNAL TEMA"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/[0.04] dark:bg-black/40">
          <button
            onClick={() => setDesignMode("apple")}
            className={cn(
              "py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
              isApple
                ? "bg-white text-slate-900 shadow-sm border border-black/[0.06]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Cam Tema</span>
          </button>
          <button
            onClick={() => setDesignMode("classic")}
            className={cn(
              "py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
              !isApple
                ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Orijinal Tema</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-1 rounded-full liquid-glass-pill shrink-0 text-xs shadow-inner",
          className
        )}
      >
        <button
          onClick={() => setDesignMode("apple")}
          className={cn(
            "px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-200",
            isApple
              ? "bg-white dark:bg-white/[0.18] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/10 scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Cam Tema"
        >
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <span>Cam Tema</span>
        </button>
        <button
          onClick={() => setDesignMode("classic")}
          className={cn(
            "px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-200",
            !isApple
              ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-sm scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Orijinal Tema"
        >
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Orijinal Tema</span>
        </button>
      </div>
    );
  }

  // Floating top capsule with VisionOS liquid glass
  return (
    <div
      className={cn(
        "theme-switcher-floating fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-glass-panel text-xs select-none transition-all duration-300 shadow-lg",
        className
      )}
    >
      <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-black/[0.08] dark:border-white/[0.1]">
        <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          TEMA:
        </span>
      </div>

      <div className="flex items-center p-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] gap-1">
        <button
          onClick={() => setDesignMode("apple")}
          className={cn(
            "px-3 sm:px-3.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-200",
            isApple
              ? "bg-white dark:bg-white/[0.18] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/10 scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Cam Tema"
        >
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <span>Cam Tema</span>
        </button>

        <button
          onClick={() => setDesignMode("classic")}
          className={cn(
            "px-3 sm:px-3.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-200",
            !isApple
              ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-sm scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Orijinal Tema"
        >
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Orijinal Tema</span>
        </button>
      </div>
    </div>
  );
};
