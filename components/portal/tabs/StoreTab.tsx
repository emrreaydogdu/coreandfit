"use client";

import React, { useState } from "react";
import {
  Zap,
  Check,
  CreditCard,
  Banknote,
  Building2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { PORTAL_PACKAGES } from "@/data/portal-mock";
import { PortalPackage, OrderItem } from "@/types/portal";
import { CheckoutModal } from "@/components/portal/CheckoutModal";

export const StoreTab: React.FC = () => {
  const [selectedPkg, setSelectedPkg] = useState<PortalPackage | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider font-bold">
            ÖZEL DERS & SEANS MAĞAZASI
          </span>
          <span className="text-[#72757C]">•</span>
          <span className="text-[11px] font-mono text-[#A5A7AD]">1:1 Kişisel Koçluk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-white tracking-tight mt-0.5">
          Paket Satın Al & Seans Yükle
        </h2>
        <p className="text-xs text-[#A5A7AD] font-mono mt-1 max-w-2xl leading-relaxed">
          Hedefinize ve antrenman sıklığınıza uygun paketi seçerek seanslarınızı hemen yükleyin. Online kart, stüdyo kasasında nakit veya POS taksit imkanıyla ödeme yapabilirsiniz.
        </p>
      </div>

      {/* Payment Security / Options Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#0D0F12] border border-[#23272F] rounded-xl flex items-center gap-2.5">
          <CreditCard className="w-4 h-4 text-[#E8FF36] shrink-0" />
          <span className="text-[11px] font-mono text-white">Online Kredi Kartı</span>
        </div>
        <div className="p-3 bg-[#0D0F12] border border-[#23272F] rounded-xl flex items-center gap-2.5">
          <Banknote className="w-4 h-4 text-[#E8FF36] shrink-0" />
          <span className="text-[11px] font-mono text-white">Kasada Nakit Ödeme</span>
        </div>
        <div className="p-3 bg-[#0D0F12] border border-[#23272F] rounded-xl flex items-center gap-2.5">
          <CreditCard className="w-4 h-4 text-[#E8FF36] shrink-0" />
          <span className="text-[11px] font-mono text-white">Kasada POS / Taksit</span>
        </div>
        <div className="p-3 bg-[#0D0F12] border border-[#23272F] rounded-xl flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-[#E8FF36] shrink-0" />
          <span className="text-[11px] font-mono text-white">Havale / FAST</span>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PORTAL_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-[#0D0F12] border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-[#E8FF36]/60 ${
              pkg.badge ? "border-[#E8FF36] shadow-[0_0_25px_rgba(232,255,54,0.08)]" : "border-[#23272F]"
            }`}
          >
            {pkg.badge && (
              <div className="absolute -top-3 right-6 bg-[#E8FF36] text-[#08090B] px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow">
                {pkg.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider font-bold">
                  {pkg.sessionCount} SEANS • {pkg.validityDays} GÜN
                </span>
              </div>

              <h3 className="text-xl font-bold uppercase font-display text-white">
                {pkg.name}
              </h3>
              <p className="text-xs text-[#A5A7AD] font-mono mt-1 mb-4 leading-relaxed">
                {pkg.subtitle}
              </p>

              <div className="py-4 border-y border-[#191B20] my-4">
                <span className="text-3xl font-black font-mono text-white tracking-tight">
                  {pkg.formattedPrice}
                </span>
                <span className="text-xs text-[#72757C] font-mono block mt-0.5">
                  Seans başı ~₺{Math.round(pkg.price / pkg.sessionCount).toLocaleString("tr-TR")}
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-2.5 my-4">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#A5A7AD]">
                    <Check className="w-3.5 h-3.5 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase CTA */}
            <div className="pt-4 mt-2">
              <button
                onClick={() => setSelectedPkg(pkg)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  pkg.badge
                    ? "bg-[#E8FF36] text-[#08090B] hover:bg-[#D4EB2B] shadow-[0_0_20px_rgba(232,255,54,0.2)]"
                    : "bg-[#131519] border border-[#23272F] text-white hover:border-[#E8FF36] hover:text-[#E8FF36]"
                }`}
              >
                <span>Paketi Satın Al</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {selectedPkg && (
        <CheckoutModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onSuccess={(order) => {
            // modal handles the success view internally
          }}
        />
      )}
    </div>
  );
};
