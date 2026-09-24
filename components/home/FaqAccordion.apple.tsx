"use client";

import React, { useState } from "react";
import { FAQ_DATA, type FaqItem } from "@/data/faq";
import { Plus, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Eyebrow, Reveal } from "@/components/glass/GlassPrimitives";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

interface FaqAccordionProps {
  items?: FaqItem[];
  limit?: number;
  title?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items = FAQ_DATA,
  limit,
  title = "Sıkça sorulan sorular",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          {/* Sol: başlık + yardım kartı */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <Reveal>
                <Eyebrow>Merak edilenler</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl leading-[1.06] font-semibold">
                  {title}
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="cg-ink-2 cg-pretty text-base leading-relaxed mt-6 max-w-md">
                  Core & Fit çalışma sistemi, randevu takvimi ve 1:1 seanslar hakkında merak edilenler.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="cg-shell mt-10 max-w-md">
                  <div className="cg-core cg-core-strong p-6">
                    <p className="cg-ink font-semibold tracking-tight">Sorunuz burada yok mu?</p>
                    <p className="cg-ink-3 text-[14px] leading-relaxed mt-1.5">
                      WhatsApp üzerinden yazın, stüdyo ekibi kısa sürede dönüş yapsın.
                    </p>
                    <a
                      href={buildQuickChatWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cg-btn cg-btn-ghost cg-has-icon cg-btn-sm mt-5"
                    >
                      <span>WhatsApp&apos;tan yazın</span>
                      <span className="cg-btn-icon">
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Sağ: soru listesi */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="cg-shell cg-shell-lg">
              <div className="cg-core px-2 sm:px-4">
                <div className="cg-divide">
                  {displayItems.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    const panelId = `cg-faq-${item.id}`;
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : idx)}
                          className="cg-focus w-full flex items-center justify-between text-left gap-6 px-4 py-6 rounded-2xl group"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                        >
                          <span
                            className={cn(
                              "text-[15px] sm:text-lg font-semibold tracking-tight transition-colors duration-500",
                              isOpen ? "cg-ink" : "cg-ink-2 group-hover:text-[var(--cg-ink)]"
                            )}
                          >
                            {item.question}
                          </span>
                          <span
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                              isOpen ? "rotate-45 bg-[var(--cg-accent)] cg-on-media" : "cg-glass cg-ink-2"
                            )}
                          >
                            <Plus className="w-4 h-4" strokeWidth={1.75} />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={panelId}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.5, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <p className="cg-ink-3 cg-pretty px-4 pb-7 pr-16 text-[14px] sm:text-[15px] leading-relaxed">
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
