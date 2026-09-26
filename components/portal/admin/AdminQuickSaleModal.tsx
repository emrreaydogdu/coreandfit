"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Banknote, Building2, X, CheckCircle2, Receipt, AlertCircle } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import type { PaymentMethod } from "@/types/portal";
import { ALL_PACKAGES, INDIVIDUAL_PACKAGES } from "@/data/packages";
import { discountRateFor, formatTL } from "@/lib/pricing";

interface AdminQuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESK_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: "cash_register", label: "Stüdyoda Nakit", icon: Banknote },
  { id: "bank_transfer", label: "Havale / EFT", icon: Building2 },
];

export const AdminQuickSaleModal: React.FC<AdminQuickSaleModalProps> = ({ isOpen, onClose }) => {
  const { crmMembers, adminQuickSale } = useMember();

  const [memberId, setMemberId] = useState("");
  const [packageId, setPackageId] = useState(INDIVIDUAL_PACKAGES[1].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_register");
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const member = crmMembers.find((m) => m.id === memberId);
  const pkg = ALL_PACKAGES.find((p) => p.id === packageId) ?? INDIVIDUAL_PACKAGES[1];
  const referralRate = discountRateFor(pkg, member?.referral.discountActive ?? false);
  // Sunucu ile aynı kural: referans ve özel indirimden büyük olan uygulanır.
  const rate = Math.max(referralRate, extraDiscount / 100);
  const total = Math.round(pkg.basePrice * (1 - rate));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    setSaving(true);
    const res = await adminQuickSale({ memberId, packageId, paymentMethod, extraDiscountPercent: extraDiscount });
    setSaving(false);
    if (res.ok) {
      setResult({ ok: true, text: `${formatTL(res.order.amount)} tahsil edildi. ${member?.name} hesabına +${pkg.sessionCount} ders yüklendi.` });
      setTimeout(onClose, 2200);
    } else {
      setResult({ ok: false, text: res.error });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative w-full max-w-xl bg-white rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto overscroll-contain"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2.5 text-[#94A3B8] rounded-full bg-slate-100" aria-label="Kapat">
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1 mb-5 pr-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Receipt className="w-3.5 h-3.5" />
              <span>Kasa</span>
            </div>
            <h3 className="text-xl font-bold">Paket Satışı</h3>
          </div>

          {result?.ok ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold max-w-md mx-auto">{result.text}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <label className="block">
                <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Üye</span>
                <select
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full min-h-11 p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl font-semibold"
                >
                  <option value="">Üye seçin</option>
                  {crmMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.memberNo}) • {m.remaining} ders
                    </option>
                  ))}
                </select>
                {member?.referral.discountActive && (
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">%10 referans indirimi aktif</span>
                )}
              </label>

              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Paket</span>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PACKAGES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPackageId(p.id)}
                      className={`min-h-14 p-2.5 rounded-2xl border text-left ${
                        packageId === p.id ? "border-[#0F172A] bg-slate-900 text-white" : "border-black/[0.06] bg-[#F8FAFC]"
                      }`}
                    >
                      <span className="font-bold block">{p.name}</span>
                      <span className={packageId === p.id ? "text-emerald-300" : "text-emerald-700"}>{formatTL(p.basePrice)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Ödeme yöntemi</span>
                <div className="grid grid-cols-2 gap-2">
                  {DESK_METHODS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`min-h-12 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                        paymentMethod === id ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-black/[0.06] bg-[#F8FAFC] text-[#64748B]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Özel indirim</span>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setExtraDiscount(pct)}
                      className={`min-h-10 rounded-xl border font-semibold ${
                        extraDiscount === pct ? "border-[#0F172A] bg-slate-900 text-white" : "border-black/[0.06] bg-[#F8FAFC] text-[#64748B]"
                      }`}
                    >
                      {pct === 0 ? "Yok" : `%${pct}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1.5" data-keep-white>
                <div className="flex justify-between">
                  <span>Paket bedeli</span>
                  <span>{formatTL(pkg.basePrice)}</span>
                </div>
                {rate > 0 && (
                  <div className="flex justify-between text-emerald-300 font-semibold">
                    <span>İndirim (%{Math.round(rate * 100)})</span>
                    <span>-{formatTL(pkg.basePrice - total)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                  <span className="font-bold uppercase tracking-wider">Tahsil edilecek</span>
                  <span className="text-xl font-black text-emerald-300">{formatTL(total)}</span>
                </div>
              </div>

              {result && !result.ok && (
                <p className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {result.text}
                </p>
              )}

              <button
                type="submit"
                disabled={saving || !memberId}
                className="w-full min-h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Tahsil Et ve Dersleri Yükle"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
