"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { Phone, MessageSquare, MapPin, ArrowUpRight, Star } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { AppearanceMenu } from "@/components/glass/AppearanceMenu";

const SERVICE_LINKS = [
  { label: "1:1 Personal Training", href: "/personal-training" },
  { label: "Fonksiyonel Antrenman", href: "/antrenman/functional-training" },
  { label: "Kuvvet & Biyomekanik", href: "/antrenman/strength-training" },
  { label: "Yağ Yakımı & Kondisyon", href: "/antrenman/fat-loss" },
  { label: "Mobilite & Omurga Postürü", href: "/antrenman/mobility" },
  { label: "Paketler & Teklif Al", href: "/paketler" },
];

const STUDIO_LINKS = [
  { label: "İlker Yüksel (Kurucu)", href: "/koclar/ilker-yuksel" },
  { label: "Üye Deneyimleri", href: "/basari-hikayeleri" },
  { label: "Stüdyo Felsefesi", href: "/hakkimizda" },
  { label: "Stüdyo Fotoğrafları", href: "/studio" },
  { label: "Antrenman Blogu", href: "/blog" },
  { label: "Randevu Takvimi", href: "/randevu" },
];

const LEGAL_LINKS = [
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
];

const linkClass =
  "cg-focus cg-ink-2 hover:text-[var(--cg-accent-ink)] transition-colors duration-500 rounded";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative px-3 sm:px-6 pt-8 pb-28 md:pb-8">
      <div className="max-w-7xl mx-auto cg-shell cg-shell-lg">
        <div className="cg-core cg-core-strong overflow-visible">
          <div className="px-6 sm:px-10 lg:px-14 pt-12 lg:pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Marka */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <Link href="/" className="cg-focus self-start rounded" aria-label="Core & Fit Ana Sayfa">
                <span className="cg-display cg-ink text-4xl font-semibold">
                  Core <span className="cg-serif cg-accent">&</span> Fit
                </span>
              </Link>
              <p className="cg-label">Nişantaşı · 1:1 özel antrenman stüdyosu</p>
              <p className="cg-ink-3 cg-pretty text-[14px] leading-relaxed max-w-sm">
                Standart salon karmaşasından uzak; hedefinize, biyomekaniğinize ve günlük temponuza özel 1:1 kişisel antrenman. Kurucu antrenör: İlker Yüksel.
              </p>
              <div className="cg-glass self-start inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] shadow-none">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                <span className="cg-ink font-semibold cg-num">4.2 / 5</span>
                <span className="cg-ink-3">62 Google yorumu</span>
              </div>
            </div>

            {/* Hizmetler */}
            <nav aria-label="Hizmetler" className="lg:col-span-3">
              <p className="cg-label mb-5">Hizmetler</p>
              <ul className="space-y-3 text-[13px] font-medium">
                {SERVICE_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={`${linkClass} group inline-flex items-center gap-1.5`}>
                      {l.label}
                      <ArrowUpRight
                        className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                        strokeWidth={1.75}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Stüdyo */}
            <nav aria-label="Stüdyo" className="lg:col-span-2">
              <p className="cg-label mb-5">Stüdyo</p>
              <ul className="space-y-3 text-[13px] font-medium">
                {STUDIO_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/portal" className="cg-focus cg-accent inline-flex items-center gap-1.5 font-semibold rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--cg-accent)]" />
                    Üye Portalı Girişi
                  </Link>
                </li>
              </ul>
            </nav>

            {/* İletişim */}
            <div className="lg:col-span-3">
              <p className="cg-label mb-5">İletişim & lokasyon</p>
              <div className="space-y-4 text-[13px]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 cg-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="cg-ink font-medium">{BUSINESS_CONFIG.displayLocation}</p>
                    <p className="cg-ink-3 text-[12px] mt-0.5">Yalnızca randevulu danışanlar kabul edilir.</p>
                  </div>
                </div>
                <a href={BUSINESS_CONFIG.phoneTel} className={`${linkClass} flex items-center gap-3`}>
                  <Phone className="w-4 h-4 cg-accent shrink-0" strokeWidth={1.5} />
                  <span className="cg-num">{BUSINESS_CONFIG.phone}</span>
                </a>
                <a
                  href={buildQuickChatWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center gap-3`}
                >
                  <MessageSquare className="w-4 h-4 cg-accent shrink-0" strokeWidth={1.5} />
                  <span>WhatsApp iletişim hattı</span>
                </a>
                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center gap-3`}
                >
                  <InstagramIcon className="w-4 h-4 cg-accent shrink-0" />
                  <span>{BUSINESS_CONFIG.instagramHandle}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Alt şerit */}
          <div className="mx-6 sm:mx-10 lg:mx-14 py-6 border-t cg-hairline flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-[12px]">
            <div className="flex flex-wrap items-center gap-3">
              <p className="cg-ink-3">© {new Date().getFullYear()} Core & Fit. Tüm hakları saklıdır.</p>
              <AppearanceMenu showLabel placement="top" align="left" />
            </div>
            <nav aria-label="Yasal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="cg-focus cg-ink-3 hover:text-[var(--cg-ink)] transition-colors duration-500 rounded">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
