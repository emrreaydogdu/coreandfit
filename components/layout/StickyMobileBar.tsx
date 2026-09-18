"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { MessageSquare, Calendar } from "lucide-react";

export const StickyMobileBar: React.FC = () => {
  const pathname = usePathname();

  // Hide sticky bar on consultation funnel, booking wizard, or inside member portal
  if (pathname === "/on-gorusme" || pathname === "/randevu" || pathname?.startsWith("/portal")) {
    return null;
  }

  return (
    <aside
      aria-label="Hızlı İşlemler"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#08090B]/95 backdrop-blur-lg border-t border-[#23272F] px-3 py-2 shadow-[0_-8px_20px_rgba(0,0,0,0.7)]"
    >
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <a
          href={buildQuickChatWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 min-h-[44px] px-2 bg-[#131519] border border-[#23272F] text-white text-[11px] font-bold uppercase tracking-wider active:scale-[0.98] transition-transform"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/on-gorusme"
          className="flex items-center justify-center gap-1.5 min-h-[44px] px-2 bg-[#E8FF36] text-[#08090B] text-[11px] font-bold uppercase tracking-wider active:scale-[0.98] transition-transform"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Görüşme Al</span>
        </Link>
      </div>
    </aside>
  );
};
