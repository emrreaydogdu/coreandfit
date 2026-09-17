"use client";

import React, { useState } from "react";
import { FAQ_DATA, type FaqItem } from "@/data/faq";
import { Plus, Minus } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "motion/react";

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
    <section className="py-20 lg:py-28 bg-[#0D0F12] border-t border-[#191B20]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <ScrollReveal variant="fade-up">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
              [ 07 • MERAK EDİLENLER ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-[#A5A7AD] mt-3">
              Core & Fit sistemi, randevu süreci ve 1:1 antrenman prensipleri hakkında en çok sorulan sorular.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="divide-y divide-[#23272F] border-y border-[#23272F]">
            {displayItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.id} className="py-5">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-white uppercase font-display group-hover:text-[#E8FF36] transition-colors">
                      {item.question}
                    </span>
                    <span className="p-1.5 border border-[#23272F] bg-[#131519] text-white shrink-0 group-hover:border-[#E8FF36] transition-colors">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-[#E8FF36]" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pr-8 text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
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
