"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const STEPS = [
  {
    step: "01",
    title: "ANALİZ",
    subtitle: "Başlangıç Noktası",
    description:
      "Hedef, mevcut kondisyon seviyesi, spor geçmişi, biyomekanik kısıtlılıklar ve beklentiler kapsamlı bir ön görüşmede değerlendirilir.",
    deliverable: "Postür & Mobilite Raporu",
  },
  {
    step: "02",
    title: "PLAN",
    subtitle: "Mühendislik Yaklaşımı",
    description:
      "Kişinin takvimine ve hedefine uygun haftalık periyotlama, egzersiz seçimi ve hacim/yoğunluk parametreleri bilimsel olarak kurgulanır.",
    deliverable: "Kişiselleştirilmiş Antrenman Blokları",
  },
  {
    step: "03",
    title: "TRAIN",
    subtitle: "Kusursuz Uygulama",
    description:
      "Koç eşliğinde doğru tempo, eklem açısı ve maksimum odakla birebir çalışılır. Hatalı form anında düzeltilir.",
    deliverable: "Birebir Koçluk & Güvenli Yükleme",
  },
  {
    step: "04",
    title: "TRACK",
    subtitle: "Ölçülebilir Sonuç",
    description:
      "Kaldırılan ağırlıklar, nabız zonları ve vücut kompozisyonundaki değişimler düzenli ölçülür; program sürekli optimize edilir.",
    deliverable: "Aylık Gelişim & Kuvvet Kaydı",
  },
];

export const SystemSection: React.FC = () => {
  return (
    <section id="sistemimiz" className="py-20 lg:py-28 bg-[#0D0F12] border-y border-[#191B20] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <ScrollReveal variant="fade-up">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
              [ 03 • ÇALIŞMA METODOLOJİSİ ]
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.05]">
              Rastgele antrenman değil. <br />
              <span className="text-[#A5A7AD]">Sistem.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-sm sm:text-base text-[#A5A7AD] mt-4 leading-relaxed">
              Spor salonunda ne yapacağını düşünerek vakit kaybetmeyin. 4 adımlı Core & Fit metodolojisi her seansınızın net bir amaca hizmet etmesini sağlar.
            </p>
          </ScrollReveal>
        </div>

        {/* Editorial Process Layout - Staggered horizontal flow */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#23272F] border border-[#23272F]"
        >
          {STEPS.map((item, index) => (
            <StaggerItem
              key={item.step}
              className="bg-[#08090B] p-8 lg:p-10 flex flex-col justify-between relative group hover:bg-[#0D0F12] transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl lg:text-4xl font-extrabold font-mono text-[#E8FF36] group-hover:scale-105 transition-transform">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-mono text-[#72757C] uppercase tracking-widest">
                    ADIM {index + 1}/4
                  </span>
                </div>

                <span className="text-[11px] font-mono uppercase text-[#72757C] tracking-widest block mb-1">
                  {item.subtitle}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-display mb-4 group-hover:text-[#E8FF36] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#191B20]">
                <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider block">
                  ÇIKTI:
                </span>
                <span className="text-xs text-white font-medium">
                  {item.deliverable}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-[#131519] border border-[#23272F]">
            <div>
              <p className="text-sm font-bold text-white uppercase font-display">
                Bu sistemi kendi hedefinize uygulamak ister misiniz?
              </p>
              <p className="text-xs text-[#A5A7AD] mt-0.5">
                Ücretsiz ön görüşmede 15 dakikalık postür ve hedef değerlendirmenizi yapalım.
              </p>
            </div>

            <Link
              href="/on-gorusme"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors shrink-0"
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
