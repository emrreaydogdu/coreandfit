"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity, ShieldCheck, BarChart3, RefreshCw, Zap } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const BENTO_PILLARS = [
  {
    icon: Activity,
    title: "Kişiye Özel Biyomekanik",
    description:
      "Vücut yapınıza, omurga postürünüze ve varsa eski sakatlıklarınıza göre sıfırdan planlanan egzersiz açıları.",
  },
  {
    icon: Zap,
    title: "Kesintisiz Antrenör Odağı",
    description:
      "50 dakikalık seans boyunca koçunuzun dikkati yalnızca sizin formunuzda, tekrar temponuzda ve nefesinizdedir.",
  },
  {
    icon: ShieldCheck,
    title: "Sakatlık Riskini Sıfırlama",
    description:
      "Ağırlığı kaldırmak kadar nasıl kaldırdığınız önemlidir. Eklemleri koruyan kontrollü hareket prensibi.",
  },
  {
    icon: BarChart3,
    title: "Şeffaf Performans Kaydı",
    description:
      "Kaldırdığınız ağırlıklar ve güç artışınız düzenli kaydedilir; gelişim tesadüfe bırakılmaz.",
  },
  {
    icon: RefreshCw,
    title: "Dinamik Program Uyarlaması",
    description:
      "İlerleme hızınıza ve günlük yorgunluk durumunuza göre seans zorluğu anlık olarak optimize edilir.",
  },
];

export const PersonalTrainingSpotlight: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FBFBFD] dark:bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-black/[0.06] dark:border-white/[0.08]">
          <ScrollReveal variant="fade-up">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BİREBİR ÇALIŞMA STANDARDI</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Neden 1:1 koçluk?
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.15}>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Standart spor salonlarının kalabalığında kaybolmak yerine, her dakikanızın net bir amaca hizmet ettiği butik stüdyo modeli.
            </p>
          </ScrollReveal>
        </div>

        {/* Apple Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
          {/* Main Visual Bento Card */}
          <div className="lg:col-span-5 flex">
            <ScrollReveal variant="zoom-in" duration={0.8} className="w-full h-full flex">
              <div className="relative aspect-[4/5] lg:aspect-auto w-full rounded-[34px] overflow-hidden group shadow-xl bg-slate-950 flex flex-col justify-end p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.12]">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80"
                  alt="1:1 Personal Training Seansı"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 p-5 rounded-2xl liquid-glass-panel shadow-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      BUTİK NİŞANTAŞI STÜDYOSU
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Aynı saatte salonda sadece siz ve kurucu antrenör İlker Yüksel yer alır. Sıra bekleme ve dikkat dağılması tarihe karışır.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Grid Pillars with Liquid Glass Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENTO_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                const isWide = idx === 0;
                return (
                  <StaggerItem
                    key={pillar.title}
                    className={isWide ? "sm:col-span-2" : "col-span-1"}
                  >
                    <div className="rounded-[30px] p-6 liquid-glass-card hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-2xl liquid-glass-pill text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-400">
                            0{idx + 1}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Apple CTAs */}
            <ScrollReveal variant="fade-up" delay={0.25}>
              <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/personal-training"
                  className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 rounded-full liquid-glass-btn-primary font-semibold text-xs tracking-wide w-full sm:w-auto select-none"
                >
                  <span>1:1 Seans Detayları</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/on-gorusme?hizmet=personal-training"
                  className="inline-flex items-center justify-center min-h-[50px] px-7 rounded-full liquid-glass-pill text-slate-800 dark:text-white font-medium text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all w-full sm:w-auto select-none"
                >
                  Ön Görüşme Talep Et
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
