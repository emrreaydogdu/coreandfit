"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const PILLARS = [
  {
    num: "01",
    title: "Kişisel Programlama",
    description:
      "Vücut tipinize, geçmiş sakatlıklarınıza ve günlük temponuza uygun, dinamik olarak yenilenen antrenman planı.",
  },
  {
    num: "02",
    title: "Birebir Koçluk & Dikkatin Tamamı",
    description:
      "Seans boyunca koçunuzun dikkati asla dağılmaz. Her sette ağırlık, tekrar, duruş ve tempo kontrol altındadır.",
  },
  {
    num: "03",
    title: "Biyomekanik & Teknik Takip",
    description:
      "Ağırlığı kaldırmak kadar nasıl kaldırdığınız önemlidir. Eklemleri koruyan, sakatlık riskini sıfıra indiren doğru açı prensibi.",
  },
  {
    num: "04",
    title: "Performans & Veri Kaydı",
    description:
      "Rastgele çalışma yok. Kaldırılan kilolar, toparlanma süreleri ve kondisyon zonları düzenli kayıt altına alınır.",
  },
  {
    num: "05",
    title: "Dinamik Program Güncelleme",
    description:
      "Vücudunuz adapte oldukça antrenman periyotlaması revize edilir. Platonun (gelişim duraksamasının) önüne geçilir.",
  },
  {
    num: "06",
    title: "Sürdürülebilir İlerleme",
    description:
      "Kısa süreli açlık diyetleri veya aşırı yıpranma yerine; yaşamınıza entegre olan kalıcı bir güç ve estetik formu.",
  },
];

export const PersonalTrainingSpotlight: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#191B20]">
          <ScrollReveal variant="fade-up">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                [ 02 • ÖNCELİKLİ HİZMET ]
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display">
                1:1. Tamamen Sana Özel.
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.15}>
            <p className="text-sm sm:text-base text-[#A5A7AD] max-w-md">
              Her antrenman; hedefe, performansa, kondisyon seviyesine, hareket kapasitesine ve antrenman geçmişine göre planlanır.
            </p>
          </ScrollReveal>
        </div>

        {/* Photography + Editorial Pillar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-center">
          {/* Main Photo Card */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="zoom-in" duration={0.8}>
              <div className="relative aspect-[3/4] w-full border border-[#23272F] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80"
                  alt="1:1 Personal Training Seansı"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-[#08090B] via-transparent to-transparent opacity-40 dark:opacity-90" />

                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 dark:bg-[#0D0F12]/95 border border-[#E2E4E9] dark:border-[#23272F] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#E8FF36]" />
                    <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                      ÖZEL STÜDYO STANDARDI
                    </span>
                  </div>
                  <p className="text-xs text-[#A5A7AD] leading-relaxed">
                    Aynı saat diliminde stüdyoda yalnızca randevulu üyeler ve antrenörleri yer alır.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Pillars List - Staggered scroll animation */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <StaggerContainer staggerDelay={0.08} className="divide-y divide-[#191B20]">
              {PILLARS.map((pillar) => (
                <StaggerItem
                  key={pillar.num}
                  className="py-5 group hover:bg-[#0D0F12]/60 px-4 transition-colors duration-150 flex items-start gap-4"
                >
                  <span className="font-mono text-xs text-[#E8FF36] font-bold mt-1 shrink-0">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase font-display group-hover:text-[#E8FF36] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A5A7AD] mt-1 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Action */}
            <ScrollReveal variant="fade-up" delay={0.3}>
              <div className="pt-8 px-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/personal-training"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 bg-white text-[#08090B] hover:bg-[#F4F4F1] font-bold text-xs uppercase tracking-wider transition-all w-full sm:w-auto"
                >
                  <span>1:1 Antrenmanı İncele</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/on-gorusme?hizmet=personal-training"
                  className="inline-flex items-center justify-center min-h-[48px] px-6 bg-[#131519] border border-[#23272F] text-white hover:border-[#343A46] font-semibold text-xs uppercase tracking-wider transition-all w-full sm:w-auto"
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
