"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill" | "drawer";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = "icon",
}) => {
  const { theme, toggleTheme, mounted } = useTheme();

  // If not mounted yet, render a neutral placeholder to prevent layout shift
  if (!mounted) {
    return (
      <button
        aria-label="Tema Değiştir"
        disabled
        className={cn(
          "inline-flex items-center justify-center p-2 border border-[#23272F] bg-[#0D0F12] text-[#72757C] opacity-50 shrink-0",
          className
        )}
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  const isLight = theme === "light";

  if (variant === "drawer") {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isLight ? "Koyu Temaya Geç" : "Açık Temaya Geç"}
        className={cn(
          "w-full flex items-center justify-between py-3 px-3.5 border border-[#23272F] bg-[#131519] text-xs font-mono uppercase tracking-wider transition-colors",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          {isLight ? (
            <Moon className="w-4 h-4 text-[#A5A7AD]" />
          ) : (
            <Sun className="w-4 h-4 text-[#E8FF36]" />
          )}
          <span>Görünüm Teması</span>
        </div>
        <span className="font-bold text-[#E8FF36] px-2 py-0.5 border border-[#23272F] bg-[#0D0F12]">
          {isLight ? "AÇIK" : "KOYU"}
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isLight ? "Koyu Temaya Geç" : "Açık Temaya Geç"}
        title={isLight ? "Koyu Temaya Geç" : "Açık Temaya Geç"}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 border border-[#23272F] bg-[#0D0F12] text-xs font-mono uppercase tracking-wider text-[#A5A7AD] hover:text-white transition-all shrink-0 select-none",
          className
        )}
      >
        {isLight ? (
          <>
            <Moon className="w-3.5 h-3.5 text-[#0A0D12]" />
            <span className="text-[10px]">Koyu</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-[#E8FF36]" />
            <span className="text-[10px]">Açık</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Koyu Temaya Geç" : "Açık Temaya Geç"}
      title={isLight ? "Koyu Temaya Geç" : "Açık Temaya Geç"}
      className={cn(
        "relative inline-flex items-center justify-center p-2 border border-[#23272F] bg-[#0D0F12] text-[#A5A7AD] hover:text-white transition-all shrink-0 group active:scale-95",
        isLight
          ? "hover:border-[#0A0D12] text-[#0A0D12]"
          : "hover:border-[#E8FF36] hover:text-[#E8FF36]",
        className
      )}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Moon className="w-4 h-4 text-[#0A0D12] transition-transform duration-300 rotate-0 scale-100 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-[#E8FF36] transition-transform duration-300 rotate-0 scale-100 group-hover:rotate-45" />
        )}
      </div>
    </button>
  );
};
