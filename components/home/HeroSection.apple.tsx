"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/config/business";
import { ArrowRight, ShieldCheck, MapPin, Sparkles, Check } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "motion/react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[95vh] lg:min-h-screen flex items-center pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-28 overflow-hidden bg-[#FBFBFD] dark:bg-[#000000]">
      {/* Soft Ambient Apple Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[550px] bg-gradient-to-tr from-emerald-500/10 via-emerald-400/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-blue-500/5 dark:bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cinematic Studio Photography Layer with Smooth Vignette */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
          alt="Core & Fit Nişantaşı 1:1 Personal Training Studio"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_35%] opacity-35 dark:opacity-30 mix-blend-multiply dark:mix-blend-luminosity"
        />
        {/* Apple Ceramic & Obsidian Seamless Blends */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFD]/70 via-[#FBFBFD]/85 to-[#FBFBFD] dark:from-[#000000]/60 dark:via-[#000000]/80 dark:to-[#000000]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FBFBFD]/95 via-[#FBFBFD]/80 to-transparent dark:from-[#000000]/95 dark:via-[#000000]/80 lg:w-3/4" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Apple Micro-Capsule Pill */}
            <ScrollReveal variant="fade-up" delay={0.05}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.12] text-xs font-medium text-slate-800 dark:text-slate-200 mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="tracking-wide">Nişantaşı Özel Birebir Stüdyo</span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">İlker Yüksel</span>
              </div>
            </ScrollReveal>

            {/* Apple Keynote Headline */}
            <ScrollReveal variant="fade-up" delay={0.15} duration={0.8}>
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] sm:leading-[1.08] mb-6">
                Kalabalığa değil, <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                  size odaklanan
                </span> <br />
                birebir antrenman.
              </h1>
            </ScrollReveal>

            {/* Editorial Subtext */}
            <ScrollReveal variant="fade-up" delay={0.25} duration={0.7}>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
                Hedefinize, biyomekaniğinize ve yaşam temponuza göre kurgulanan 1:1 özel seanslar. Sıra bekleme ve kalabalık yok; yalnızca size ayrılmış özel stüdyo alanı ve ölçülebilir sonuçlar.
              </p>
            </ScrollReveal>

            {/* Apple Luxury CTAs */}
            <ScrollReveal variant="fade-up" delay={0.35} duration={0.6}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="/on-gorusme"
                  className="group inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm tracking-wide hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.15)]"
                >
                  <span>Ücretsiz Ön Görüşme</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                <Link
                  href="/personal-training"
                  className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.12] text-slate-800 dark:text-white font-medium text-sm transition-all duration-200"
                >
                  1:1 Metodolojiyi Keşfet
                </Link>
              </div>
            </ScrollReveal>

            {/* Subtle Trust Indicators */}
            <ScrollReveal variant="fade-up" delay={0.45} duration={0.6}>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-10 mt-10 border-t border-black/[0.06] dark:border-white/[0.1] text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Tamamen Birebir (1:1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span>Biyomekanik & Postür Takibi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span>Nişantaşı / İstanbul</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Floating Apple Liquid Glass Feature Cards */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="fade-up" delay={0.25} duration={0.8}>
              <div className="relative flex flex-col gap-4">
                {/* Feature Card 1 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[28px] p-6 bg-white/75 dark:bg-[#121214]/75 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>KİŞİYE ÖZEL ALAN</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Sıfır Bekleme, Yüksek Odak
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Aynı saat diliminde yalnızca siz ve koçunuz stüdyoda yer alır. Makine sırası veya dikkat dağınıklığı yaşanmaz.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 dark:from-emerald-400/20 dark:to-emerald-400/5 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      1:1
                    </div>
                  </div>
                </motion.div>

                {/* Feature Card 2 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[28px] p-6 bg-white/75 dark:bg-[#121214]/75 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>BİYOMEKANİK HASSASİYET</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Kusursuz Form & Sakatlık Koruması
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Her tekrarınızda milimetrik eklem açısı ve tempo takibi yapılır. Gücünüz artarken omurga ve eklemleriniz korunur.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500/15 to-teal-500/5 dark:from-teal-400/20 dark:to-teal-400/5 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400 font-bold text-sm">
                      100%
                    </div>
                  </div>
                </motion.div>

                {/* Feature Card 3 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[28px] p-6 bg-white/75 dark:bg-[#121214]/75 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ÖLÇÜLEBİLİR SİSTEM</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Kişiye Özel Dijital Portal & Takip
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Kaldırdığınız ağırlıklar, devam durumunuz ve vücut kompozisyonunuz özel üye portalı üzerinden anlık izlenir.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 dark:from-emerald-400/20 dark:to-emerald-400/5 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      PRO
                    </div>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
