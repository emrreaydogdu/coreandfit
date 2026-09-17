"use client";

import React from "react";
import Link from "next/link";
import { X, Check } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const COMPARISONS = [
  {
    category: "Programlama",
    gym: "Hazır şablonlar, herkese aynı karton egzersiz listesi.",
    coreAndFit: "Postür, biyomekanik ve yaşam düzeninize göre sıfırdan kurgulanan periyotlama.",
  },
  {
    category: "Ortam & Alan",
    gym: "Aynı anda yüzlerce kişi, alet sırası bekleme, gürültü ve dikkat dağınıklığı.",
    coreAndFit: "Yalnızca randevulu danışanlar ve koçları. Kesintisiz odak ve özel alan.",
  },
  {
    category: "Teknik & Güvenlik",
    gym: "Kendi başınızasınız. Hatalı form ve eklem zorlanması fark edilmez.",
    coreAndFit: "Her tekrarda milimetrik form düzeltmesi, tempo kontrolü ve sakatlık koruması.",
  },
  {
    category: "Takip & Veri",
    gym: "Hangi ağırlığı ne zaman kaldırdığınız unutulur, gelişim tesadüfe kalır.",
    coreAndFit: "Seans bazlı ağırlık, nabız ve hacim kaydı. Raporlanabilir ölçülebilir ilerleme.",
  },
  {
    category: "Motivasyon & Disiplin",
    gym: "Gitmediğinizde kimse aramaz; abonelik ücreti boşa gider.",
    coreAndFit: "Koçunuzla randevulu ortak takvim. Kararlı, sürdürülebilir ve kesintisiz sorumluluk.",
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#0D0F12] border-y border-[#191B20] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <ScrollReveal variant="fade-up">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
              [ 05 • STÜDYO FARKI ]
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.05]">
              Kalabalık salon deneyimini <br />
              <span className="text-[#A5A7AD]">geride bırak.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-sm sm:text-base text-[#A5A7AD] mt-4">
              Zamanınız ve sağlığınız değerli. Klasik fitness merkezlerinin yarattığı verimsizliği private sport studio modeliyle sonlandırıyoruz.
            </p>
          </ScrollReveal>
        </div>

        {/* Comparison Editorial Grid */}
        <ScrollReveal variant="fade-up" delay={0.25}>
          <div className="border border-[#23272F] bg-[#08090B] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#23272F] bg-[#131519] text-xs font-mono uppercase tracking-wider">
              <div className="md:col-span-3 p-4 text-[#72757C]">Özellik / Kriter</div>
              <div className="md:col-span-4 p-4 text-[#72757C] border-t md:border-t-0 md:border-l border-[#23272F]">
                Klasik Spor Salonu
              </div>
              <div className="md:col-span-5 p-4 text-[#E8FF36] font-bold border-t md:border-t-0 md:border-l border-[#23272F] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8FF36]" />
                Core & Fit Private Studio
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#191B20]">
              {COMPARISONS.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 group hover:bg-[#0D0F12]/80 transition-colors"
                >
                  {/* Criterion */}
                  <div className="md:col-span-3 p-4 sm:p-5 flex items-center">
                    <span className="text-xs font-mono uppercase text-white font-bold tracking-wider">
                      {row.category}
                    </span>
                  </div>

                  {/* Traditional Gym */}
                  <div className="md:col-span-4 p-4 sm:p-5 border-t md:border-t-0 md:border-l border-[#191B20] text-xs text-[#72757C] flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{row.gym}</span>
                  </div>

                  {/* Core & Fit */}
                  <div className="md:col-span-5 p-4 sm:p-5 border-t md:border-t-0 md:border-l border-[#191B20] bg-[#0D0F12]/40 text-xs sm:text-sm text-white flex items-start gap-2.5 font-medium">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{row.coreAndFit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Callout */}
        <ScrollReveal variant="fade-up" delay={0.35}>
          <div className="mt-8 text-center sm:text-right">
            <Link
              href="/on-gorusme"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E8FF36] hover:underline"
            >
              <span>Nişantaşı stüdyomuzu ziyaret ederek farkı kendiniz görün</span>
              <span>→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
