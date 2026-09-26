"use client";

import React, { useState } from "react";
import { Check, Banknote, Building2, ChevronRight, Users, BadgePercent } from "lucide-react";
import { INDIVIDUAL_PACKAGES, packageFeatures, type PackageItem } from "@/data/packages";
import { finalPrice, formatTL } from "@/lib/pricing";
import { useMember } from "@/context/MemberContext";
import { CheckoutModal } from "@/components/portal/CheckoutModal";
import { DuetModal } from "@/components/packages/DuetModal";

export const StoreTab: React.FC = () => {
  const { referral } = useMember();
  const discountActive = referral?.discountActive ?? false;
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [duetOpen, setDuetOpen] = useState(false);

  return (
    <div className="space-y-6 pb-28 text-[#0F172A]">
      <div>
        <span className="text-[11px] text-[#10B981] uppercase tracking-wider font-bold">Bireysel ve Düet Paketler</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">Paket Al</h2>
        <p className="text-xs text-[#64748B] font-medium mt-1 max-w-2xl leading-relaxed">
          Size uygun paketi seçin; stüdyoda nakit veya havale ile ödeyebilirsiniz. Online kart ödemesi yakında.
        </p>
      </div>

      {discountActive && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900">
          <BadgePercent className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">%10 Referans İndirimi Aktif. İndirimli fiyatlar aşağıda gösteriliyor.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {[
          { icon: Banknote, label: "Stüdyoda Nakit", color: "text-[#10B981]" },
          { icon: Building2, label: "Havale / FAST", color: "text-[#6366F1]" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="p-3 bg-white border border-black/[0.06] rounded-2xl flex items-center gap-2">
            <Icon className={`w-4 h-4 shrink-0 ${color}`} />
            <span className="text-[11px] sm:text-xs font-semibold">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INDIVIDUAL_PACKAGES.map((pkg) => {
          const price = finalPrice(pkg, discountActive);
          const discounted = price < pkg.basePrice;
          return (
            <div
              key={pkg.id}
              className={`relative bg-white border rounded-3xl p-6 flex flex-col justify-between ${
                pkg.isPopular ? "border-[#0F172A] ring-1 ring-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)]" : "border-black/[0.06]"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 right-6 bg-[#0F172A] text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  En Çok Tercih Edilen
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
                  {pkg.sessionCount} Ders • {pkg.validityDays} Gün
                </span>
                <h3 className="text-2xl font-bold uppercase font-display mt-1">{pkg.name}</h3>
                <p className="text-xs text-[#64748B] font-medium mt-1">{pkg.subtitle}</p>

                <div className="py-4 border-y border-black/[0.06] my-4">
                  {discounted && <span className="text-sm text-[#94A3B8] line-through block">{formatTL(pkg.basePrice)}</span>}
                  <span className="text-3xl sm:text-4xl font-black font-display tracking-tight">{formatTL(price)}</span>
                  {pkg.sessionCount > 1 && (
                    <span className="text-xs text-[#64748B] font-medium block mt-1">
                      Ders başı {formatTL(Math.round(price / pkg.sessionCount))}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-5">
                  {packageFeatures(pkg).map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-[#334155] font-medium">
                      <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setSelectedPkg(pkg)}
                className={`w-full min-h-12 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  pkg.isPopular ? "bg-[#0F172A] text-white hover:bg-[#1E293B]" : "bg-[#F8FAFC] border border-black/[0.12] hover:bg-[#F1F5F9]"
                }`}
              >
                <span>Paketi Satın Al</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setDuetOpen(true)}
        className="w-full text-left bg-gradient-to-br from-slate-900 to-black text-white rounded-3xl p-6 flex items-center justify-between gap-4 hover:shadow-lg transition-shadow"
        data-keep-white
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Düet Ders</h3>
            <p className="text-xs text-slate-300 mt-0.5">Birlikte antrenman yapmak istediğiniz biriyle 2 kişilik paketler</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
      </button>

      <DuetModal
        open={duetOpen}
        onClose={() => setDuetOpen(false)}
        referralDiscountActive={discountActive}
        onSelect={(pkg) => {
          setDuetOpen(false);
          setSelectedPkg(pkg);
        }}
      />

      {selectedPkg && <CheckoutModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />}
    </div>
  );
};
