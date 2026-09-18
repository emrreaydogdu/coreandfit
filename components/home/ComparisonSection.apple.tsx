"use client";

import React from "react";
import Link from "next/link";
import { X, Check, Sparkles, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const COMPARISONS = [
  {
    category: "Programlama",
    gym: "Hazır şablonlar, herkese aynı standart egzersiz listesi.",
    coreAndFit: "Postür, biyomekanik ve yaşam düzeninize göre sıfırdan kurgulanan periyotlama.",
  },
  {
    category: "Ortam & Alan",
    gym: "Aynı anda onlarca kişi, alet sırası bekleme, gürültü ve dikkat dağınıklığı.",
    coreAndFit: "Yalnızca randevulu danışan ve antrenörü. Sıfır bekleme, kesintisiz odak ve özel alan.",
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
    <section className="py-20 lg:py-28 bg-[#FBFBFD] dark:bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STÜDYO FARKI</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Kalabalık salon deneyimini <br />
              <span className="text-slate-600 dark:text-slate-400">geride bırakın.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              Zamanınız ve sağlığınız değerli. Klasik spor merkezlerinin yarattığı verimsizliği private sport studio modeliyle sonlandırıyoruz.
            </p>
          </ScrollReveal>
        </div>

        {/* Apple Comparison Matrix Card */}
        <ScrollReveal variant="fade-up" delay={0.25}>
          <div className="rounded-[32px] border border-black/[0.08] dark:border-white/[0.12] bg-white/80 dark:bg-[#121214]/80 backdrop-blur-2xl shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-xs font-semibold">
              <div className="md:col-span-3 p-5 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Kriter
              </div>
              <div className="md:col-span-4 p-5 text-slate-600 dark:text-slate-400 border-t md:border-t-0 md:border-l border-black/[0.06] dark:border-white/[0.08] uppercase tracking-wider">
                Klasik Spor Salonu
              </div>
              <div className="md:col-span-5 p-5 text-emerald-700 dark:text-emerald-400 border-t md:border-t-0 md:border-l border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2 uppercase tracking-wider font-bold bg-emerald-500/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Core & Fit Private Studio
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {COMPARISONS.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* Criterion */}
                  <div className="md:col-span-3 p-5 flex items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {row.category}
                    </span>
                  </div>

                  {/* Traditional Gym */}
                  <div className="md:col-span-4 p-5 border-t md:border-t-0 md:border-l border-black/[0.04] dark:border-white/[0.06] text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <span className="leading-relaxed">{row.gym}</span>
                  </div>

                  {/* Core & Fit */}
                  <div className="md:col-span-5 p-5 border-t md:border-t-0 md:border-l border-black/[0.04] dark:border-white/[0.06] bg-emerald-500/[0.02] text-xs sm:text-sm text-slate-800 dark:text-white flex items-start gap-3 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-relaxed">{row.coreAndFit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Callout */}
        <ScrollReveal variant="fade-up" delay={0.35}>
          <div className="mt-8 flex justify-center sm:justify-end">
            <Link
              href="/on-gorusme"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <span>Nişantaşı stüdyomuzu ziyaret ederek farkı kendiniz hissedin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
