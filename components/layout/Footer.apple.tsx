"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Phone, MessageSquare, MapPin, ArrowUpRight, Star } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#F5F5F7] dark:bg-[#0A0A0C] border-t border-black/[0.06] dark:border-white/[0.08] pt-16 pb-28 md:pb-16 text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-black/[0.06] dark:border-white/[0.08]">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                CORE & FIT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              NİŞANTAŞI • 1:1 ÖZEL ANTRENMAN STÜDYOSU
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Standart salon karmaşasından uzak; hedefinize, biyomekaniğinize ve günlük temponuza özel 1:1 kişisel antrenman. Kurucu antrenör: İlker Yüksel.
            </p>

            <div className="flex items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs shadow-xs">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-slate-900 dark:text-white font-bold">4.2 / 5</span>
                <span className="text-slate-400 text-[11px]">(62 Google Yorumu)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              HİZMETLER
            </span>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/personal-training" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between">
                  1:1 Personal Training
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/functional-training" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between">
                  Fonksiyonel Antrenman
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/strength-training" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between">
                  Kuvvet & Biyomekanik
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/fat-loss" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between">
                  Yağ Yakımı & Kondisyon
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/mobility" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between">
                  Mobilite & Omurga Postürü
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/paketler" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between">
                  Paketler & Teklif Al
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Nav */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              STÜDYO
            </span>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/koclar/ilker-yuksel" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  İlker Yüksel (Kurucu)
                </Link>
              </li>
              <li>
                <Link href="/basari-hikayeleri" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Üye Deneyimleri
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Stüdyo Felsefesi
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Stüdyo Fotoğrafları
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Antrenman Blogu
                </Link>
              </li>
              <li>
                <Link href="/randevu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Randevu Takvimi
                </Link>
              </li>
              <li>
                <Link
                  href="/portal"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Üye Portalı Girişi</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              İLETİŞİM & LOKASYON
            </span>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">{BUSINESS_CONFIG.displayLocation}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Yalnızca randevulu danışanlar kabul edilir.</p>
                </div>
              </div>

              <a
                href={BUSINESS_CONFIG.phoneTel}
                className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={buildQuickChatWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp İletişim Hattı</span>
              </a>

              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{BUSINESS_CONFIG.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} CORE & FIT. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-2">
              <LanguageSwitcher hideScripts />
              <ThemeToggle variant="pill" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/kvkk" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/gizlilik-politikasi" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
