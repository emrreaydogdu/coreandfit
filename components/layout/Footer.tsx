"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Phone, MessageSquare, MapPin, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Portal ve Admin sayfalarında marketing footer render edilmez
  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-[#050607] border-t border-[#191B20] pt-16 pb-28 md:pb-16 text-[#A5A7AD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#191B20]">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tighter text-white font-mono uppercase">
                CORE & FIT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36]" />
            </Link>
            <p className="text-xs uppercase font-mono tracking-widest text-[#72757C]">
              PRIVATE SPORT STUDIO • NİŞANTAŞI
            </p>
            <p className="text-sm text-[#A5A7AD] max-w-sm leading-relaxed mt-2">
              Standart kalabalık salon anlayışından uzak; hedefinize, biyomekaniğinize ve yaşam tarzınıza özel 1:1 kişisel antrenman ve performans koçluğu.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0D0F12] border border-[#23272F] text-xs font-mono text-white">
                <span className="text-[#E8FF36] font-bold">★ 4.2</span>
                <span className="text-[#72757C]">/ 5</span>
                <span className="text-[#72757C] text-[10px]">(62 Google Yorumu)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              HİZMETLER & SİSTEM
            </span>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-medium">
              <li>
                <Link href="/personal-training" className="hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                  1:1 Personal Training
                  <ArrowUpRight className="w-3 h-3 text-[#72757C]" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/functional-training" className="hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                  Functional Training
                  <ArrowUpRight className="w-3 h-3 text-[#72757C]" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/strength-training" className="hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                  Strength & Biyomekanik
                  <ArrowUpRight className="w-3 h-3 text-[#72757C]" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/fat-loss" className="hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                  Fat Loss & Metabolik
                  <ArrowUpRight className="w-3 h-3 text-[#72757C]" />
                </Link>
              </li>
              <li>
                <Link href="/antrenman/mobility" className="hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                  Mobility & Postür
                  <ArrowUpRight className="w-3 h-3 text-[#72757C]" />
                </Link>
              </li>
              <li>
                <Link href="/paketler" className="hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                  Paketler & Teklif Al
                  <ArrowUpRight className="w-3 h-3 text-[#72757C]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Nav */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              STÜDYO
            </span>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-medium">
              <li>
                <Link href="/koclar" className="hover:text-[#E8FF36] transition-colors">
                  Eğitmen Kadromuz
                </Link>
              </li>
              <li>
                <Link href="/basari-hikayeleri" className="hover:text-[#E8FF36] transition-colors">
                  Üye Deneyimleri
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-[#E8FF36] transition-colors">
                  Yaklaşımımız
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#E8FF36] transition-colors">
                  Stüdyo & Galeri
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#E8FF36] transition-colors">
                  Fitness Rehberi (Blog)
                </Link>
              </li>
              <li>
                <Link href="/randevu" className="hover:text-[#E8FF36] transition-colors">
                  Randevu Oluştur
                </Link>
              </li>
              <li>
                <Link
                  href="/portal"
                  className="hover:text-[#E8FF36] transition-colors flex items-center gap-1.5 text-[#E8FF36] font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36] animate-pulse" />
                  <span>Üye Portalı & Mobil Giriş</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              İLETİŞİM & LOKASYON
            </span>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{BUSINESS_CONFIG.displayLocation}</p>
                  <p className="text-[#72757C] text-[11px]">Özel randevulu ziyaret kabul edilmektedir.</p>
                </div>
              </div>

              <a
                href={BUSINESS_CONFIG.phoneTel}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E8FF36] shrink-0" />
                <span className="font-mono text-white">{BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={buildQuickChatWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <span className="font-mono text-white">WhatsApp Destek Hattı</span>
              </a>

              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#E8FF36] shrink-0" />
                <span>{BUSINESS_CONFIG.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#72757C]">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} CORE & FIT. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-2">
              <LanguageSwitcher hideScripts />
              <ThemeToggle variant="pill" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/kvkk" className="hover:text-white transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-white transition-colors">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
