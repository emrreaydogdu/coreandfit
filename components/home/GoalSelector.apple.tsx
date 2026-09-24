"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GOALS_DATA } from "@/data/goals";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, Reveal } from "@/components/glass/GlassPrimitives";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.32, 0.72, 0, 1] as const;

export const GoalSelector: React.FC = () => {
  const [activeGoalId, setActiveGoalId] = useState<string>("yag-kaybi");
  const currentGoal = GOALS_DATA.find((g) => g.id === activeGoalId) || GOALS_DATA[0];

  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>Kişisel hedefiniz</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] font-semibold">
              Önceliğiniz <span className="cg-serif cg-accent">nedir?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="cg-ink-2 cg-pretty text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
              Öncelikli hedefinizi seçin; biyomekanik yaklaşımımızı ve stüdyomuzdaki seans protokolünü inceleyin.
            </p>
          </Reveal>
        </div>

        {/* Segment kontrolü: kayan cam gösterge */}
        <Reveal delay={0.2}>
          <div
            role="tablist"
            aria-label="Hedef seçimi"
            className="mt-12 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar"
          >
            <div className="cg-glass inline-flex p-1.5 rounded-full gap-1">
              {GOALS_DATA.map((goal) => {
                const isSelected = goal.id === activeGoalId;
                return (
                  <button
                    key={goal.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveGoalId(goal.id)}
                    className={cn(
                      "cg-focus relative px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors duration-500",
                      isSelected ? "cg-ink" : "cg-ink-3 hover:text-[var(--cg-ink)]"
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="cg-goal-pill"
                        className="absolute inset-0 rounded-full bg-[var(--cg-glass-strong)] shadow-[0_0_0_1px_var(--cg-edge),0_8px_20px_-8px_rgba(16,60,45,0.3)]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative">{goal.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Detay paneli */}
        <Reveal delay={0.25}>
          <div className="cg-shell cg-shell-lg mt-6">
            <div className="cg-core p-6 sm:p-10 lg:p-12 min-h-[26rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGoal.id}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14"
                >
                  <div className="lg:col-span-7">
                    <span className="cg-label">Seçilen hedef · {currentGoal.name}</span>
                    <h3 className="cg-display cg-ink text-2xl sm:text-4xl font-semibold leading-[1.1] mt-4">
                      {currentGoal.tagline}
                    </h3>
                    <p className="cg-ink-2 cg-pretty text-[15px] sm:text-base leading-relaxed mt-5 max-w-xl">
                      {currentGoal.summary}
                    </p>

                    <p className="cg-label mt-10 mb-4">Bu hedefte nasıl çalışıyoruz</p>
                    <ul className="cg-divide">
                      {currentGoal.howWeWork.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-4 py-3.5 text-[14px] sm:text-[15px] cg-ink-2">
                          <span className="cg-num cg-ink-3 text-xs font-semibold pt-0.5 w-5 shrink-0">0{idx + 1}</span>
                          <span className="cg-pretty">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Önerilen model */}
                  <div className="lg:col-span-5">
                    <div className="cg-shell h-full">
                      <div className="cg-core cg-core-tint h-full p-6 sm:p-8 flex flex-col">
                        <span className="cg-label">Önerilen çalışma modeli</span>
                        <p className="cg-ink text-2xl font-semibold tracking-tight mt-3">
                          {currentGoal.recommendedServiceTitle}
                        </p>
                        <p className="cg-ink-3 cg-pretty text-[14px] leading-relaxed mt-3">
                          Bu hedef için hazırlanan antrenman periyotlamasını ön görüşmede kurucu koçumuzla detaylandırabilirsiniz.
                        </p>
                        <div className="flex items-center gap-2 mt-6 text-[13px] font-medium cg-ink-2">
                          <Check className="w-4 h-4 cg-accent" strokeWidth={1.75} />
                          Ücretsiz ön görüşme
                        </div>

                        <div className="mt-auto pt-10 flex flex-col gap-2.5">
                          <Link href={`/on-gorusme?hedef=${currentGoal.slug}`} className="cg-btn cg-btn-ink justify-between w-full">
                            <span>Hedefime uygun programı gör</span>
                            <span className="cg-btn-icon">
                              <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                            </span>
                          </Link>
                          <Link
                            href={`/antrenman/${currentGoal.recommendedServiceSlug}`}
                            className="cg-btn cg-btn-ghost w-full"
                          >
                            Program detaylarını incele
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
