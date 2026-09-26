"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";
import type { PaymentMethod, OrderItem } from "@/types/portal";
import type { PackageItem } from "@/data/packages";
import { finalPrice, formatTL } from "@/lib/pricing";
import { useMember } from "@/context/MemberContext";

interface CheckoutModalProps {
  pkg: PackageItem | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  pkg,
  onClose,
}) => {
  const { purchasePackage, referral, bankAccounts } = useMember();
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!pkg) return null;

  // Gösterim için merkezi hesap; kesin tutarı sunucu aynı kuralla belirler.
  const price = finalPrice(pkg, referral?.discountActive ?? false);
  const priceText = formatTL(price);

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ""));
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2500);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    const result = await purchasePackage({ packageId: pkg.id, paymentMethod: method });
    setProcessing(false);
    if (result.ok) setCompletedOrder(result.order);
    else setError(result.error);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white border-t sm:border border-black/[0.08] rounded-t-[32px] sm:rounded-3xl shadow-2xl text-[#0F172A] flex flex-col max-h-[94vh] sm:max-h-[88vh] overflow-hidden"
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1 rounded-full bg-slate-200 mx-auto mt-2.5 sm:hidden shrink-0" />

        <button
          onClick={onClose}
          className="absolute top-3 sm:top-5 right-4 sm:right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {!completedOrder ? (
          <form onSubmit={handlePay} className="flex flex-col flex-1 overflow-hidden">
            {/* Fixed Header */}
            <div className="px-5 sm:px-7 pt-2 sm:pt-6 pb-3 border-b border-black/[0.05] shrink-0">
              <span className="text-[10px] font-sans text-[#10B981] uppercase tracking-widest block font-bold">
                GÜVENLİ ÖDEME
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display uppercase text-[#0F172A] mt-0.5">
                Paket Satın Alma
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {pkg.name} ({pkg.sessionCount} Ders • {priceText})
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4 space-y-4 overscroll-contain">
              {/* Package Summary Card */}
              <div className="bg-[#F8FAFC] border border-black/[0.06] p-3.5 sm:p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-sm font-bold text-[#0F172A] block">{pkg.name}</span>
                  <span className="text-xs text-[#10B981] font-semibold">
                    +{pkg.sessionCount} ders hesabınıza yüklenir
                  </span>
                </div>
                <div className="text-right">
                  {price < pkg.basePrice && (
                    <span className="text-xs text-[#94A3B8] line-through block">{formatTL(pkg.basePrice)}</span>
                  )}
                  <span className="text-lg sm:text-xl font-black font-display text-[#0F172A]">
                    {priceText}
                  </span>
                  <span className="text-[10px] text-[#64748B] block">KDV Dahil</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                  ÖDEME YÖNTEMİNİ SEÇİNİZ:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* 1. Online Kart: ödeme sağlayıcısı bağlanana kadar kapalı */}
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="p-3 rounded-xl border border-dashed border-black/[0.08] bg-[#F8FAFC] text-left flex items-start gap-2.5 opacity-60 cursor-not-allowed"
                  >
                    <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-[#94A3B8]" />
                    <div>
                      <span className="text-xs font-bold block text-[#0F172A]">
                        Online Kart ile Öde
                      </span>
                      <span className="text-[10px] text-[#64748B]">Yakında</span>
                    </div>
                  </button>

                  {/* 2. Kasada Nakit Ödeme */}
                  <button
                    type="button"
                    onClick={() => setMethod("cash_register")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      method === "cash_register"
                        ? "border-[#0F172A] bg-[#F1F5F9] text-[#0F172A] shadow-xs ring-1 ring-[#0F172A]"
                        : "border-black/[0.06] bg-white text-[#64748B] hover:border-black/[0.15]"
                    }`}
                  >
                    <Banknote
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        method === "cash_register" ? "text-[#0F172A]" : "text-[#94A3B8]"
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold block text-[#0F172A]">
                        Kasada Nakit Ödeme
                      </span>
                      <span className="text-[10px] text-[#64748B]">
                        Stüdyoda girişte nakit öde
                      </span>
                    </div>
                  </button>

                  {/* 4. Havale / FAST */}
                  <button
                    type="button"
                    onClick={() => setMethod("bank_transfer")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      method === "bank_transfer"
                        ? "border-[#0F172A] bg-[#F1F5F9] text-[#0F172A] shadow-xs ring-1 ring-[#0F172A]"
                        : "border-black/[0.06] bg-white text-[#64748B] hover:border-black/[0.15]"
                    }`}
                  >
                    <Building2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        method === "bank_transfer" ? "text-[#0F172A]" : "text-[#94A3B8]"
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold block text-[#0F172A]">
                        Banka Havalesi / FAST
                      </span>
                      <span className="text-[10px] text-[#64748B]">
                        IBAN ile doğrudan transfer
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Method Form Body */}
              <div>
                {method === "cash_register" && (
                  <div className="bg-[#F8FAFC] p-3.5 sm:p-4 rounded-2xl border border-black/[0.06] space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <Banknote className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-[#0F172A] uppercase">
                          KASADA NAKİT ÖDEME TAAHHÜDÜ
                        </h5>
                        <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                          Siparişiniz anında oluşturulur. Ödemenizi ilk antrenmanınızda stüdyoda nakit olarak yapabilirsiniz.
                        </p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-black/[0.06] text-xs text-[#059669] font-medium">
                      ✓ Seanslar hemen tanımlanır, randevu almaya başlayabilirsiniz.
                    </div>
                  </div>
                )}

                {method === "bank_transfer" && (
                  <div className="bg-[#F8FAFC] p-3.5 sm:p-4 rounded-2xl border border-black/[0.06] space-y-2.5">
                    <p className="text-xs text-[#64748B]">
                      Aşağıdaki stüdyo banka hesaplarımıza FAST/EFT yapabilirsiniz:
                    </p>
                    <div className="space-y-2">
                      {bankAccounts.map((acc, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white rounded-xl border border-black/[0.06] flex items-center justify-between shadow-2xs"
                        >
                          <div className="text-xs font-sans">
                            <span className="font-bold text-[#0F172A] block">{acc.bankName}</span>
                            <span className="text-[10px] text-[#64748B] block">{acc.iban}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyIban(acc.iban)}
                            className="px-2.5 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg text-[#0F172A] text-xs font-sans flex items-center gap-1 transition-colors shrink-0"
                          >
                            {copiedIban === acc.iban ? (
                              <>
                                <Check className="w-3 h-3 text-[#10B981]" />
                                <span>Kopyalandı</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Kopyala</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="mx-5 sm:mx-7 mb-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">{error}</p>
            )}

            {/* Sticky Bottom Action Bar (Always visible on mobile & desktop!) */}
            <div className="p-4 sm:px-7 bg-white/95 backdrop-blur-md border-t border-black/[0.06] shrink-0 pb-6 sm:pb-4 shadow-lg">
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-xl sm:rounded-full hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-98"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>İşlem Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {method === "cash_register" ? "Stüdyoda Nakit Ödeme Emri Oluştur" : "Havale Siparişini Onayla"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Receipt Screen (Apple Style Clean Receipt) */
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              Siparişiniz Başarıyla Oluşturuldu!
            </h4>

            <div className="p-4 sm:p-5 bg-[#F8FAFC] border border-black/[0.06] rounded-2xl text-left space-y-2 font-sans text-xs max-w-sm mx-auto shadow-xs">
              <div className="flex justify-between border-b border-black/[0.06] pb-2">
                <span className="text-[#64748B]">Sipariş No:</span>
                <span className="font-bold font-sans text-[#0F172A]">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.06] pb-2">
                <span className="text-[#64748B]">Paket:</span>
                <span className="text-[#0F172A] font-semibold">{completedOrder.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.06] pb-2">
                <span className="text-[#64748B]">Yüklenen Seans:</span>
                <span className="text-[#10B981] font-bold">
                  +{completedOrder.sessionCount} Ders
                </span>
              </div>
              <div className="flex justify-between border-b border-black/[0.06] pb-2">
                <span className="text-[#64748B]">Ödeme Durumu:</span>
                <span
                  className={
                    completedOrder.paymentStatus === "completed"
                      ? "text-[#059669] font-bold"
                      : "text-amber-600 font-bold"
                  }
                >
                  {completedOrder.paymentStatus === "completed"
                    ? "✓ Ödendi"
                    : completedOrder.paymentMethod === "cash_register"
                    ? "Stüdyoda Nakit Ödenecek"
                    : "Havale Bekleniyor"}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-sans">
                <span className="text-[#64748B]">Makbuz Kodu:</span>
                <span className="text-[#0F172A] font-bold tracking-wider">
                  {completedOrder.receiptCode}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
              Dersleriniz hesabınıza yüklendi. Dilerseniz hemen randevu planlayabilirsiniz.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] transition-colors shadow-sm"
            >
              Panele Dön
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
