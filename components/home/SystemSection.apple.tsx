"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const STEPS = [
  {
    step: "01",
    title: "Ön Analiz & Hedef",
    subtitle: "Başlangıç Noktası",
    description:
      "Postür, eklem hareket açıklığı, spor geçmişi ve sağlık durumunuz ön görüşmede birebir değerlendirilir.",
    deliverable: "Postür & Mobilite Raporu",
  },
  {
    step: "02",
    title: "Kişisel Program",
    subtitle: "Bilimsel Planlama",
    description:
      "Haftalık takviminiz, iş temponuz ve öncelikli hedefinize uygun seans periyotlaması oluşturulur.",
    deliverable: "Özelleştirilmiş Antrenman Planı",
  },
  {
    step: "03",
    title: "Birebir Uygulama",
    subtitle: "Kusursuz Seans",
    description:
      "Her sette doğru açı, tempo ve nefes kontrolüyle kurucu koç İlker Yüksel eşliğinde çalışılır.",
    deliverable: "Birebir Seans & Form Takibi",
  },
  {
    step: "04",
    title: "Gelişim & Rapor",
    subtitle: "Ölçülebilir Sonuç",
    description:
      "Kaldırılan ağırlıklar ve güç artışı kişisel üye portalınıza kaydedilir; program düzenli optimize edilir.",
    deliverable: "Aylık İlerleme & Kuvvet Kaydı",
  },
];

export const SystemSection: React.FC = () => {
  return (
    <section id="sistemimiz" className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-y border-black/[0.06] dark:border-white/[0.08] relative overflow-hidden">
      {/* Environmental Ambient Light Refraction */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>4 ADIMLI SİSTEM</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Ölçülebilir bir süreç. <br />
              <span className="text-slate-500 dark:text-slate-400">Tahmine yer yok.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Salona geldiğinizde ne yapacağınızı düşünerek vakit kaybetmeyin. İlk günden hedefe ulaşana kadar her adımınız önceden planlanmıştır.
            </p>
          </ScrollReveal>
        </div>

        {/* 4 Apple Step Liquid Glass Cards */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {STEPS.map((item, index) => (
            <StaggerItem
              key={item.step}
              className="rounded-[30px] p-7 lg:p-8 liquid-glass-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl lg:text-4xl font-black tracking-tight text-emerald-700 dark:text-emerald-400 font-mono">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full liquid-glass-pill text-slate-500 dark:text-slate-400">
                    ADIM {index + 1}/4
                  </span>
                </div>

                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                  {item.subtitle}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-xs">
                    {item.deliverable}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom CTA Card in Liquid Glass Panel */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="mt-10 rounded-[30px] p-7 sm:p-9 liquid-glass-panel flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Bu süreci hedeflerinize uyarlayalım
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ücretsiz ön görüşmede 15 dakikalık postür ve hedef değerlendirmenizi yapalım.
              </p>
            </div>

            <Link
              href="/on-gorusme"
              className="inline-flex items-center gap-2.5 min-h-[50px] px-8 rounded-full liquid-glass-btn-primary font-semibold text-xs tracking-wide shrink-0 select-none"
            >
              <span>Ön Görüşme Talep Et</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
