"use client";

import React from "react";
import Link from "next/link";
import { STORIES_DATA } from "@/data/stories";
import { Star, ArrowRight, Quote, Sparkles } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export const TestimonialTeaser: React.FC = () => {
  const featuredStories = STORIES_DATA.slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-[#FBFBFD] dark:bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Google Transparent Rating */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-black/[0.06] dark:border-white/[0.08]">
          <ScrollReveal variant="fade-up">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GERÇEK DENEYİMLER</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Ölçülebilir Sonuçlar.
              </h2>
            </div>
          </ScrollReveal>

          {/* Apple Frosted Google Score Pill */}
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="rounded-2xl p-3.5 sm:p-4 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">4.2 / 5</span>
              </div>
              <div className="border-l border-black/[0.08] dark:border-white/[0.1] pl-4 text-xs">
                <span className="text-slate-900 dark:text-white block font-semibold">Google Değerlendirmesi</span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">62 doğrulanmış gerçek üye yorumu</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stories Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {featuredStories.map((item) => (
            <StaggerItem key={item.id}>
              <div className="rounded-[28px] p-7 bg-white/75 dark:bg-[#121214]/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col justify-between h-full group">
                <div>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                    <Quote className="w-4 h-4" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                    &ldquo;{item.experience}&rdquo;
                  </p>

                  <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] mb-6">
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      KAZANIM:
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {item.highlightMetric}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.client}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.clientTitle}</p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-black/[0.03] dark:bg-white/[0.06] px-2.5 py-1 rounded-full">
                      {item.duration}
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Action to full stories page */}
        <ScrollReveal variant="fade-up" delay={0.25}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/basari-hikayeleri"
              className="inline-flex items-center gap-2.5 min-h-[48px] px-7 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/[0.08] dark:border-white/[0.12] text-slate-800 dark:text-white text-xs font-semibold tracking-wide transition-all"
            >
              <span>Tüm Üye Deneyimlerini & Hikayelerini Oku</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
