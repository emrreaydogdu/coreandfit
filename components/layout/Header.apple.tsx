"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Menu, X, MessageSquare, Phone, ChevronRight, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DesignThemeSwitcher } from "@/components/ui/DesignThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useMember } from "@/context/MemberContext";

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "1:1 Kişisel Koçluk", href: "/personal-training" },
  { label: "Antrenman", href: "/antrenman" },
  { label: "Sistemimiz", href: "/#sistemimiz" },
  { label: "Paketler", href: "/paketler" },
  { label: "Kurucu Koç", href: "/koclar" },
  { label: "Başarı Hikayeleri", href: "/basari-hikayeleri" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
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

  // Portal ve Admin sayfalarında marketing header render edilmez
  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Floating Apple Liquid Glass Capsule Island */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div
          className={cn(
            "pointer-events-auto max-w-7xl mx-auto flex items-center justify-between rounded-full transition-all duration-300",
            "bg-white/85 dark:bg-[#121214]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
            isScrolled ? "py-2 sm:py-2.5 px-4 sm:px-6 scale-[0.99]" : "py-2.5 sm:py-3 px-4 sm:px-7"
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] flex items-center justify-center font-black text-xs tracking-tight shadow-2xs group-hover:scale-105 transition-transform">
              CF
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0F172A] dark:text-white uppercase leading-none font-sans">
                  CORE & FIT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse shrink-0" />
              </div>
              <span className="text-[9px] tracking-wider text-[#64748B] dark:text-[#86868B] uppercase font-medium mt-0.5">
                Nişantaşı Private Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 shrink-0 mx-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 tracking-tight whitespace-nowrap",
                    isActive
                      ? "bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold shadow-xs"
                      : "text-[#64748B] dark:text-[#A1A1A6] hover:text-[#0F172A] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Capsule */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <DesignThemeSwitcher variant="inline" />
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Member Portal Access */}
            {user ? (
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 rounded-full text-xs font-bold transition-all hover:scale-102 active:scale-98 shadow-2xs"
                title="Üye Paneline Geç"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{user.fullName.split(" ")[0]}</span>
                <span className="text-emerald-700 dark:text-emerald-400">({remainingSessions} Hak)</span>
              </Link>
            ) : (
              <Link
                href="/portal/giris"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] text-[#0F172A] dark:text-white rounded-full text-xs font-semibold transition-all shrink-0"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Giriş Yap</span>
              </Link>
            )}

            <Link
              href="/on-gorusme"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:bg-black dark:hover:bg-slate-100 px-4 py-2 rounded-full transition-all shadow-sm active:scale-98 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>1:1 Ön Görüşme</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls */}
          <div className="flex items-center gap-1.5 xl:hidden shrink-0">
            {/* Quick Member Icon */}
            <Link
              href={user ? "/portal" : "/portal/giris"}
              className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#0F172A] dark:text-white relative transition-colors"
              aria-label="Üye Paneli"
              title="Üye Paneli"
            >
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {user && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-black" />
              )}
            </Link>

            <LanguageSwitcher variant="compact" hideScripts />
            <ThemeToggle />

            <Link
              href="/on-gorusme"
              className="hidden sm:inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-wider bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-2xs"
            >
              Ön Görüşme
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0F172A] dark:text-white rounded-full bg-black/[0.04] dark:bg-white/[0.08] focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay - Apple Frosted Liquid Glass */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-3xl flex flex-col pt-24 pb-8 px-6 overflow-y-auto xl:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-1 border-b border-black/[0.06] dark:border-white/[0.1] pb-6 mb-6">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
              CORE & FIT NİŞANTAŞI
            </span>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between py-3 px-3 rounded-2xl text-sm uppercase tracking-wider font-semibold transition-all",
                    isActive
                      ? "bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold"
                      : "text-[#0F172A] dark:text-white/90 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            {/* Member Card in Mobile Drawer */}
            {user ? (
              <Link
                href="/portal"
                className="w-full flex items-center justify-between p-3.5 bg-[#F8FAFC] dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.1] rounded-2xl text-xs mb-1 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/40">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold block text-[#0F172A] dark:text-white">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-[#64748B]">Üye Paneli & Seanslarım</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  {remainingSessions} Seans →
                </span>
              </Link>
            ) : (
              <Link
                href="/portal/giris"
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-[#F8FAFC] dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.1] text-[#0F172A] dark:text-white text-xs font-bold uppercase tracking-wider rounded-2xl mb-1 shadow-2xs"
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
              className="w-full flex items-center justify-center py-3.5 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold text-xs uppercase tracking-wider text-center rounded-2xl shadow-md active:scale-98"
            >
              Ücretsiz Ön Görüşme Planla
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={BUSINESS_CONFIG.phoneTel}
                className="flex items-center justify-center gap-2 py-3 bg-[#F8FAFC] dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.1] text-[#0F172A] dark:text-white text-xs uppercase tracking-wider font-semibold rounded-2xl"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Hemen Ara
              </a>
              <a
                href={buildQuickChatWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider font-bold rounded-2xl"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
            </div>

            <p className="text-center text-[10px] text-[#64748B] dark:text-[#86868B] mt-2 font-medium">
              {BUSINESS_CONFIG.displayLocation} • {BUSINESS_CONFIG.phone}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
