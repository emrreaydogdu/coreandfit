"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Banknote,
  Building2,
  X,
  CheckCircle2,
  Sparkles,
  Percent,
  Plus,
  Receipt,
  User,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { PaymentMethod } from "@/types/portal";
import { PORTAL_PACKAGES } from "@/data/portal-mock";

interface AdminQuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMemberName?: string;
  defaultMemberNo?: string;
}

export const AdminQuickSaleModal: React.FC<AdminQuickSaleModalProps> = ({
  isOpen,
  onClose,
  defaultMemberName,
  defaultMemberNo,
}) => {
  const { crmMembers, adminQuickSale } = useMember();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    crmMembers[0]?.id || "mem-1"
  );
  const [isCustomMember, setIsCustomMember] = useState<boolean>(false);
  const [customMemberName, setCustomMemberName] = useState<string>(defaultMemberName || "");
  const [customPhone, setCustomPhone] = useState<string>("");

  const [selectedPackageId, setSelectedPackageId] = useState<string>(PORTAL_PACKAGES[0]?.id || "pkg-12");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pos_register");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const [successResult, setSuccessResult] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected package details
  const currentPkg =
    PORTAL_PACKAGES.find((p) => p.id === selectedPackageId) ||
    (selectedPackageId === "single-dropin"
      ? {
          id: "single-dropin",
          name: "1:1 Tek Seans Drop-in",
          sessionCount: 1,
          price: 3500,
          formattedPrice: "₺3.500",
        }
      : PORTAL_PACKAGES[0]);

  const basePrice = currentPkg.price;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomMember(true);
      setSelectedMemberId("custom");
    } else {
      setIsCustomMember(false);
      setSelectedMemberId(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let memberName = "";
    let memberNo = "";

    if (isCustomMember) {
      memberName = customMemberName.trim() || "Misafir Danışan";
      memberNo = "CF-MISAFIR";
    } else {
      const mem = crmMembers.find((m) => m.id === selectedMemberId);
      memberName = mem?.name || "Ege Mert";
      memberNo = mem?.memberNo || "CF-89210";
    }

    const res = adminQuickSale({
      memberName,
      memberNo,
      packageId: currentPkg.id,
      packageName: currentPkg.name,
      sessionCount: currentPkg.sessionCount,
      amount: finalPrice,
      paymentMethod,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      notes: notes.trim() || "Kasada doğrudan tahsilat yapıldı.",
    });

    if (res.success) {
      setSuccessResult(
        `₺${finalPrice.toLocaleString("tr-TR")} tutarındaki satış tamamlandı! ${memberName} hesabına +${currentPkg.sessionCount} seans yüklendi.`
      );
      setTimeout(() => {
        setSuccessResult(null);
        onClose();
      }, 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          className="relative w-full max-w-xl bg-white rounded-t-[36px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hızlı Kasa & POS Tahsilatı</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              Kasada Yeni Paket Satışı Yap
            </h3>
            <p className="text-xs text-[#64748B]">
              Stüdyoya gelen üyeye anında paket veya drop-in seans satışı yapın, kasaya işleyin ve seans bakiyesini tanımlayın.
            </p>
          </div>

          {successResult ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">Tahsilat Başarılı!</h4>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">{successResult}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {/* Member Selector */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  DANIŞAN / ÜYE SEÇİMİ
                </label>
                <select
                  value={isCustomMember ? "custom" : selectedMemberId}
                  onChange={handleMemberSelect}
                  className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-emerald-500"
                >
                  <optgroup label="Kayıtlı Üyeler">
                    {crmMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.memberNo}) — Kalan: {m.remaining} Seans
                      </option>
                    ))}
                  </optgroup>
                  <option value="custom">+ Yeni / Misafir Danışan Gir</option>
                </select>
              </div>

              {isCustomMember && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-black/[0.05] rounded-2xl">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      Adı Soyadı
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Mehmet Öz"
                      value={customMemberName}
                      onChange={(e) => setCustomMemberName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      placeholder="+90 5xx xxx xx xx"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>
                </div>
              )}

              {/* Package Selector */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  SATILACAK SEANS / PAKET
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PORTAL_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedPackageId === pkg.id
                          ? "border-[#0F172A] bg-slate-900 text-white ring-2 ring-[#0F172A]"
                          : "border-black/[0.06] bg-[#F8FAFC] text-[#0F172A] hover:bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs">{pkg.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            selectedPackageId === pkg.id
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          +{pkg.sessionCount} Seans
                        </span>
                      </div>
                      <span
                        className={`text-xs block mt-1 font-black ${
                          selectedPackageId === pkg.id ? "text-emerald-300" : "text-emerald-600"
                        }`}
                      >
                        {pkg.formattedPrice}
                      </span>
                    </button>
                  ))}

                  {/* Single Drop-in Session */}
                  <button
                    type="button"
                    onClick={() => setSelectedPackageId("single-dropin")}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedPackageId === "single-dropin"
                        ? "border-[#0F172A] bg-slate-900 text-white ring-2 ring-[#0F172A]"
                        : "border-black/[0.06] bg-[#F8FAFC] text-[#0F172A] hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">Tek Seans 1:1 Drop-in</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          selectedPackageId === "single-dropin"
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        +1 Seans
                      </span>
                    </div>
                    <span
                      className={`text-xs block mt-1 font-black ${
                        selectedPackageId === "single-dropin" ? "text-emerald-300" : "text-emerald-600"
                      }`}
                    >
                      ₺3.500
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  ÖDEME YÖNTEMİ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "pos_register", label: "POS Kredi Kartı", icon: CreditCard },
                    { id: "cash_register", label: "Kasada Nakit", icon: Banknote },
                    { id: "bank_transfer", label: "Havale / EFT", icon: Building2 },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isActive = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                          isActive
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500"
                            : "border-black/[0.06] bg-[#F8FAFC] text-[#64748B]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-[#64748B]"}`} />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount / İskonto Options */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase">
                    ÖZEL İNDİRİM / İSKONTO
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {discountPercent > 0 ? `-%${discountPercent} (₺${discountAmount.toLocaleString("tr-TR")})` : "İndirimsiz"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                        discountPercent === pct
                          ? "border-[#0F172A] bg-slate-900 text-white font-bold"
                          : "border-black/[0.06] bg-[#F8FAFC] text-[#64748B]"
                      }`}
                    >
                      {pct === 0 ? "Yok (%0)" : `%${pct} İndirim`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  KASA / FATURA NOTU (İSTEĞE BAĞLI)
                </label>
                <input
                  type="text"
                  placeholder="Örn: 2 taksit POS çekimi yapıldı / Dekont no: 90214"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              {/* Summary Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Paket Bedeli:</span>
                  <span>₺{basePrice.toLocaleString("tr-TR")}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>Uygulanan İndirim (%{discountPercent}):</span>
                    <span>-₺{discountAmount.toLocaleString("tr-TR")}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    TAHSİL EDİLECEK TUTAR:
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    ₺{finalPrice.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Tahsil Et & Seansı Hesaba Yükle</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
