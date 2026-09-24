"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { MessageSquare, Phone, User, ArrowUpRight } from "lucide-react";
import { cn, lockBodyScroll, unlockBodyScroll } from "@/lib/utils";
import { GoogleTranslateScripts } from "@/components/LanguageSwitcher";
import { useMember } from "@/context/MemberContext";
import { GlassBackdrop } from "@/components/glass/GlassPrimitives";
import { AppearanceMenu } from "@/components/glass/AppearanceMenu";

const EASE = [0.32, 0.72, 0, 1] as const;

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <GlassBackdrop />
      <GoogleTranslateScripts />

      {/* Yüzen cam ada header */}
      <header
        className={cn(
          "fixed left-0 right-0 px-3 sm:px-6 pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          mobileMenuOpen ? "z-[80]" : "z-50",
          "top-3 sm:top-4",
          isScrolled && !mobileMenuOpen ? "-translate-y-1.5" : "translate-y-0"
        )}
      >
        <div className="max-w-7xl mx-auto pointer-events-auto cg-shell rounded-full p-1">
          <div className="cg-core cg-core-strong rounded-full overflow-visible flex items-center justify-between gap-3 pl-2 pr-2 py-1.5">
            {/* Marka */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group cg-focus rounded-full" aria-label="Core & Fit Ana Sayfa">
              <span className="w-9 h-9 rounded-full cg-btn-ink flex items-center justify-center text-[11px] font-bold tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                CF
              </span>
              <span className="flex flex-col leading-none pr-1">
                <span className="cg-ink font-semibold text-[15px] tracking-tight">Core & Fit</span>
                <span className="cg-ink-3 text-[10px] font-medium tracking-wide mt-1 hidden sm:block xl:hidden 2xl:block">Nişantaşı private studio</span>
              </span>
            </Link>

            {/* Masaüstü navigasyon */}
            <nav aria-label="Ana Menü" className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "cg-focus relative px-2.5 2xl:px-3 py-2 rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors duration-500",
                      isActive ? "cg-ink" : "cg-ink-3 hover:text-[var(--cg-ink)]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cg-nav-active"
                        className="absolute inset-0 rounded-full bg-[var(--cg-accent-soft)]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Masaüstü sağ kontroller */}
            <div className="hidden xl:flex items-center gap-1.5 shrink-0">
              <AppearanceMenu showLabel />
              <span className="w-px h-5 bg-[var(--cg-hair)] mx-1" aria-hidden="true" />

              {user ? (
                <Link
                  href="/portal"
                  className="cg-focus inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold cg-ink hover:bg-[var(--cg-accent-soft)] transition-colors duration-500"
                  title="Üye Paneli"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--cg-accent)]" />
                  <span className="hidden 2xl:inline">{(user?.fullName || "Ege").split(" ")[0]}</span>
                  <span className="cg-accent cg-num">{remainingSessions} Hak</span>
                </Link>
              ) : (
                <Link
                  href="/portal/giris"
                  className="cg-focus inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium cg-ink-2 hover:text-[var(--cg-ink)] hover:bg-[var(--cg-accent-soft)] transition-colors duration-500"
                >
                  <User className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span className="whitespace-nowrap">Giriş Yap</span>
                </Link>
              )}

              <Link href="/on-gorusme" className="cg-btn cg-btn-accent cg-btn-sm">
                <span>Ön Görüşme</span>
                <span className="cg-btn-icon">
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                </span>
              </Link>
            </div>

            {/* Mobil / tablet kontroller */}
            <div className="flex items-center gap-1 xl:hidden shrink-0">
              <Link
                href={user ? "/portal" : "/portal/giris"}
                className="cg-focus w-10 h-10 rounded-full flex items-center justify-center cg-ink-2 hover:bg-[var(--cg-accent-soft)] transition-colors"
                aria-label="Üye Paneli"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
              {/* Panel, hamburger butonunun genişliği kadar sağa kaydırılarak header kenarına hizalanır */}
              <AppearanceMenu panelClassName="-right-[3.25rem]" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="cg-focus w-10 h-10 rounded-full cg-btn-ink flex items-center justify-center"
                aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={mobileMenuOpen}
              >
                <span className="cg-burger" data-open={mobileMenuOpen}>
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil tam ekran cam menü */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="cg-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-[70] xl:hidden bg-[color-mix(in_srgb,var(--cg-bg)_78%,transparent)] backdrop-blur-3xl flex flex-col pt-24 sm:pt-28 pb-8 px-5 sm:px-8 overflow-y-auto"
            style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            <nav aria-label="Mobil Menü" className="flex flex-col">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.06 + i * 0.045, ease: EASE }}
                    className="border-b cg-hairline"
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className="cg-focus flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className={cn("cg-display text-[1.75rem] sm:text-4xl font-semibold", isActive ? "cg-accent" : "cg-ink")}>
                        {link.label}
                      </span>
                      <span className="cg-num cg-ink-3 text-[11px] font-semibold">0{i + 1}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="flex flex-col gap-2.5 mt-10"
            >
              {user ? (
                <Link href="/portal" className="cg-shell rounded-[1.5rem]">
                  <div className="cg-core cg-core-strong rounded-[calc(1.5rem-6px)] flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[var(--cg-accent)]">
                        <img
                          src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                          alt={user?.fullName || "Üye"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="cg-ink text-sm font-semibold block">{user?.fullName || "Ege Mert"}</span>
                        <span className="cg-ink-3 text-[11px]">Üye portalı & seanslar</span>
                      </div>
                    </div>
                    <span className="cg-accent cg-num text-xs font-semibold">{remainingSessions} Seans →</span>
                  </div>
                </Link>
              ) : (
                <Link href="/portal/giris" className="cg-btn cg-btn-ghost w-full">
                  <User className="w-4 h-4" strokeWidth={1.5} />
                  <span>Üye girişi / mobil panel</span>
                </Link>
              )}

              <AppearanceMenu variant="panel" />

              <Link href="/on-gorusme" className="cg-btn cg-btn-accent justify-between w-full">
                <span>Ön görüşme randevusu al</span>
                <span className="cg-btn-icon">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                </span>
              </Link>

              <div className="grid grid-cols-2 gap-2.5">
                <a href={BUSINESS_CONFIG.phoneTel} className="cg-btn cg-btn-ghost w-full px-4">
                  <Phone className="w-4 h-4 cg-accent" strokeWidth={1.5} />
                  Hemen ara
                </a>
                <a
                  href={buildQuickChatWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-btn cg-btn-ghost w-full px-4"
                >
                  <MessageSquare className="w-4 h-4 cg-accent" strokeWidth={1.5} />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
