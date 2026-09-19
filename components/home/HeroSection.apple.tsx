"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "motion/react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[96vh] lg:min-h-screen flex items-center pt-36 sm:pt-40 lg:pt-44 pb-20 lg:pb-28 overflow-hidden bg-[#FBFBFD] dark:bg-[#000000]">
      {/* Environmental Ambient Light Orbs - Refracted through Liquid Glass */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1200px] h-[600px] bg-gradient-to-b from-emerald-500/20 via-teal-500/12 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-10 w-[550px] h-[550px] bg-emerald-500/15 dark:bg-emerald-500/22 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-[450px] h-[450px] bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Cinematic Studio Photography Layer with Smooth Vignette */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
          alt="Core & Fit Nişantaşı 1:1 Özel Stüdyo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_35%] opacity-25 dark:opacity-25 mix-blend-multiply dark:mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFD]/60 via-[#FBFBFD]/80 to-[#FBFBFD] dark:from-[#000000]/60 dark:via-[#000000]/80 dark:to-[#000000]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FBFBFD]/95 via-[#FBFBFD]/85 to-transparent dark:from-[#000000]/95 dark:via-[#000000]/85 lg:w-3/4" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Story Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Studio Eyebrow Pill */}
            <ScrollReveal variant="fade-up" delay={0.05}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-slate-800 dark:text-slate-200 mb-6 select-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Nişantaşı</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>1:1 Özel Antrenman Stüdyosu</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-emerald-700 dark:text-emerald-400">İlker Yüksel</span>
              </div>
            </ScrollReveal>

            {/* Apple Keynote Headline (Clean, Human, Zero AI Slop) */}
            <ScrollReveal variant="fade-up" delay={0.15} duration={0.8}>
              <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] sm:leading-[1.08] mb-6">
                Sadece sizin için <br />
                ayrılmış bir stüdyo. <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                  Birebir antrenman.
                </span>
              </h1>
            </ScrollReveal>

            {/* Editorial Subtext */}
            <ScrollReveal variant="fade-up" delay={0.25} duration={0.7}>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
                Nişantaşı&apos;nda randevu saatinizde stüdyonun kapısı yalnızca size açılır. Sıra bekleme yok, kalabalık yok; sadece doğru biyomekanik ve kurucu antrenör İlker Yüksel ile kesintisiz odak.
              </p>
            </ScrollReveal>

            {/* Apple Liquid Glass Action Buttons */}
            <ScrollReveal variant="fade-up" delay={0.35} duration={0.6}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="/on-gorusme"
                  className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 rounded-full liquid-glass-btn-primary font-semibold text-sm tracking-wide select-none"
                >
                  <span>Ön Görüşme Randevusu Al</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/personal-training"
                  className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-full liquid-glass-pill text-slate-800 dark:text-white font-medium text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all select-none"
                >
                  Stüdyoyu ve Metodolojiyi Gör
                </Link>
              </div>
            </ScrollReveal>

            {/* Authentic Trust Indicators */}
            <ScrollReveal variant="fade-up" delay={0.45} duration={0.6}>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-10 mt-10 border-t border-black/[0.06] dark:border-white/[0.1] text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Aynı Anda Tek Üye</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Biyomekanik & Postür Odaklı</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Teşvikiye, Nişantaşı</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Floating Apple Liquid Glass Feature Cards */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="fade-up" delay={0.25} duration={0.8}>
              <div className="relative flex flex-col gap-4">
                {/* Liquid Glass Card 1 */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[30px] p-6 liquid-glass-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ÖZEL SEANS ALANI</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Tek Üye, Tek Antrenör
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Randevunuz boyunca tüm stüdyo yalnızca sizin kullanımınızdadır. Dikkat dağıtan hiçbir unsur bulunmaz.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl liquid-glass-pill flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                      1:1
                    </div>
                  </div>
                </motion.div>

                {/* Liquid Glass Card 2 */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[30px] p-6 liquid-glass-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>KORUYUCU BİYOMEKANİK</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Doğru Açı, Sıfır Sakatlık Riski
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Her sette eklem açınız, postürünüz ve tekrar temponuz takip edilir. Omurganız korunurken kuvvetiniz artar.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl liquid-glass-pill flex items-center justify-center shrink-0 text-teal-700 dark:text-teal-400 font-extrabold text-sm">
                      100%
                    </div>
                  </div>
                </motion.div>

                {/* Liquid Glass Card 3 */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[30px] p-6 liquid-glass-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>DİJİTAL GELİŞİM TAKİBİ</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Ölçülebilir Sonuçlar & Üye Portalı
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Kaldırılan ağırlıklar, seans geçmişi ve vücut kompozisyonundaki değişimler dijital ortamda şeffafça izlenir.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl liquid-glass-pill flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
                      PORTAL
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
