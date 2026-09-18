"use client";

import React from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const EditorialStatement: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#0D0F12] border-y border-[#191B20] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Headline & Statement */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ScrollReveal variant="fade-up">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36]">
                [ 01 • MARKA FELSEFESİ ]
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.1}>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.08]">
                Her tekrarın <br />
                <span className="text-[#A5A7AD]">bir amacı var.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.2}>
              <div className="space-y-4 text-base sm:text-lg text-[#A5A7AD] leading-relaxed">
                <p>
                  Core & Fit&apos;te antrenman programı hazır şablonlardan oluşturulmaz. Hedef, mevcut seviye, yaşam düzeni ve performansa göre planlanır.
                </p>
                <p className="text-sm text-[#72757C]">
                  Sıradan bir salonda makineler arasında kaybolmak yerine; her hareketin anatomik gerekçesini bilerek, doğru açıyla ve kesintisiz gözetim altında çalışırsınız.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.3}>
              <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[#23272F] text-xs font-mono uppercase tracking-wider">
                <div className="p-3 bg-[#08090B]/60 border border-[#191B20]">
                  <span className="block text-2xl sm:text-3xl font-bold text-white font-display">1:1</span>
                  <span className="text-[#72757C] text-[11px]">Birebir Koçluk</span>
                </div>
                <div className="p-3 bg-[#08090B]/60 border border-[#191B20]">
                  <span className="block text-2xl sm:text-3xl font-bold text-[#E8FF36] font-display">50&apos;</span>
                  <span className="text-[#72757C] text-[11px]">Net Odaklanma</span>
                </div>
                <div className="p-3 bg-[#08090B]/60 border border-[#191B20]">
                  <span className="block text-2xl sm:text-3xl font-bold text-white font-display">%100</span>
                  <span className="text-[#72757C] text-[11px]">Kişisel Takip</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Editorial Atmospheric Video */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="zoom-in" delay={0.25} duration={0.8}>
              <div className="relative aspect-[4/5] w-full border border-[#23272F] overflow-hidden group bg-black">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-[#08090B] via-transparent to-transparent opacity-40 dark:opacity-80 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 dark:bg-[#08090B]/90 border border-[#E2E4E9] dark:border-[#23272F] backdrop-blur-sm z-10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider">
                      NİŞANTAŞI STÜDYO DENEYİMİ
                    </p>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-[#72757C]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36] animate-pulse" />
                      CANLI ODAK
                    </span>
                  </div>
                  <p className="text-xs text-white mt-0.5">
                    Özel randevu ile sınırlı sayıda üye kabul eden butik performans alanı.
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
