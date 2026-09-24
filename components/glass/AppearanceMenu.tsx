"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Check } from "lucide-react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { LANGUAGES, applyLanguage, readActiveLanguage } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

interface SegmentOption<T extends string> {
  value: T;
  label: string;
  swatch: React.ReactNode;
}

function Segment<T extends string>({
  options,
  value,
  onChange,
  groupId,
  label,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  groupId: string;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[var(--cg-hair)]">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "cg-focus relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-500",
              active ? "cg-ink" : "cg-ink-3 hover:text-[var(--cg-ink)]"
            )}
          >
            {active && (
              <motion.span
                layoutId={`${groupId}-pill`}
                className="absolute inset-0 rounded-xl bg-[var(--cg-glass-strong)] shadow-[0_0_0_1px_var(--cg-edge),0_6px_16px_-8px_rgba(16,60,45,0.35)]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative shrink-0">{opt.swatch}</span>
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Tema, mod ve dil ayarlarını tek bir cam panelde toplar. */
function AppearancePanel() {
  const { designMode, setDesignMode } = useDesignMode();
  const { theme, setTheme } = useTheme();
  // Panel yalnızca istemcide render edilir; çerezi ilk render'da okumak güvenli
  const [lang, setLang] = useState(() => (typeof document === "undefined" ? "tr" : readActiveLanguage()));
  const uid = useId();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="cg-label mb-2.5">Tasarım teması</p>
        <Segment
          label="Tasarım teması"
          groupId={`${uid}-design`}
          value={designMode}
          onChange={setDesignMode}
          options={[
            {
              value: "apple",
              label: "Cam",
              swatch: (
                <span className="block w-5 h-5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#a7f3d0_45%,#10b981)] ring-1 ring-black/10" />
              ),
            },
            {
              value: "classic",
              label: "Orijinal",
              swatch: (
                <span className="flex w-5 h-5 rounded-full bg-[#08090B] ring-1 ring-black/10 items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#E8FF36]" />
                </span>
              ),
            },
          ]}
        />
      </div>

      <div>
        <p className="cg-label mb-2.5">Görünüm modu</p>
        <Segment
          label="Görünüm modu"
          groupId={`${uid}-mode`}
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: "Açık", swatch: <Sun className="w-4 h-4" strokeWidth={1.75} /> },
            { value: "dark", label: "Koyu", swatch: <Moon className="w-4 h-4" strokeWidth={1.75} /> },
          ]}
        />
      </div>

      <div>
        <p className="cg-label mb-2.5">Dil / Language</p>
        <div className="grid grid-cols-3 gap-1.5">
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  if (active) return;
                  setLang(l.code);
                  applyLanguage(l.code);
                }}
                aria-pressed={active}
                title={l.title}
                className={cn(
                  "cg-focus flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-semibold transition-colors duration-500",
                  active
                    ? "bg-[var(--cg-accent-soft)] cg-accent shadow-[inset_0_0_0_1px_var(--cg-accent)]"
                    : "bg-[var(--cg-hair)] cg-ink-2 hover:text-[var(--cg-ink)]"
                )}
              >
                <img
                  src={`https://flagcdn.com/${l.flag}.svg`}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover ring-1 ring-black/10"
                  loading="lazy"
                />
                {l.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface AppearanceMenuProps {
  /** "popover": header/footer'da açılır buton. "panel": mobil menü içinde satır içi. */
  variant?: "popover" | "panel";
  placement?: "bottom" | "top";
  align?: "left" | "right";
  showLabel?: boolean;
  className?: string;
  /** Açılır panelin konumunu ince ayarlamak için (ör. mobilde header kenarına hizalama). */
  panelClassName?: string;
}

export const AppearanceMenu: React.FC<AppearanceMenuProps> = ({
  variant = "popover",
  placement = "bottom",
  align = "right",
  showLabel = false,
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
      <div className={cn("cg-shell rounded-[1.75rem]", className)}>
        <div className="cg-core cg-core-strong rounded-[calc(1.75rem-6px)] p-4">{mounted && <AppearancePanel />}</div>
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
          "cg-focus inline-flex items-center gap-2 h-10 rounded-full transition-colors duration-500",
          showLabel ? "pl-1.5 pr-3.5" : "w-10 justify-center",
          open ? "bg-[var(--cg-accent-soft)]" : "hover:bg-[var(--cg-accent-soft)]"
        )}
      >
        {/* İkon: yarısı cam, yarısı gece; tema/mod ayarını simgeler */}
        <span className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-[var(--cg-hair)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff,#a7f3d0_50%,#10b981)]" />
          <span className="absolute inset-y-0 right-0 w-1/2 bg-[#0B1411] flex items-center justify-center">
            <Moon className="w-2.5 h-2.5 text-emerald-300" strokeWidth={2} />
          </span>
        </span>
        {showLabel && <span className="cg-ink-2 text-[12.5px] font-medium">Görünüm</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Görünüm ayarları"
            initial={{ opacity: 0, y: placement === "bottom" ? -8 : 8, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: placement === "bottom" ? -6 : 6, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cn(
              "absolute z-[90] w-[min(20rem,calc(100vw-1.5rem))]",
              align === "right" ? "right-0" : "left-0",
              placement === "bottom" ? "top-full mt-3" : "bottom-full mb-3",
              panelClassName
            )}
          >
            <div className="cg-shell cg-shell-lg">
              <div className="cg-core cg-core-solid p-5">
                <div className="flex items-center justify-between mb-5">
                  <p className="cg-ink text-[15px] font-semibold tracking-tight">Görünüm</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium cg-ink-3">
                    <Check className="w-3 h-3 cg-accent" strokeWidth={2} />
                    Otomatik kaydedilir
                  </span>
                </div>
                <AppearancePanel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
