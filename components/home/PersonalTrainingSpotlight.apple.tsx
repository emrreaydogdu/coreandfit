"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity, ShieldAlert, BarChart3, RefreshCw, Zap } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const BENTO_PILLARS = [
  {
    icon: Activity,
    num: "01",
    title: "Kişisel Programlama",
    description:
      "Vücut tipinize, geçmiş sakatlıklarınıza ve günlük temponuza uygun, dinamik olarak yenilenen antrenman planı.",
  },
  {
    icon: Zap,
    num: "02",
    title: "Birebir Koçluk & Tam Odak",
    description:
      "Seans boyunca koçunuzun dikkati asla dağılmaz. Her sette ağırlık, tekrar, duruş ve tempo kontrol altındadır.",
  },
  {
    icon: ShieldAlert,
    num: "03",
    title: "Biyomekanik & Teknik Takip",
    description:
      "Ağırlığı kaldırmak kadar nasıl kaldırdığınız önemlidir. Eklemleri koruyan, sakatlık riskini sıfıra indiren doğru açı prensibi.",
  },
  {
    icon: BarChart3,
    num: "04",
    title: "Performans & Veri Kaydı",
    description:
      "Rastgele çalışma yok. Kaldırılan kilolar, toparlanma süreleri ve kondisyon zonları düzenli kayıt altına alınır.",
  },
  {
    icon: RefreshCw,
    num: "05",
    title: "Dinamik Program Güncelleme",
    description:
      "Vücudunuz geliştikçe antrenman periyotlaması revize edilir. Gelişim duraksamasının (plato) önüne geçilir.",
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ÖNCELİKLİ HİZMET</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                1:1. Tamamen Size Özel.
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.15}>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Her antrenman; hedefe, performansa, kondisyon seviyesine, hareket kapasitesine ve antrenman geçmişine göre planlanır.
            </p>
          </ScrollReveal>
        </div>

        {/* Apple Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
          {/* Main Visual Bento Card (Spans 5 cols) */}
          <div className="lg:col-span-5 flex">
            <ScrollReveal variant="zoom-in" duration={0.8} className="w-full h-full flex">
              <div className="relative aspect-[4/5] lg:aspect-auto w-full rounded-[32px] border border-black/[0.08] dark:border-white/[0.12] overflow-hidden group shadow-xl bg-slate-950 flex flex-col justify-end p-6 sm:p-8">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80"
                  alt="1:1 Personal Training Seansı"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 p-5 rounded-2xl bg-white/85 dark:bg-[#121214]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      ÖZEL STÜDYO STANDARDI
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Aynı saat diliminde stüdyoda yalnızca randevulu üye ve kurucu antrenör yer alır. Kesintisiz mahremiyet ve odak.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Grid Pillars (Spans 7 cols) */}
          <div className="lg:col-span-7">
            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENTO_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                const isWide = idx === 0;
                return (
                  <StaggerItem
                    key={pillar.num}
                    className={isWide ? "sm:col-span-2" : "col-span-1"}
                  >
                    <div className="rounded-[28px] p-6 bg-white/75 dark:bg-[#121214]/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-sm h-full flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/15 group-hover:scale-110 transition-transform">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {pillar.num}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
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
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wide hover:bg-slate-800 dark:hover:bg-slate-100 transition-all w-full sm:w-auto shadow-md"
                >
                  <span>1:1 Antrenmanı İncele</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/on-gorusme?hizmet=personal-training"
                  className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] text-slate-800 dark:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12] font-medium text-xs transition-all w-full sm:w-auto"
                >
                  Ön Görüşme Al
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
