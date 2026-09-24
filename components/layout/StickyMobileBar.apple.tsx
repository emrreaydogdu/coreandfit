"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { MessageSquare, ArrowUpRight } from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

/*
 * Cam tema: ekranın altında yüzen cam ada.
 * aria-label bilerek "Hızlı işlemler" (küçük i): globals.css'teki orijinal tema kuralları
 * aside[aria-label="Hızlı İşlemler"] seçicisiyle !important arka plan uyguluyor, bu adayı etkilemesin.
 */
export const StickyMobileBar: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <motion.aside
      aria-label="Hızlı işlemler"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
      className="fixed inset-x-3 z-40 md:hidden bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="cg-shell rounded-full p-1 max-w-md mx-auto">
        <div className="cg-core cg-core-solid rounded-full grid grid-cols-[auto_1fr] items-center gap-1.5 p-1">
          <a
            href={buildQuickChatWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp'tan yazın"
            className="cg-focus flex items-center gap-2 h-12 pl-3 pr-4 rounded-full cg-ink transition-colors duration-500 hover:bg-[var(--cg-accent-soft)] active:scale-[0.98]"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366]">
              <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span className="text-[13px] font-semibold">WhatsApp</span>
          </a>

          <Link href="/on-gorusme" className="cg-btn cg-btn-accent justify-between w-full min-h-12 pl-5">
            <span>Ön görüşme al</span>
            <span className="cg-btn-icon w-9 h-9">
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
            </span>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
};
