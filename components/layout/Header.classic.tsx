"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Menu, X, MessageSquare, Phone, ChevronRight, ChevronDown, User } from "lucide-react";
import { cn, lockBodyScroll, unlockBodyScroll } from "@/lib/utils";
import { AppearanceMenuClassic } from "@/components/ui/AppearanceMenuClassic";
import { GoogleTranslateScripts } from "@/components/LanguageSwitcher";
import { useMember } from "@/context/MemberContext";

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "1:1 Kişisel Koçluk", href: "/personal-training" },
  { label: "Antrenman", href: "/antrenman" },
  { label: "Sistemimiz", href: "/#sistemimiz" },
  { label: "Paketler", href: "/paketler" },
  { label: "Koçlar", href: "/koclar" },
  { label: "Başarı Hikayeleri", href: "/basari-hikayeleri", secondary: true },
  { label: "Hakkımızda", href: "/hakkimizda", secondary: true },
  { label: "Blog", href: "/blog", secondary: true },
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
    };
  }, [mobileMenuOpen]);

  // Portal ve Admin sayfalarında marketing header render edilmez
  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <GoogleTranslateScripts />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 transition-all duration-300",
          mobileMenuOpen ? "z-[80]" : "z-50",
          isScrolled
            ? "bg-white/95 dark:bg-[#08090B]/90 backdrop-blur-md border-b border-[#E2E4E9] dark:border-[#23272F]/80 py-3.5 shadow-sm dark:shadow-2xl"
            : "bg-transparent dark:bg-gradient-to-b dark:from-[#08090B]/90 dark:via-[#08090B]/60 dark:to-transparent py-5"
        )}
      >
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0 mr-4 lg:mr-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-white font-mono uppercase group-hover:text-[#E8FF36] transition-colors leading-none">
                  CORE & FIT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36] animate-pulse shrink-0" />
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#72757C] uppercase font-mono mt-1">
                PRIVATE SPORT STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-4 shrink-0">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] xl:text-[11.5px] 2xl:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 py-1.5 relative whitespace-nowrap shrink-0",
                    link.secondary && "hidden min-[1600px]:inline",
                    isActive
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#E8FF36]"
                      : "text-[#A5A7AD] hover:text-white"
                  )}
                >
                  {link.href === "/personal-training" ? (
                    <>
                      <span>1:1 </span>
                      <span className="hidden 2xl:inline">Kişisel </span>
                      <span>Koçluk</span>
                    </>
                  ) : (
                    link.label
                  )}
                </Link>
              );
            })}

            {/* 1600px altında ikincil linkler açılır menüde toplanır; hover ve klavye odağıyla açılır */}
            <div className="relative group min-[1600px]:hidden">
              <button
                type="button"
                aria-haspopup="true"
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] xl:text-[11.5px] 2xl:text-xs font-semibold uppercase tracking-wider py-1.5 whitespace-nowrap transition-colors",
                  NAV_LINKS.some((l) => l.secondary && l.href === pathname)
                    ? "text-white"
                    : "text-[#A5A7AD] hover:text-white group-focus-within:text-white"
                )}
              >
                Daha Fazla
                <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150">
                <div className="w-52 bg-[#0D0F12] border border-[#23272F] shadow-2xl">
                  <div className="h-[3px] bg-[#E8FF36]" />
                  {NAV_LINKS.filter((l) => l.secondary).map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 text-[11px] font-semibold uppercase tracking-wider border-b border-[#191B20] last:border-0 transition-colors",
                          isActive ? "text-[#E8FF36]" : "text-[#A5A7AD] hover:text-white hover:bg-[#131519]"
                        )}
                      >
                        {link.label}
                        <ChevronRight className="w-3.5 h-3.5 text-[#72757C]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 shrink-0 ml-4 2xl:ml-6">
            <AppearanceMenuClassic labelClassName="hidden 2xl:inline" />

            {/* Member Portal Quick Access */}
            {user ? (
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#131519] border border-[#E8FF36]/50 hover:border-[#E8FF36] text-white rounded-lg text-[11px] 2xl:text-xs font-mono transition-all group shrink-0 shadow-sm"
                title="Üye Paneline Geç"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                <User className="w-3.5 h-3.5 text-[#E8FF36] shrink-0" />
                <span className="font-bold hidden min-[1920px]:inline">{(user?.fullName || "Ege").split(" ")[0]}</span>
                <span className="text-[#E8FF36] font-bold whitespace-nowrap">{remainingSessions} Seans</span>
              </Link>
            ) : (
              <Link
                href="/portal/giris"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#131519] border border-[#23272F] hover:border-[#343A46] text-[#A5A7AD] hover:text-white rounded-lg text-[11px] 2xl:text-xs font-mono transition-all shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#E8FF36]" />
                <span>Üye Girişi</span>
              </Link>
            )}

            <a
              href={buildQuickChatWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="inline-flex items-center justify-center p-2.5 border border-[#23272F] hover:border-[#343A46] bg-[#0D0F12] transition-colors shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#E8FF36] shrink-0" />
            </a>
            <Link
              href="/on-gorusme"
              className="inline-flex items-center justify-center text-[11px] 2xl:text-xs font-bold uppercase tracking-wider bg-[#E8FF36] text-[#08090B] hover:bg-[#D4EB2B] px-3.5 py-2 2xl:px-4.5 2xl:py-2.5 transition-all shadow-[0_0_15px_rgba(232,255,54,0.15)] whitespace-nowrap shrink-0"
            >
              <span className="hidden min-[1920px]:inline">Ücretsiz&nbsp;</span>Ön Görüşme
            </Link>
          </div>

          {/* Mobile / Tablet Trigger */}
          <div className="flex items-center gap-2 xl:hidden shrink-0">
            {/* Mobile Member Portal Quick Icon */}
            <Link
              href={user ? "/portal" : "/portal/giris"}
              className="p-2 border border-[#23272F] text-white bg-[#0D0F12] relative"
              aria-label="Üye Paneli"
              title="Üye Paneli"
            >
              <User className="w-4 h-4 text-[#E8FF36]" />
              {user && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              )}
            </Link>

            {/* Mobilde panel, sağdaki WhatsApp ve menü butonları kadar kaydırılıp header kenarına hizalanır */}
            <AppearanceMenuClassic showLabel={false} panelClassName="max-sm:-right-[5.5rem]" />
            <Link
              href="/on-gorusme"
              className="hidden sm:inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-wider bg-[#E8FF36] text-[#08090B] px-3 py-1.5 whitespace-nowrap"
            >
              Ön Görüşme
            </Link>
            <a
              href={buildQuickChatWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 border border-[#23272F] text-[#E8FF36] bg-[#0D0F12]"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white border border-[#23272F] bg-[#0D0F12] focus:outline-none"
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-[#08090B] flex flex-col pt-24 pb-8 px-6 overflow-y-auto xl:hidden animate-in fade-in duration-200"
          style={{
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          <div className="flex flex-col gap-1 border-b border-[#23272F] pb-6 mb-6">
            <span className="text-[11px] font-mono text-[#72757C] uppercase tracking-widest mb-2">
              MENÜ & SİSTEM
            </span>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between py-3 text-sm uppercase tracking-wider font-semibold border-b border-[#191B20] last:border-0",
                    isActive ? "text-[#E8FF36]" : "text-white/90 hover:text-white"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#72757C]" />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            {/* Member Card in Mobile Drawer */}
            {user ? (
              <Link
                href="/portal"
                className="w-full flex items-center justify-between p-3.5 bg-[#131519] border border-[#E8FF36]/40 text-white rounded-xl font-mono text-xs mb-1 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8FF36]">
                    <img
                      src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={user?.fullName || "Üye"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold block text-white group-hover:text-[#E8FF36]">
                      {user?.fullName || "Ege Mert"}
                    </span>
                    <span className="text-[10px] text-[#72757C]">Üye Paneli & Seanslarım</span>
                  </div>
                </div>
                <span className="text-xs text-[#E8FF36] font-bold">
                  {remainingSessions} Seans →
                </span>
              </Link>
            ) : (
              <Link
                href="/portal/giris"
                className="w-full flex items-center justify-center gap-2 p-3 bg-[#131519] border border-[#23272F] hover:border-[#E8FF36] text-white text-xs font-mono uppercase tracking-wider rounded-xl mb-1 transition-colors"
              >
                <User className="w-4 h-4 text-[#E8FF36]" />
                <span>Üye Girişi / Mobil Panel</span>
              </Link>
            )}

            <AppearanceMenuClassic variant="panel" className="mb-1" />
            <Link
              href="/on-gorusme"
              className="w-full flex items-center justify-center py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider text-center"
            >
              Ücretsiz Ön Görüşme Planla
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={BUSINESS_CONFIG.phoneTel}
                className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] text-white text-xs uppercase tracking-wider font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8FF36]" />
                Hemen Ara
              </a>
              <a
                href={buildQuickChatWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] text-white text-xs uppercase tracking-wider font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                WhatsApp
              </a>
            </div>
            <p className="text-center text-[10px] text-[#72757C] mt-2 font-mono uppercase">
              {BUSINESS_CONFIG.displayLocation} • {BUSINESS_CONFIG.phone}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
