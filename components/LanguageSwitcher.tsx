"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import Script from "next/script";
import { cn } from "@/lib/utils";

// Dil listesi ve bayrak kodları (flagcdn.com yüksek çözünürlüklü SVG destekli)
export const LANGUAGES = [
  { code: "tr", label: "TR", title: "Türkçe", flag: "tr" },
  { code: "en", label: "EN", title: "English", flag: "gb" },
  { code: "de", label: "DE", title: "Deutsch", flag: "de" },
  { code: "fr", label: "FR", title: "Français", flag: "fr" },
  { code: "ru", label: "RU", title: "Русский", flag: "ru" },
  { code: "ar", label: "AR", title: "العربية", flag: "sa" },
];

export interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "compact" | "drawer";
  hideScripts?: boolean;
}

export default function LanguageSwitcher({
  className,
  variant = "default",
  hideScripts = false,
}: LanguageSwitcherProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("tr");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut çeviri çerezini kontrol et
    const match = document.cookie.match(/googtrans=\/tr\/([a-z]{2})/);
    if (match && match[1]) {
      setActiveLang(match[1]);
    }
  }, []);

  // Dropdown dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownOpen]);

  const handleLanguageChange = (lang: string) => {
    setActiveLang(lang);
    setLangDropdownOpen(false);

    const hostname = window.location.hostname;

    // Çerez temizleme fonksiyonu
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      if (hostname && hostname !== "localhost") {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      }
    };

    if (lang === "tr") {
      deleteCookie("googtrans");
      document.cookie = `googtrans=/tr/tr; path=/;`;
      if (hostname && hostname !== "localhost") {
        document.cookie = `googtrans=/tr/tr; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/tr/tr; path=/; domain=.${hostname};`;
      }
    } else {
      document.cookie = `googtrans=/tr/${lang}; path=/;`;
      if (hostname && hostname !== "localhost") {
        document.cookie = `googtrans=/tr/${lang}; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/tr/${lang}; path=/; domain=.${hostname};`;
      }
    }

    // Google Translate çevirisinin anında uygulanması için sayfayı yenile
    window.location.reload();
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === activeLang) || LANGUAGES[0];

  // Mobil Drawer İçinde Yatay Izgara Görünümü
  if (variant === "drawer") {
    return (
      <div className={cn("w-full space-y-2", className)}>
        <div className="flex items-center justify-between text-[11px] font-mono text-[#72757C] uppercase tracking-wider mb-2">
          <span>DİL SEÇİMİ / LANGUAGE</span>
          <span className="text-[#E8FF36] font-bold">{currentLangObj.title}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => {
            const isActive = activeLang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleLanguageChange(l.code)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 px-2 border text-xs font-mono tracking-wider transition-all",
                  isActive
                    ? "bg-[#E8FF36] text-[#08090B] font-bold border-[#E8FF36] shadow-sm"
                    : "bg-[#131519] border-[#23272F] text-[#A5A7AD] hover:text-white hover:border-[#343A46]"
                )}
              >
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-black/20 shadow-sm">
                  <img
                    src={`https://flagcdn.com/${l.flag}.svg`}
                    alt={l.code}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={dropdownRef} className={cn("relative z-50 shrink-0", className)}>
        {/* Ana Dil Seçim Butonu */}
        <button
          type="button"
          onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          aria-expanded={langDropdownOpen}
          aria-label="Dil Değiştir / Select Language"
          className={cn(
            "group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider transition-all select-none",
            variant === "compact"
              ? "p-2 border border-[#23272F] bg-[#0D0F12] text-[#A5A7AD] hover:text-white"
              : "px-2.5 py-2 border border-[#23272F] bg-[#0D0F12] text-[#A5A7AD] hover:text-white hover:border-[#343A46]"
          )}
        >
          {/* Yüksek Çözünürlüklü Dairesel Bayrak */}
          <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20 dark:border-white/10 shrink-0 shadow-sm bg-[#191B20]">
            <img
              src={`https://flagcdn.com/${currentLangObj.flag}.svg`}
              alt={currentLangObj.label}
              className="w-full h-full object-cover"
            />
          </div>

          <span className="font-bold text-[11px] tracking-wider text-white">
            {currentLangObj.label}
          </span>

          <ChevronDown
            className={cn(
              "w-3 h-3 text-[#72757C] transition-transform duration-200 group-hover:text-white",
              langDropdownOpen && "rotate-180 text-[#E8FF36]"
            )}
          />
        </button>

        {/* Lüks Açılır Menü (Dropdown) */}
        <AnimatePresence>
          {langDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 bg-[#0D0F12] border border-[#23272F] shadow-2xl overflow-hidden w-40 flex flex-col py-1 z-50 backdrop-blur-md"
            >
              <div className="px-3 py-1.5 border-b border-[#191B20] text-[9px] font-mono text-[#72757C] uppercase tracking-widest">
                DİL SEÇİNİZ
              </div>

              {LANGUAGES.map((l) => {
                const isActive = activeLang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageChange(l.code)}
                    className={cn(
                      "px-3 py-2 text-xs tracking-wider uppercase font-mono flex items-center justify-between w-full text-left transition-colors",
                      isActive
                        ? "bg-[#131519] text-[#E8FF36] font-bold border-l-2 border-[#E8FF36]"
                        : "text-[#A5A7AD] hover:bg-[#16191E] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/10 shadow-sm bg-[#191B20]">
                        <img
                          src={`https://flagcdn.com/${l.flag}.svg`}
                          alt={l.code}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[11px]">{l.title}</span>
                    </div>

                    {isActive && <Check className="w-3.5 h-3.5 text-[#E8FF36]" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Google Translate Entegrasyon Kodları & Güvenli Stil Katmanı */}
      {!hideScripts && (
        <>
          <div id="google_translate_element" style={{ display: "none" }} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            /* Google Translate varsayılan çirkin banner ve tooltip elemanlarını tamamen gizle */
            body { top: 0 !important; position: static !important; }
            .skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame { display: none !important; visibility: hidden !important; }
            .goog-tooltip, .goog-tooltip:hover { display: none !important; }
            .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
            .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-aZ2wEe-OiiCO, .VIpgJd-ZVi9od-OR94Gd-PR6Dhf { display: none !important; }
            #google_translate_element { display: none !important; }
          `,
            }}
          />
          <Script
            id="google-translate-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                function googleTranslateElementInit() {
                  if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement({
                      pageLanguage: 'tr',
                      includedLanguages: 'tr,en,de,fr,ru,ar',
                      autoDisplay: false
                    }, 'google_translate_element');
                  }
                }
              `,
            }}
          />
          <Script
            id="google-translate-cdn"
            src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
          />
        </>
      )}
    </>
  );
}
