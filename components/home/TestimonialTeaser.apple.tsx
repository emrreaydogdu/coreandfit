"use client";

import React from "react";
import Link from "next/link";
import { STORIES_DATA } from "@/data/stories";
import { Star, ArrowRight } from "lucide-react";
import { Eyebrow, Reveal, Stagger, StaggerChild } from "@/components/glass/GlassPrimitives";

export const TestimonialTeaser: React.FC = () => {
  const [featured, ...rest] = STORIES_DATA.slice(0, 3);

  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>Üye deneyimleri</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] font-semibold">
                Gerçek üyeler.{" "}
                <span className="cg-serif cg-accent">Ölçülebilir sonuçlar.</span>
              </h2>
            </Reveal>
          </div>

          {/* Google puanı */}
          <div className="lg:col-span-4 lg:justify-self-end">
            <Reveal delay={0.15}>
              <div className="cg-shell">
                <div className="cg-core cg-core-strong flex items-center gap-5 px-5 py-4">
                  <div>
                    <span className="cg-num cg-ink text-3xl font-semibold tracking-tight">4.2</span>
                    <span className="cg-ink-3 text-sm font-medium"> / 5</span>
                  </div>
                  <div className="border-l cg-hairline pl-5">
                    <div className="flex items-center gap-0.5" aria-label="5 üzerinden 4.2 yıldız">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                      ))}
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" strokeWidth={1.5} />
                    </div>
                    <p className="cg-ink-3 text-[12px] mt-1.5">62 doğrulanmış Google yorumu</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Stagger className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mt-16">
          {/* Öne çıkan hikâye */}
          {featured && (
            <StaggerChild className="lg:col-span-7 lg:row-span-2">
              <article className="cg-shell cg-shell-lg h-full">
                <div className="cg-core cg-core-tint h-full p-7 sm:p-10 lg:p-12 flex flex-col">
                  <span className="cg-serif cg-accent text-7xl leading-none h-10" aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className="cg-ink cg-pretty text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.4] font-medium tracking-tight mt-4">
                    {featured.experience}
                  </blockquote>
                  <div className="mt-auto pt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <p className="cg-ink font-semibold">{featured.client}</p>
                      <p className="cg-ink-3 text-[13px] mt-0.5">{featured.clientTitle}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="cg-label">Kazanım · {featured.duration}</p>
                      <p className="cg-ink text-[15px] font-semibold mt-1.5">{featured.highlightMetric}</p>
                    </div>
                  </div>
                </div>
              </article>
            </StaggerChild>
          )}

          {rest.map((item) => (
            <StaggerChild key={item.id} className="lg:col-span-5">
              <article className="cg-shell cg-lift h-full">
                <div className="cg-core h-full p-7 sm:p-8 flex flex-col">
                  <blockquote className="cg-ink-2 cg-pretty text-[15px] leading-relaxed line-clamp-5">
                    &ldquo;{item.experience}&rdquo;
                  </blockquote>
                  <div className="mt-auto pt-6 border-t cg-hairline flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="cg-ink text-[14px] font-semibold">{item.client}</p>
                      <p className="cg-ink-3 text-[12px] mt-0.5 truncate">{item.clientTitle}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--cg-accent-soft)] cg-accent">
                      {item.duration}
                    </span>
                  </div>
                  <p className="cg-ink-3 text-[12px] mt-3">
                    <span className="cg-accent font-semibold">Kazanım:</span> {item.highlightMetric}
                  </p>
                </div>
              </article>
            </StaggerChild>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <Link href="/basari-hikayeleri" className="cg-link">
              Tüm deneyimleri ve hikâyeleri oku
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
