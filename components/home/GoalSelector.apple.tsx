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
    <section className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-y border-black/[0.06] dark:border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HEDEFİNİZE GÖRE PLAN</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hedefiniz nedir?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Aşağıdan öncelikli hedefinizi seçin; size özel bilimsel yaklaşımımızı ve önerilen çalışma protokolünü inceleyin.
            </p>
          </ScrollReveal>
        </div>

        {/* Apple Segmented Control Pills */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="inline-flex flex-wrap p-1.5 rounded-[24px] sm:rounded-full bg-black/[0.04] dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] gap-1.5 shadow-inner">
            {GOALS_DATA.map((goal) => {
              const isSelected = goal.id === activeGoalId;
              return (
                <button
                  key={goal.id}
                  onClick={() => setActiveGoalId(goal.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.97]",
                    isSelected
                      ? "bg-white dark:bg-white text-slate-950 shadow-md scale-[1.02]"
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
          <div className="mt-8 rounded-[32px] bg-white/85 dark:bg-[#121214]/85 border border-black/[0.08] dark:border-white/[0.12] p-6 sm:p-10 lg:p-12 shadow-xl overflow-hidden backdrop-blur-2xl">
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
                      SEÇİLEN ODAK: {currentGoal.name}
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
                      BU HEDEFTE NASIL ÇALIŞIYORUZ?
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

                {/* Apple Action Box */}
                <div className="lg:col-span-5 rounded-[24px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      ÖNERİLEN ÇALIŞMA PROTOKOLÜ
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {currentGoal.recommendedServiceTitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Bu hedef için oluşturulan özel antrenman programını ön görüşmede kurucu antrenörümüzle detaylandırabilirsiniz.
                    </p>
                  </div>

                  <div className="pt-8 flex flex-col gap-3">
                    <Link
                      href={`/on-gorusme?hedef=${currentGoal.slug}`}
                      className="flex items-center justify-center gap-2 w-full min-h-[48px] px-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wide hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all shadow-md"
                    >
                      <span>Hedefime Uygun Programı Gör</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/antrenman/${currentGoal.recommendedServiceSlug}`}
                      className="flex items-center justify-center w-full min-h-[44px] rounded-full bg-black/[0.03] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-semibold border border-black/[0.06] dark:border-white/[0.08] transition-colors"
                    >
                      Protokol Detaylarını İncele
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
