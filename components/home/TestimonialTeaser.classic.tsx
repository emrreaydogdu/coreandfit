"use client";

import React from "react";
import Link from "next/link";
import { STORIES_DATA } from "@/data/stories";
import { Star, ArrowRight, Quote } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export const TestimonialTeaser: React.FC = () => {
  const featuredStories = STORIES_DATA.slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Google Transparent Rating */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#191B20]">
          <ScrollReveal variant="fade-up">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                [ 06 • GERÇEK DENEYİMLER ]
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display">
                Ölçülebilir Sonuçlar.
              </h2>
            </div>
          </ScrollReveal>

          {/* Transparent Google Score Callout */}
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="bg-[#0D0F12] border border-[#23272F] p-4 flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[#E8FF36]">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8FF36]" />
                  ))}
                  <Star className="w-4 h-4 text-[#E8FF36] fill-[#E8FF36]/30" />
                </div>
                <span className="text-sm font-bold text-white mt-1">4.2 / 5</span>
              </div>
              <div className="border-l border-[#23272F] pl-4 text-xs font-mono">
                <span className="text-white block font-semibold">Google Değerlendirmesi</span>
                <span className="text-[#72757C]">62 doğrulanmış yorum</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stories Grid */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {featuredStories.map((item) => (
            <StaggerItem key={item.id}>
              <div className="bg-[#0D0F12] border border-[#23272F] p-6 sm:p-8 flex flex-col justify-between hover:border-[#343A46] transition-colors h-full">
                <div>
                  <Quote className="w-6 h-6 text-[#E8FF36]/40 mb-4" />

                  <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed italic mb-6">
                    &ldquo;{item.experience}&rdquo;
                  </p>

                  <div className="p-3 bg-[#131519] border border-[#191B20] mb-6">
                    <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider block">
                      KAZANIM:
                    </span>
                    <span className="text-xs font-bold text-white">
                      {item.highlightMetric}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#191B20]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase font-display">
                        {item.client}
                      </h4>
                      <p className="text-[11px] text-[#72757C]">{item.clientTitle}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#72757C] border border-[#23272F] px-2 py-1">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#131519] border border-[#23272F] text-white hover:border-[#343A46] text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <span>Tüm Üye Deneyimlerini & Hikayelerini Oku</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8FF36]" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
