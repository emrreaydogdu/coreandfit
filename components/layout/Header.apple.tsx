"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Menu, X, MessageSquare, Phone, ChevronRight, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DesignThemeSwitcher } from "@/components/ui/DesignThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useMember } from "@/context/MemberContext";

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "1:1 Seanslar", href: "/personal-training" },
  { label: "Programlar", href: "/antrenman" },
  { label: "Süreç", href: "/#sistemimiz" },
  { label: "Paketler", href: "/paketler" },
  { label: "İlker Yüksel", href: "/koclar/ilker-yuksel" },
  { label: "Deneyimler", href: "/basari-hikayeleri" },
  { label: "Stüdyo", href: "/studio" },
  { label: "İletişim", href: "/iletisim" },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, remainingSessions } = useMember();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-mobile-menu", "open");
      document.body.classList.add("mobile-menu-open");
      window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: true }));
    } else {
      document.body.style.overflow = "unset";
      document.body.removeAttribute("data-mobile-menu");
      document.body.classList.remove("mobile-menu-open");
      window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: false }));
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.removeAttribute("data-mobile-menu");
      document.body.classList.remove("mobile-menu-open");
      window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: false }));
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Floating Apple VisionOS Liquid Glass Island Header */}
      <header
        className={cn(
          "fixed top-12 sm:top-14 left-0 right-0 z-50 transition-all duration-500 ease-out px-4 sm:px-6 pointer-events-none",
          isScrolled ? "translate-y-[-6px]" : "translate-y-0"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto liquid-glass-panel rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300">
          {/* Brand Monogram & Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group select-none"
            aria-label="Core & Fit Ana Sayfa"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-white/10 text-emerald-700 dark:text-white border border-emerald-500/20 dark:border-white/15 flex items-center justify-center font-bold text-xs tracking-tighter shadow-xs group-hover:scale-105 transition-transform">
              CF
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  CORE & FIT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Nişantaşı Private Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Ana Menü"
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1 rounded-full liquid-glass-pill"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 select-none",
                    isActive
                      ? "bg-white dark:bg-white/[0.18] text-slate-900 dark:text-white font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/10 scale-[1.02]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-medium"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls & CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <DesignThemeSwitcher variant="inline" />
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Member Portal Status Pill */}
            {user ? (
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 liquid-glass-pill text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-semibold hover:scale-102 active:scale-98 transition-all"
                title="Üye Paneli"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{user.fullName.split(" ")[0]}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ({remainingSessions} Hak)
                </span>
              </Link>
            ) : (
              <Link
                href="/portal/giris"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 liquid-glass-pill text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-full text-xs font-medium transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Giriş Yap</span>
              </Link>
            )}

            {/* Apple Liquid Glass Primary CTA */}
            <Link
              href="/on-gorusme"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-4.5 py-2 rounded-full liquid-glass-btn-emerald text-white select-none shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.35)]"
            >
              <span>Ön Görüşme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Tablet Controls */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <Link
              href={user ? "/portal" : "/portal/giris"}
              className="p-2 rounded-full liquid-glass-pill text-slate-800 dark:text-slate-200"
              aria-label="Üye Paneli"
            >
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </Link>

            <LanguageSwitcher variant="compact" hideScripts />
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full liquid-glass-pill text-slate-800 dark:text-slate-200 focus:outline-none"
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer with Apple Liquid Glass Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-3xl flex flex-col pt-32 pb-8 px-6 overflow-y-auto lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-1 liquid-glass-panel rounded-3xl p-5 mb-4 shadow-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 mb-1">
              Sayfalar
            </span>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between py-3 px-3.5 text-sm rounded-xl transition-all",
                    isActive
                      ? "bg-white dark:bg-white/[0.18] text-slate-900 dark:text-white font-bold shadow-xs border border-black/[0.06] dark:border-white/10"
                      : "text-slate-700 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-medium"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            {user ? (
              <Link
                href="/portal"
                className="w-full flex items-center justify-between p-4 liquid-glass-card rounded-2xl text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500">Üye Portalı & Seanslar</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  {remainingSessions} Seans →
                </span>
              </Link>
            ) : (
              <Link
                href="/portal/giris"
                className="w-full flex items-center justify-center gap-2 p-3.5 liquid-glass-card rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Üye Girişi / Mobil Panel</span>
              </Link>
            )}

            <DesignThemeSwitcher variant="drawer" />
            <LanguageSwitcher variant="drawer" hideScripts className="mb-1" />
            <ThemeToggle variant="drawer" className="mb-1" />

            <Link
              href="/on-gorusme"
              className="w-full flex items-center justify-center py-3.5 rounded-full liquid-glass-btn-emerald text-white font-semibold text-xs text-center shadow-md"
            >
              Ön Görüşme Randevusu Al
            </Link>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <a
                href={BUSINESS_CONFIG.phoneTel}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl liquid-glass-card text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Hemen Ara
              </a>
              <a
                href={buildQuickChatWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl liquid-glass-pill text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
