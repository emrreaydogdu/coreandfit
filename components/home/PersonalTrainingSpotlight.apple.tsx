"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Activity, ShieldCheck, BarChart3, RefreshCw, Zap } from "lucide-react";
import { Eyebrow, Reveal, Stagger, StaggerChild } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

const BENTO_PILLARS = [
  {
    icon: Activity,
    title: "Kişiye özel biyomekanik",
    description:
      "Vücut yapınıza, omurga postürünüze ve varsa eski sakatlıklarınıza göre sıfırdan planlanan egzersiz açıları.",
  },
  {
    icon: Zap,
    title: "Kesintisiz antrenör odağı",
    description:
      "50 dakikalık seans boyunca koçunuzun dikkati yalnızca sizin formunuzda, tekrar temponuzda ve nefesinizdedir.",
  },
  {
    icon: ShieldCheck,
    title: "Sakatlık riskini sıfırlama",
    description:
      "Ağırlığı kaldırmak kadar nasıl kaldırdığınız önemlidir. Eklemleri koruyan kontrollü hareket prensibi.",
  },
  {
    icon: BarChart3,
    title: "Şeffaf performans kaydı",
    description:
      "Kaldırdığınız ağırlıklar ve güç artışınız düzenli kaydedilir; gelişim tesadüfe bırakılmaz.",
  },
  {
    icon: RefreshCw,
    title: "Dinamik program uyarlaması",
    description:
      "İlerleme hızınıza ve günlük yorgunluk durumunuza göre seans zorluğu anlık olarak optimize edilir.",
  },
];

export const PersonalTrainingSpotlight: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık: sola yaslı, açıklama sağda */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Birebir çalışma standardı</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] font-semibold">
                Neden <span className="cg-serif cg-accent">1:1</span> koçluk?
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <p className="cg-ink-2 cg-pretty text-base sm:text-lg leading-relaxed max-w-md lg:ml-auto">
                Standart spor salonlarının kalabalığında kaybolmak yerine, her dakikanızın net bir amaca hizmet ettiği butik stüdyo modeli.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Asimetrik bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mt-16">
          {/* Görsel: iki satır boyunca */}
          <Reveal className="lg:col-span-5 lg:row-span-2 flex">
            <div className="cg-shell cg-shell-lg w-full flex">
              <div className="cg-core cg-core-media relative w-full min-h-[440px] lg:min-h-full group">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80"
                  alt="Stüdyoda birebir personal training seansı"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover cg-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 cg-on-media">
                  <div className="cg-glass-dark rounded-[1.5rem] p-5">
                    <p className="cg-label cg-muted">Butik Nişantaşı stüdyosu</p>
                    <p className="text-[14px] leading-relaxed mt-2.5">
                      Aynı saatte salonda sadece siz ve kurucu antrenör İlker Yüksel yer alır. Sıra bekleme ve dikkat dağılması tarihe karışır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Sütunlar */}
          <Stagger className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {BENTO_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isWide = idx === 0;
              return (
                <StaggerChild key={pillar.title} className={cn(isWide && "sm:col-span-2")}>
                  <div className="cg-shell cg-lift h-full group">
                    <div className={cn("cg-core h-full p-6 sm:p-7 flex flex-col", isWide && "cg-core-tint sm:flex-row sm:items-center sm:gap-8")}>
                      <div className={cn("flex items-center justify-between", isWide ? "sm:flex-col sm:items-start sm:gap-10 sm:shrink-0" : "mb-8")}>
                        <span className="w-11 h-11 rounded-2xl cg-glass flex items-center justify-center cg-accent">
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </span>
                        <span className="cg-num cg-ink-3 text-xs font-semibold">0{idx + 1}</span>
                      </div>
                      <div className={cn(isWide && "mt-6 sm:mt-0")}>
                        <h3 className={cn("cg-ink font-semibold tracking-tight", isWide ? "text-2xl sm:text-3xl" : "text-lg")}>
                          {pillar.title}
                        </h3>
                        <p className="cg-ink-3 cg-pretty text-[14px] leading-relaxed mt-2.5">{pillar.description}</p>
                      </div>
                    </div>
                  </div>
                </StaggerChild>
              );
            })}
          </Stagger>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/personal-training" className="cg-btn cg-btn-ink">
              <span>1:1 seans detayları</span>
              <span className="cg-btn-icon">
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
              </span>
            </Link>
            <Link href="/on-gorusme?hizmet=personal-training" className="cg-btn cg-btn-ghost">
              Ön görüşme talep et
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
