"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Eyebrow, Reveal, Stagger, StaggerChild } from "@/components/glass/GlassPrimitives";

const STEPS = [
  {
    step: "01",
    title: "Ön analiz & hedef",
    subtitle: "Başlangıç noktası",
    description:
      "Postür, eklem hareket açıklığı, spor geçmişi ve sağlık durumunuz ön görüşmede birebir değerlendirilir.",
    deliverable: "Postür & mobilite raporu",
  },
  {
    step: "02",
    title: "Kişisel program",
    subtitle: "Bilimsel planlama",
    description:
      "Haftalık takviminiz, iş temponuz ve öncelikli hedefinize uygun seans periyotlaması oluşturulur.",
    deliverable: "Özelleştirilmiş antrenman planı",
  },
  {
    step: "03",
    title: "Birebir uygulama",
    subtitle: "Kusursuz seans",
    description:
      "Her sette doğru açı, tempo ve nefes kontrolüyle kurucu koç İlker Yüksel eşliğinde çalışılır.",
    deliverable: "Birebir seans & form takibi",
  },
  {
    step: "04",
    title: "Gelişim & rapor",
    subtitle: "Ölçülebilir sonuç",
    description:
      "Kaldırılan ağırlıklar ve güç artışı kişisel üye portalınıza kaydedilir; program düzenli optimize edilir.",
    deliverable: "Aylık ilerleme & kuvvet kaydı",
  },
];

export const SystemSection: React.FC = () => {
  return (
    <section id="sistemimiz" className="relative py-24 lg:py-36 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          {/* Sol: yapışkan başlık */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <Reveal>
                <Eyebrow>4 adımlı sistem</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.04] font-semibold">
                  Ölçülebilir bir süreç.{" "}
                  <span className="cg-serif cg-ink-3">Tahmine yer yok.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="cg-ink-2 cg-pretty text-base sm:text-lg leading-relaxed mt-7 max-w-md">
                  Salona geldiğinizde ne yapacağınızı düşünerek vakit kaybetmeyin. İlk günden hedefe ulaşana kadar her adımınız önceden planlanmıştır.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="cg-shell mt-10">
                  <div className="cg-core cg-core-tint p-6 sm:p-7">
                    <p className="cg-ink text-lg font-semibold tracking-tight">Bu süreci hedeflerinize uyarlayalım</p>
                    <p className="cg-ink-3 text-[14px] leading-relaxed mt-1.5">
                      Ücretsiz ön görüşmede 15 dakikalık postür ve hedef değerlendirmenizi yapalım.
                    </p>
                    <Link href="/on-gorusme" className="cg-btn cg-btn-accent cg-btn-sm mt-6">
                      <span>Ön görüşme talep et</span>
                      <span className="cg-btn-icon">
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Sağ: dikey zaman çizelgesi */}
          <Stagger className="lg:col-span-7 relative flex flex-col gap-4 lg:gap-5" gap={0.12}>
            <div
              aria-hidden="true"
              className="absolute left-[3.375rem] sm:left-[4.125rem] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-[var(--cg-accent)] to-transparent opacity-40"
            />
            {STEPS.map((item) => (
              <StaggerChild key={item.step}>
                <div className="cg-shell cg-lift">
                  <div className="cg-core p-6 sm:p-8 flex gap-5 sm:gap-7">
                    <div className="shrink-0">
                      <span className="cg-num w-12 h-12 sm:w-14 sm:h-14 rounded-2xl cg-glass flex items-center justify-center cg-accent font-semibold text-base sm:text-lg">
                        {item.step}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="cg-label">{item.subtitle}</span>
                      <h3 className="cg-ink text-xl sm:text-2xl font-semibold tracking-tight mt-2">{item.title}</h3>
                      <p className="cg-ink-3 cg-pretty text-[14px] sm:text-[15px] leading-relaxed mt-2.5 max-w-lg">
                        {item.description}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[var(--cg-accent-soft)] text-[12px] font-medium cg-ink-2">
                        <CheckCircle2 className="w-3.5 h-3.5 cg-accent shrink-0" strokeWidth={1.75} />
                        {item.deliverable}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
};
