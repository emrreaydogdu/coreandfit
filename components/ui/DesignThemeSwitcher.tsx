"use client";

import React from "react";
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

  if (!mounted) {
    return null;
  }

  const isApple = designMode === "apple";

  if (variant === "drawer") {
    return (
      <div className={cn("w-full p-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] mb-2", className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Canlı Tasarım Teması
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            {isApple ? "APPLE" : "ORİJİNAL"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/[0.04] dark:bg-black/40">
          <button
            onClick={() => setDesignMode("apple")}
            className={cn(
              "py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
              isApple
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-white"
            )}
          >
            <span>🍏 Apple</span>
          </button>
          <button
            onClick={() => setDesignMode("classic")}
            className={cn(
              "py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
              !isApple
                ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-white"
            )}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Orijinal</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] backdrop-blur-xl shrink-0 text-xs shadow-inner",
          className
        )}
      >
        <button
          onClick={() => setDesignMode("apple")}
          className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all duration-200",
            isApple
              ? "bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Apple Cupertino Teması"
        >
          <span>🍏 Apple</span>
        </button>
        <button
          onClick={() => setDesignMode("classic")}
          className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all duration-200",
            !isApple
              ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Orijinal Atletik Tema"
        >
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Orijinal</span>
        </button>
      </div>
    );
  }

  // Default: Floating top capsule pill
  return (
    <div
      className={cn(
        "fixed top-2 sm:top-2.5 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-[#121214]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.15] shadow-[0_10px_35px_rgba(0,0,0,0.15)] text-xs select-none transition-all duration-300",
        className
      )}
    >
      <div className="hidden sm:flex items-center gap-1.5 pr-1 border-r border-black/[0.08] dark:border-white/[0.1]">
        <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          TEMA:
        </span>
      </div>

      <div className="flex items-center p-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] gap-1">
        <button
          onClick={() => setDesignMode("apple")}
          className={cn(
            "px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-200",
            isApple
              ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          <span>🍏 Apple Standartı</span>
        </button>

        <button
          onClick={() => setDesignMode("classic")}
          className={cn(
            "px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-200",
            !isApple
              ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-md scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          <Zap className="w-3 h-3 text-amber-500" />
          <span>⚡ Orijinal Atletik</span>
        </button>
      </div>
    </div>
  );
};
