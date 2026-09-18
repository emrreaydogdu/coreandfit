"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Sparkles } from "lucide-react";

export const EditorialStatement: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-y border-black/[0.06] dark:border-white/[0.08] relative overflow-hidden">
      {/* Environmental Ambient Light Refraction */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Headline & Statement */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ScrollReveal variant="fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NİŞANTAŞI STÜDYO ANLAYIŞI</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.1}>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.14]">
                Gelişigüzel antrenman yok. <br />
                <span className="text-slate-500 dark:text-slate-400">Her hareketin bir gerekçesi var.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.2}>
              <div className="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Standart spor salonlarında makineler arasında vakit kaybetmek yerine; vücut anatominizi tanıyan, eklem sınırlarınızı bilen ve her hareketin amacını size aktaran bir sistemle çalışırsınız.
                </p>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kurucu antrenör İlker Yüksel, antrenman planınızı genel internet şablonlarıyla değil; postür analiziniz, eklem mobiliteniz ve günlük yaşam temponuza göre kurgular.
                </p>
              </div>
            </ScrollReveal>

            {/* Apple Liquid Glass Stat Capsules */}
            <ScrollReveal variant="fade-up" delay={0.3}>
              <div className="pt-2 grid grid-cols-3 gap-3.5 sm:gap-4">
                <div className="p-5 sm:p-6 rounded-[26px] liquid-glass-card">
                  <span className="block text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">1:1</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 block">Birebir Seans</span>
                </div>
                <div className="p-5 sm:p-6 rounded-[26px] liquid-glass-card">
                  <span className="block text-2xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">50 dk</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 block">Bölünmeyen Odak</span>
                </div>
                <div className="p-5 sm:p-6 rounded-[26px] liquid-glass-card">
                  <span className="block text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">%100</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 block">Kişisel Takip</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Editorial Atmospheric Video in Apple Continuous Curvature Frame */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="zoom-in" delay={0.2} duration={0.8}>
              <div className="relative aspect-[4/5] w-full rounded-[36px] overflow-hidden group bg-black shadow-2xl border border-black/[0.08] dark:border-white/[0.12]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src="/15079453_1080_1920_30fps.mp4" type="video/mp4" />
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Liquid Glass Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl liquid-glass-panel shadow-lg z-10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                      ÖZEL RANDEVULU ALAN
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      CANLI ODAK
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                    Aynı saat diliminde yalnızca tek bir üyenin ağırlandığı butik stüdyo deneyimi.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
