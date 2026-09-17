import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { STORIES_DATA } from "@/data/stories";
import { Quote, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Başarı Hikayeleri & Üye Deneyimleri | Nişantaşı Core & Fit",
  description:
    "Core & Fit Private Sport Studio üyelerinin gerçek deneyimleri, çalışma süreleri, uygulanan programlar ve ölçülebilir kazanımları.",
};

export default function BasariHikayeleriPage() {
  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
            [ GERÇEKÇİ SÜREÇLER & İLERLEME ]
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
            Başarı Hikayeleri
          </h1>
          <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
            Abartılı veya uydurma iddialar yerine; disiplinli çalışma, bilimsel periyotlama ve koçluk desteği ile üyelerimizin hayatlarına kattıkları gerçek kazanımlar.
          </p>
        </div>
      </section>

      {/* Stories List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {STORIES_DATA.map((story, idx) => (
            <div
              key={story.id}
              className="bg-[#0D0F12] border border-[#23272F] p-6 sm:p-10 lg:p-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {story.image && (
                  <div className="lg:col-span-4">
                    <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#23272F]">
                      <Image
                        src={story.image}
                        alt={`${story.client} - Core & Fit`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-[#0D0F12] via-transparent to-transparent opacity-40 dark:opacity-60" />
                      <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 dark:bg-[#08090B]/90 border border-[#E2E4E9] dark:border-[#23272F]">
                        <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider block">
                          ÖNE ÇIKAN SONUÇ
                        </span>
                        <p className="text-xs font-bold text-white mt-0.5">
                          {story.highlightMetric}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${story.image ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>
                  {/* Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#191B20]">
                    <div>
                      <h2 className="text-2xl font-bold uppercase font-display text-white">
                        {story.client}
                      </h2>
                      <p className="text-xs text-[#72757C]">{story.clientTitle}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#131519] border border-[#23272F] text-xs font-mono text-[#E8FF36]">
                        {story.duration}
                      </span>
                    </div>
                  </div>

                  {/* Program and goal tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-[#131519] border border-[#191B20]">
                      <span className="text-[#72757C] block text-[10px] uppercase">
                        HEDEF
                      </span>
                      <span className="text-white font-semibold">{story.goal}</span>
                    </div>
                    <div className="p-3 bg-[#131519] border border-[#191B20]">
                      <span className="text-[#72757C] block text-[10px] uppercase">
                        UYGULANAN PROTOKOL
                      </span>
                      <span className="text-white font-semibold">{story.program}</span>
                    </div>
                  </div>

                  {/* Client Quote */}
                  <div className="relative">
                    <Quote className="w-8 h-8 text-[#E8FF36]/30 mb-2" />
                    <p className="text-sm text-[#A5A7AD] leading-relaxed italic">
                      &ldquo;{story.experience}&rdquo;
                    </p>
                  </div>

                  {/* Coach Observation */}
                  <div className="p-4 bg-[#08090B] border-l-2 border-[#E8FF36] text-xs">
                    <span className="font-mono text-[#E8FF36] uppercase tracking-wider block mb-1 font-bold">
                      KOÇ DEĞERLENDİRMESİ:
                    </span>
                    <p className="text-[#A5A7AD] leading-relaxed">{story.coachNote}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="mt-16 text-center">
          <Link
            href="/on-gorusme"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
          >
            <span>Kendi Yol Haritanızı Çıkarmak İçin Ön Görüşme Alın</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
