"use client";

import React, { useState } from "react";
import {
  Zap,
  Check,
  CreditCard,
  Banknote,
  Building2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { PORTAL_PACKAGES } from "@/data/portal-mock";
import { PortalPackage } from "@/types/portal";
import { CheckoutModal } from "@/components/portal/CheckoutModal";

export const StoreTab: React.FC = () => {
  const [selectedPkg, setSelectedPkg] = useState<PortalPackage | null>(null);

  return (
    <div className="space-y-6 pb-12 text-[#0F172A]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans text-[#10B981] uppercase tracking-wider font-bold">
            ÖZEL DERS & SEANS MAĞAZASI
          </span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-[11px] font-sans text-[#64748B]">1:1 Kişisel Koçluk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
          Paket Satın Al & Seans Yükle
        </h2>
        <p className="text-xs text-[#64748B] font-medium mt-1 max-w-2xl leading-relaxed">
          Hedefinize ve antrenman sıklığınıza uygun paketi seçerek seanslarınızı hemen yükleyin. Online kart, stüdyo kasasında nakit veya POS taksit imkanıyla ödeme yapabilirsiniz.
        </p>
      </div>

      {/* Payment Security / Options Banner (Apple Style Clean Pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-black/[0.06] rounded-2xl flex items-center gap-3 shadow-xs">
          <CreditCard className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span className="text-xs font-semibold text-[#0F172A]">Online Kart</span>
        </div>
        <div className="p-3.5 bg-white border border-black/[0.06] rounded-2xl flex items-center gap-3 shadow-xs">
          <Banknote className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="text-xs font-semibold text-[#0F172A]">Kasada Nakit</span>
        </div>
        <div className="p-3.5 bg-white border border-black/[0.06] rounded-2xl flex items-center gap-3 shadow-xs">
          <CreditCard className="w-4 h-4 text-[#D97706] shrink-0" />
          <span className="text-xs font-semibold text-[#0F172A]">Kasada POS</span>
        </div>
        <div className="p-3.5 bg-white border border-black/[0.06] rounded-2xl flex items-center gap-3 shadow-xs">
          <Building2 className="w-4 h-4 text-[#6366F1] shrink-0" />
          <span className="text-xs font-semibold text-[#0F172A]">Havale / FAST</span>
        </div>
      </div>

      {/* Package Grid (Apple White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PORTAL_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white border rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_45px_rgba(0,0,0,0.06)] ${
              pkg.badge
                ? "border-[#0F172A] shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.08]"
                : "border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            }`}
          >
            {pkg.badge && (
              <div className="absolute -top-3 right-6 bg-[#0F172A] text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {pkg.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold font-sans text-[#10B981] uppercase tracking-wider">
                  {pkg.sessionCount} SEANS • {pkg.validityDays} GÜN
                </span>
              </div>

              <h3 className="text-2xl font-bold uppercase font-display text-[#0F172A]">
                {pkg.name}
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-1 mb-5 leading-relaxed">
                {pkg.subtitle}
              </p>

              <div className="py-4 border-y border-black/[0.06] my-4">
                <span className="text-4xl font-black font-display text-[#0F172A] tracking-tight">
                  {pkg.formattedPrice}
                </span>
                <span className="text-xs text-[#64748B] font-medium block mt-1">
                  Seans başı ~₺{Math.round(pkg.price / pkg.sessionCount).toLocaleString("tr-TR")}
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-3 my-5">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#334155] font-medium">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase CTA Button */}
            <div className="pt-4 mt-2">
              <button
                onClick={() => setSelectedPkg(pkg)}
                className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                  pkg.badge
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                    : "bg-[#F8FAFC] border border-black/[0.12] text-[#0F172A] hover:bg-[#F1F5F9]"
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
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};
