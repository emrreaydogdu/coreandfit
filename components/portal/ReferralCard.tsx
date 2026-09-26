"use client";

import React, { useState } from "react";
import { Gift, Copy, Check, Users, BadgePercent } from "lucide-react";
import type { ReferralSummary } from "@/types/portal";

export const ReferralCard: React.FC<{ referral: ReferralSummary }> = ({ referral }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A]">Referanslarım</h4>
            <p className="text-[11px] text-[#64748B]">Arkadaşını Getir – %10 İndirim</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
            referral.discountActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
          }`}
        >
          {referral.discountActive ? "%10 İndirim Aktif" : "İndirim Pasif"}
        </span>
      </div>

      <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Referans Kodun</span>
          <span className="text-lg font-black tracking-wider text-[#0F172A] font-mono break-all">
            {referral.code || "—"}
          </span>
          {referral.disabled && <span className="text-[11px] text-rose-600 block">Bu kod stüdyo tarafından pasife alındı.</span>}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!referral.code || referral.disabled}
          className="min-h-11 px-4 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-40 active:scale-95 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Kopyalandı" : "Kopyala"}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded-2xl border border-black/[0.05]">
          <span className="text-xl font-black text-[#0F172A] block">{referral.uses}</span>
          <span className="text-[10px] text-[#64748B] font-medium">Kodu kullanan</span>
        </div>
        <div className="p-3 rounded-2xl border border-black/[0.05]">
          <span className="text-xl font-black text-emerald-600 block">{referral.successful}</span>
          <span className="text-[10px] text-[#64748B] font-medium">Başarılı referans</span>
        </div>
        <div className="p-3 rounded-2xl border border-black/[0.05] flex flex-col items-center justify-center">
          <BadgePercent className={`w-5 h-5 ${referral.discountActive ? "text-emerald-600" : "text-slate-400"}`} />
          <span className="text-[10px] text-[#64748B] font-medium mt-1">Paketlerde %10</span>
        </div>
      </div>

      <p className="text-[11px] text-[#64748B] leading-relaxed flex items-start gap-2">
        <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          {referral.referredByCode
            ? "Referans koduyla katıldığın için paketlerde %10 avantajın kalıcı olarak aktif."
            : "Kodunla en az 1 arkadaşın kayıt olduğunda paketlerde %10 indirim hesabında kalıcı olarak açılır. Arkadaşın da kayıt olurken %10 avantaj kazanır."}
        </span>
      </p>
    </section>
  );
};
