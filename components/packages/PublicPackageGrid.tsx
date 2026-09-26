"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Users } from "lucide-react";
import { INDIVIDUAL_PACKAGES, packageFeatures, type PackageItem } from "@/data/packages";
import { finalPrice, formatTL } from "@/lib/pricing";
import { useMember } from "@/context/MemberContext";
import { DuetModal } from "@/components/packages/DuetModal";

// Teklif formuna seçilen paketi bildirir (PackageInquiryForm dinler).
export const SELECT_PACKAGE_EVENT = "cf-select-package";

const selectForInquiry = (pkg: PackageItem) => {
  window.dispatchEvent(new CustomEvent(SELECT_PACKAGE_EVENT, { detail: pkg.id }));
  document.getElementById("teklif-al")?.scrollIntoView({ behavior: "smooth" });
};

export const PublicPackageGrid: React.FC = () => {
  const { referral } = useMember();
  const discountActive = referral?.discountActive ?? false;
  const [duetOpen, setDuetOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {INDIVIDUAL_PACKAGES.map((pkg) => {
          const price = finalPrice(pkg, discountActive);
          return (
            <div
              key={pkg.id}
              className={`bg-[#0D0F12] border p-6 sm:p-7 flex flex-col justify-between relative h-full transition-all duration-300 hover:border-[#343A46] ${
                pkg.isPopular ? "border-[#E8FF36] shadow-[0_0_30px_rgba(232,255,54,0.08)]" : "border-[#23272F]"
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-[#E8FF36] text-[#08090B] text-[10px] font-mono font-bold uppercase tracking-wider">
                  EN ÇOK TERCİH EDİLEN
                </span>
              )}
              <div>
                <span className="text-[11px] font-mono text-[#72757C] uppercase tracking-wider block mb-1">{pkg.subtitle}</span>
                <h3 className="text-2xl font-bold uppercase font-display text-white mb-3">{pkg.name}</h3>
                <div className="mb-4">
                  {price < pkg.basePrice && (
                    <span className="text-sm font-mono text-[#72757C] line-through block">{formatTL(pkg.basePrice)}</span>
                  )}
                  <span className="text-3xl font-black font-display text-[#E8FF36]">{formatTL(price)}</span>
                  <span className="text-xs font-mono text-[#72757C] block mt-1">
                    {pkg.sessionCount} ders • {pkg.validityDays} gün geçerli
                  </span>
                </div>
                <p className="text-xs text-[#A5A7AD] leading-relaxed mb-5 border-b border-[#191B20] pb-4">{pkg.idealFor}</p>
                <ul className="space-y-2.5 text-xs text-[#A5A7AD] mb-7">
                  {packageFeatures(pkg).map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => selectForInquiry(pkg)}
                className="w-full inline-flex items-center justify-center gap-2 min-h-12 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all"
              >
                <span>Paketi Seç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setDuetOpen(true)}
        className="mt-8 w-full text-left bg-[#0D0F12] border border-[#23272F] hover:border-[#E8FF36] p-6 sm:p-8 flex items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E8FF36]/10 border border-[#E8FF36]/40 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[#E8FF36]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold uppercase font-display text-white">Düet Ders</h3>
            <p className="text-xs text-[#A5A7AD] mt-1">Birlikte antrenman yapmak istediğiniz biriyle 2 kişilik özel paketler</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-[#E8FF36] shrink-0" />
      </button>

      <DuetModal
        open={duetOpen}
        onClose={() => setDuetOpen(false)}
        referralDiscountActive={discountActive}
        ctaLabel="Teklif Al"
        onSelect={(pkg) => {
          setDuetOpen(false);
          selectForInquiry(pkg);
        }}
      />
    </>
  );
};
