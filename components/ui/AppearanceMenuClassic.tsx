"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, ChevronDown } from "lucide-react";
import { useDesignMode, type DesignMode } from "@/components/providers/DesignModeProvider";
import { useTheme, type Theme } from "@/components/providers/ThemeProvider";
import { LANGUAGES, applyLanguage, readActiveLanguage } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

/*
 * Orijinal (athletic) tema için görünüm menüsü.
 * Renkler, globals.css'teki açık mod dönüşümlerinin tanıdığı koyu palet sınıflarıyla yazıldı
 * (#0D0F12, #131519, #23272F, #A5A7AD, #E8FF36); açık modda otomatik uyum sağlar.
 */

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 px-3 py-2.5 border text-[11px] font-mono font-bold uppercase tracking-wider transition-colors duration-150",
        active
          ? "bg-[#E8FF36] border-[#E8FF36] text-[#08090B]"
          : "bg-[#131519] border-[#23272F] text-[#A5A7AD] hover:text-white hover:border-[#343A46]"
      )}
    >
      {children}
    </button>
  );
}

function PanelLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[10px] font-mono font-bold text-[#E8FF36]">{index}</span>
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#72757C]">{children}</span>
      <span className="flex-1 h-px bg-[#23272F]" />
    </div>
  );
}

function ClassicAppearancePanel() {
  const { designMode, setDesignMode } = useDesignMode();
  const { theme, setTheme } = useTheme();
  // Panel yalnızca istemcide render edilir; çerezi ilk render'da okumak güvenli
  const [lang, setLang] = useState(() => (typeof document === "undefined" ? "tr" : readActiveLanguage()));

  const designs: { value: DesignMode; label: string; swatch: React.ReactNode }[] = [
    {
      value: "apple",
      label: "Cam",
      swatch: <span className="w-3 h-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#a7f3d0_45%,#10b981)] shrink-0" />,
    },
    {
      value: "classic",
      label: "Orijinal",
      swatch: <span className="w-3 h-3 bg-black border border-current shrink-0" />,
    },
  ];
  const modes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Açık", icon: <Sun className="w-3.5 h-3.5" /> },
    { value: "dark", label: "Koyu", icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <PanelLabel index="01">Tasarım teması</PanelLabel>
        <div role="radiogroup" aria-label="Tasarım teması" className="grid grid-cols-2 gap-1.5">
          {designs.map((d) => (
            <Choice key={d.value} active={designMode === d.value} onClick={() => setDesignMode(d.value)}>
              {d.swatch}
              {d.label}
            </Choice>
          ))}
        </div>
      </div>

      <div>
        <PanelLabel index="02">Görünüm modu</PanelLabel>
        <div role="radiogroup" aria-label="Görünüm modu" className="grid grid-cols-2 gap-1.5">
          {modes.map((m) => (
            <Choice key={m.value} active={theme === m.value} onClick={() => setTheme(m.value)}>
              {m.icon}
              {m.label}
            </Choice>
          ))}
        </div>
      </div>

      <div>
        <PanelLabel index="03">Dil / Language</PanelLabel>
        <div role="radiogroup" aria-label="Dil" className="grid grid-cols-3 gap-1.5">
          {LANGUAGES.map((l) => (
            <Choice
              key={l.code}
              active={lang === l.code}
              onClick={() => {
                if (lang === l.code) return;
                setLang(l.code);
                applyLanguage(l.code);
              }}
            >
              <img
                src={`https://flagcdn.com/${l.flag}.svg`}
                alt=""
                className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                loading="lazy"
              />
              {l.label}
            </Choice>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AppearanceMenuClassicProps {
  /** "popover": açılır buton. "panel": mobil menü içinde satır içi. */
  variant?: "popover" | "panel";
  placement?: "bottom" | "top";
  align?: "left" | "right";
  showLabel?: boolean;
  /** Etiket ve ok simgesine eklenecek sınıflar (ör. dar ekranda gizlemek için). */
  labelClassName?: string;
  className?: string;
  panelClassName?: string;
}

export const AppearanceMenuClassic: React.FC<AppearanceMenuClassicProps> = ({
  variant = "popover",
  placement = "bottom",
  align = "right",
  showLabel = true,
  labelClassName,
  className,
  panelClassName,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { mounted } = useDesignMode();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "panel") {
    return (
      <div className={cn("border border-[#23272F] bg-[#0D0F12] p-4", className)}>
        {mounted && <ClassicAppearancePanel />}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Görünüm ayarları: tema, mod ve dil"
        className={cn(
          "group inline-flex items-center gap-2 border bg-[#0D0F12] transition-colors duration-150 focus:outline-none focus-visible:border-[#E8FF36]",
          showLabel ? "px-3 py-2" : "p-2",
          open ? "border-[#E8FF36]" : "border-[#23272F] hover:border-[#343A46]"
        )}
      >
        {/* Simge: yarısı siyah, yarısı sarı kare; tema/mod ayarını temsil eder */}
        <span className="relative w-4 h-4 shrink-0 overflow-hidden border border-[#343A46]">
          <span className="absolute inset-y-0 left-0 w-1/2 bg-black" />
          <span className="absolute inset-y-0 right-0 w-1/2 bg-[#E8FF36]" />
        </span>
        {showLabel && (
          <>
            <span
              className={cn(
                "text-[11px] 2xl:text-xs font-mono font-bold uppercase tracking-wider text-[#A5A7AD] group-hover:text-white transition-colors",
                labelClassName
              )}
            >
              Görünüm
            </span>
            <ChevronDown
              className={cn(
                "w-3 h-3 text-[#72757C] transition-transform duration-200",
                open && "rotate-180 text-[#E8FF36]",
                labelClassName
              )}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Görünüm ayarları"
            initial={{ opacity: 0, y: placement === "bottom" ? -6 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === "bottom" ? -4 : 4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cn(
              "absolute z-[90] w-[min(19rem,calc(100vw-1.5rem))] bg-[#0D0F12] border border-[#23272F] shadow-2xl",
              align === "right" ? "right-0" : "left-0",
              placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
              panelClassName
            )}
          >
            {/* Üst şerit: sarı vurgu çizgisi */}
            <div className="h-[3px] bg-[#E8FF36]" />
            <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-[#191B20]">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">Görünüm</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#72757C]">Otomatik kaydedilir</span>
            </div>
            <div className="p-4">
              <ClassicAppearancePanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
