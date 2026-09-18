"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/config/business";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "motion/react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-28 overflow-hidden bg-[#08090B]">
      {/* Background Photography with Dramatic Lighting */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
          alt="Core & Fit Nişantaşı 1:1 Personal Training"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_35%] opacity-70 dark:opacity-40"
        />
        {/* Atmospheric Gradients: Smooth light mode blend, dark mode vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/40 to-transparent dark:from-[#08090B] dark:via-[#08090B]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/85 via-[#F8F9FA]/60 to-transparent dark:from-[#08090B] dark:via-[#08090B]/80 lg:w-3/4" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 lg:pt-6">
        <div className="max-w-3xl">
          {/* Studio Location Micro Badge */}
          <ScrollReveal variant="fade-up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0D0F12]/90 border border-[#23272F] text-xs font-mono uppercase tracking-widest text-[#A5A7AD] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36] animate-pulse" />
              <span>{BUSINESS_CONFIG.tagline}</span>
            </div>
          </ScrollReveal>

          {/* Bold Athletic Headline */}
          <ScrollReveal variant="fade-up" delay={0.2} duration={0.7}>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.18] sm:leading-[1.1] lg:leading-[1.04] mb-6">
              KALABALIĞA DEĞİL, <br />
              <span className="text-[#E8FF36]">SANA ODAKLANAN</span> <br />
              <span className="text-[#A5A7AD]">ANTRENMAN.</span>
            </h1>
          </ScrollReveal>

          {/* Subtext */}
          <ScrollReveal variant="fade-up" delay={0.35} duration={0.6}>
            <p className="text-base sm:text-lg lg:text-xl text-[#A5A7AD] font-normal leading-relaxed max-w-2xl mb-8">
              Nişantaşı&apos;nda hedeflerine, seviyene ve yaşam düzenine göre planlanan birebir kişisel antrenman deneyimi. Kalabalık yok, sıra bekleme yok; yalnızca sana odaklanan bir koç ve ölçülebilir sonuç.
            </p>
          </ScrollReveal>

          {/* Call to Actions */}
          <ScrollReveal variant="fade-up" delay={0.45} duration={0.6}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/on-gorusme"
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-[#E8FF36] text-[#08090B] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(232,255,54,0.2)]"
              >
                <span>Ücretsiz Ön Görüşme</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/personal-training"
                className="inline-flex items-center justify-center min-h-[52px] px-7 bg-[#131519]/80 hover:bg-[#191B20] text-white border border-[#23272F] hover:border-[#343A46] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all"
              >
                1:1 Sistemi İncele
              </Link>
            </div>
          </ScrollReveal>

          {/* Subtle Trust Indicators */}
          <ScrollReveal variant="fade-up" delay={0.55} duration={0.6}>
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-12 mt-12 border-t border-[#23272F]/70 text-xs font-mono uppercase tracking-wider text-[#72757C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E8FF36]" />
                <span>Tamamen Birebir (1:1)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8FF36]" />
                <span>Nişantaşı / İstanbul</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
