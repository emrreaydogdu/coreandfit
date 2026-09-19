"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GOALS_DATA } from "@/data/goals";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "motion/react";

export const GoalSelector: React.FC = () => {
  const [activeGoalId, setActiveGoalId] = useState<string>("yag-kaybi");
  const currentGoal =
    GOALS_DATA.find((g) => g.id === activeGoalId) || GOALS_DATA[0];

  return (
    <section className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-y border-black/[0.06] dark:border-white/[0.08] relative overflow-hidden">
      {/* Environmental Light Refraction */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KİŞİSEL HEDEFİNİZ</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Önceliğiniz nedir?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Aşağıdan öncelikli hedefinizi seçin; biyomekanik yaklaşımımızı ve stüdyomuzdaki seans protokolünü inceleyin.
            </p>
          </ScrollReveal>
        </div>

        {/* Apple iOS Liquid Glass Segmented Control Pills */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="inline-flex flex-wrap p-1.5 rounded-[24px] sm:rounded-full liquid-glass-pill gap-1.5 shadow-sm">
            {GOALS_DATA.map((goal) => {
              const isSelected = goal.id === activeGoalId;
              return (
                <button
                  key={goal.id}
                  onClick={() => setActiveGoalId(goal.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.97]",
                    isSelected
                      ? "bg-white dark:bg-white/[0.18] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/10 scale-[1.02]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {goal.name}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active Goal Detailed View with Apple Liquid Glass Frame */}
        <ScrollReveal variant="fade-up" delay={0.25}>
          <div className="mt-8 rounded-[34px] liquid-glass-panel p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGoal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Goal Narrative */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                      Seçilen Hedef: {currentGoal.name}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {currentGoal.tagline}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentGoal.summary}
                  </p>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold uppercase text-slate-900 dark:text-white tracking-wider block">
                      Bu hedefte nasıl çalışıyoruz?
                    </span>
                    <ul className="space-y-2.5">
                      {currentGoal.howWeWork.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apple Action Box in Liquid Glass Card */}
                <div className="lg:col-span-5 rounded-[26px] liquid-glass-card p-6 sm:p-8 flex flex-col justify-between h-full shadow-md">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Önerilen Çalışma Modeli
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {currentGoal.recommendedServiceTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Bu hedef için hazırlanan antrenman periyotlamasını ön görüşmede kurucu koçumuzla detaylandırabilirsiniz.
                    </p>
                  </div>

                  <div className="pt-8 flex flex-col gap-3">
                    <Link
                      href={`/on-gorusme?hedef=${currentGoal.slug}`}
                      className="flex items-center justify-center gap-2 w-full min-h-[50px] px-6 rounded-full liquid-glass-btn-primary font-semibold text-xs tracking-wide select-none"
                    >
                      <span>Hedefime Uygun Programı Gör</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/antrenman/${currentGoal.recommendedServiceSlug}`}
                      className="flex items-center justify-center w-full min-h-[44px] rounded-full liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-semibold transition-colors select-none"
                    >
                      Program Detaylarını İncele
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
