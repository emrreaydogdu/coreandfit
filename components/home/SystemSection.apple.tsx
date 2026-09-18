"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const STEPS = [
  {
    step: "01",
    title: "Analiz",
    subtitle: "Başlangıç Noktası",
    description:
      "Hedef, mevcut kondisyon seviyesi, spor geçmişi, biyomekanik kısıtlılıklar ve beklentiler kapsamlı bir ön görüşmede değerlendirilir.",
    deliverable: "Postür & Mobilite Raporu",
  },
  {
    step: "02",
    title: "Plan",
    subtitle: "Mühendislik Yaklaşımı",
    description:
      "Kişinin takvimine ve hedefine uygun haftalık periyotlama, egzersiz seçimi ve hacim/yoğunluk parametreleri bilimsel olarak kurgulanır.",
    deliverable: "Kişiselleştirilmiş Antrenman Blokları",
  },
  {
    step: "03",
    title: "Train",
    subtitle: "Kusursuz Uygulama",
    description:
      "Koç eşliğinde doğru tempo, eklem açısı ve maksimum odakla birebir çalışılır. Hatalı form anında düzeltilir.",
    deliverable: "Birebir Koçluk & Güvenli Yükleme",
  },
  {
    step: "04",
    title: "Track",
    subtitle: "Ölçülebilir Sonuç",
    description:
      "Kaldırılan ağırlıklar, nabız zonları ve vücut kompozisyonundaki değişimler düzenli ölçülür; program sürekli optimize edilir.",
    deliverable: "Aylık Gelişim & Kuvvet Kaydı",
  },
];

export const SystemSection: React.FC = () => {
  return (
    <section id="sistemimiz" className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-y border-black/[0.06] dark:border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ÇALIŞMA METODOLOJİSİ</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Rastgele antrenman değil. <br />
              <span className="text-slate-600 dark:text-slate-400">Bilimsel sistem.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              Spor salonunda ne yapacağını düşünerek vakit kaybetmeyin. 4 adımlı Core & Fit metodolojisi her seansınızın net bir amaca hizmet etmesini sağlar.
            </p>
          </ScrollReveal>
        </div>

        {/* 4 Apple Step Cards */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STEPS.map((item, index) => (
            <StaggerItem
              key={item.step}
              className="rounded-[28px] p-7 lg:p-8 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl lg:text-4xl font-black tracking-tight text-emerald-700 dark:text-emerald-400 font-mono">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                    ADIM {index + 1}/4
                  </span>
                </div>

                <span className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 tracking-wider block mb-1">
                  {item.subtitle}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
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

        {/* Bottom CTA Card */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="mt-10 rounded-[28px] p-6 sm:p-8 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Bu sistemi kendi hedefinize uygulamak ister misiniz?
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Ücretsiz ön görüşmede 15 dakikalık postür ve hedef değerlendirmenizi yapalım.
              </p>
            </div>

            <Link
              href="/on-gorusme"
              className="inline-flex items-center gap-2.5 min-h-[48px] px-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wide hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all shrink-0 shadow-sm"
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
