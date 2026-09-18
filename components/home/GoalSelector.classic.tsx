"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GOALS_DATA } from "@/data/goals";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "motion/react";

export const GoalSelector: React.FC = () => {
  const [activeGoalId, setActiveGoalId] = useState<string>("yag-kaybi");
  const currentGoal =
    GOALS_DATA.find((g) => g.id === activeGoalId) || GOALS_DATA[0];

  return (
    <section className="py-20 lg:py-28 bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <ScrollReveal variant="fade-up">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
              [ 04 • HEDEFİNİZE GÖRE PLAN ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display">
              Hedefin ne?
            </h2>
            <p className="text-sm sm:text-base text-[#A5A7AD] mt-3">
              Aşağıdan birincil hedefinizi seçin; size özel yaklaşımımızı ve önerilen çalışma planını inceleyin.
            </p>
          </ScrollReveal>
        </div>

        {/* Goal Selector Buttons */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="flex flex-wrap gap-2 pb-8 border-b border-[#191B20]">
            {GOALS_DATA.map((goal) => {
              const isSelected = goal.id === activeGoalId;
              return (
                <button
                  key={goal.id}
                  onClick={() => setActiveGoalId(goal.id)}
                  className={cn(
                    "px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border active:scale-[0.97]",
                    isSelected
                      ? "bg-[#E8FF36] text-[#08090B] border-[#E8FF36] shadow-[0_0_15px_rgba(232,255,54,0.15)]"
                      : "bg-[#0D0F12] text-[#A5A7AD] border-[#23272F] hover:border-[#343A46] hover:text-white"
                  )}
                >
                  {goal.name}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active Goal Detailed View with Smooth Fade/Scale */}
        <ScrollReveal variant="fade-up" delay={0.25}>
          <div className="mt-8 bg-[#0D0F12] border border-[#23272F] p-6 sm:p-10 lg:p-12 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGoal.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Goal Narrative */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-[#E8FF36] tracking-wider font-semibold">
                      SEÇİLEN ODAK: {currentGoal.name}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display">
                    {currentGoal.tagline}
                  </h3>

                  <p className="text-sm sm:text-base text-[#A5A7AD] leading-relaxed">
                    {currentGoal.summary}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-mono uppercase text-white tracking-wider block font-semibold">
                      BU HEDEFTE NASIL ÇALIŞIYORUZ?
                    </span>
                    <ul className="space-y-2">
                      {currentGoal.howWeWork.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#A5A7AD]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Box with Query Parameter Routing */}
                <div className="lg:col-span-5 bg-[#131519] border border-[#23272F] p-6 sm:p-8 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#72757C]">
                      ÖNERİLEN PROGRAM MODELİ
                    </span>
                    <p className="text-lg font-bold text-white uppercase font-display mt-1">
                      {currentGoal.recommendedServiceTitle}
                    </p>
                    <p className="text-xs text-[#A5A7AD] mt-2">
                      Bu hedef için oluşturulan özel antrenman programını ön görüşmede koçumuzla detaylandırabilirsiniz.
                    </p>
                  </div>

                  <div className="pt-8 flex flex-col gap-3">
                    <Link
                      href={`/on-gorusme?hedef=${currentGoal.slug}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all"
                    >
                      <span>Hedefime Uygun Programı Gör</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/antrenman/${currentGoal.recommendedServiceSlug}`}
                      className="flex items-center justify-center w-full py-2.5 bg-transparent text-[#A5A7AD] hover:text-white text-xs uppercase tracking-wider font-semibold border border-[#23272F] hover:border-[#343A46] transition-colors"
                    >
                      Hizmet Detaylarını İncele
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
