"use client";

import React, { useState } from "react";
import { FAQ_DATA, type FaqItem } from "@/data/faq";
import { ChevronDown, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  items?: FaqItem[];
  limit?: number;
  title?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items = FAQ_DATA,
  limit,
  title = "Sıkça Sorulan Sorular",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayItems = limit ? items.slice(0, limit) : items;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <ScrollReveal variant="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MERAK EDİLENLER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Core & Fit sistemi, randevu takvimi ve 1:1 antrenman prensipleri hakkında en çok merak edilen konular.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="space-y-3">
            {displayItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-[24px] border transition-all duration-300 overflow-hidden",
                    isOpen
                      ? "bg-white dark:bg-[#121214] border-black/[0.08] dark:border-white/[0.12] shadow-md"
                      : "bg-white/60 dark:bg-[#121214]/60 border-black/[0.04] dark:border-white/[0.06] hover:bg-white dark:hover:bg-[#121214]"
                  )}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 p-6 focus:outline-none group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300",
                        isOpen
                          ? "bg-slate-900 dark:bg-white text-white dark:text-black rotate-180"
                          : "bg-black/[0.04] dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 group-hover:bg-black/[0.08] dark:group-hover:bg-white/[0.1]"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-black/[0.04] dark:border-white/[0.06]">
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
