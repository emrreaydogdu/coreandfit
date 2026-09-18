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
  ShieldCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { PortalPackage, PaymentMethod, OrderItem } from "@/types/portal";
import { STUDIO_BANK_ACCOUNTS } from "@/data/portal-mock";
import { useMember } from "@/context/MemberContext";

interface CheckoutModalProps {
  pkg: PortalPackage | null;
  onClose: () => void;
  onSuccess: (order: OrderItem) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  pkg,
  onClose,
  onSuccess,
}) => {
  const { purchasePackage } = useMember();
  const [method, setMethod] = useState<PaymentMethod>("online_card");
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  // Form states for online card
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!pkg) return null;

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ""));
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2500);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment gateway delay (1.2 seconds)
    setTimeout(() => {
      const result = purchasePackage({
        packageId: pkg.id,
        paymentMethod: method,
        cardDetails:
          method === "online_card"
            ? { cardNumber, cardHolder, expiry, cvv }
            : undefined,
      });

      setProcessing(false);
      setCompletedOrder(result.order);
      onSuccess(result.order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white border border-black/[0.08] rounded-3xl p-7 shadow-2xl text-[#0F172A] my-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedOrder ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[10px] font-sans text-[#10B981] uppercase tracking-widest block font-bold">
                GÜVENLİ ÖDEME
              </span>
              <h3 className="text-2xl font-bold font-display uppercase text-[#0F172A] mt-1">
                Paket Satın Alma
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                {pkg.name} ({pkg.sessionCount} Seans • {pkg.formattedPrice})
              </p>
            </div>

            {/* Package Summary Card */}
            <div className="bg-[#F8FAFC] border border-black/[0.06] p-4 rounded-2xl mb-6 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">{pkg.name}</span>
                <span className="text-xs text-[#10B981] font-semibold">
                  +{pkg.sessionCount} Seans Hesabınıza Yüklenir
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black font-display text-[#0F172A]">
                  {pkg.formattedPrice}
                </span>
                <span className="text-[10px] text-[#64748B] block">KDV Dahil</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                ÖDEME YÖNTEMİNİ SEÇİNİZ:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Online Kredi Kartı */}
                <button
                  type="button"
                  onClick={() => setMethod("online_card")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    method === "online_card"
                      ? "border-[#0F172A] bg-[#F1F5F9] text-[#0F172A] shadow-xs"
                      : "border-black/[0.06] bg-white text-[#64748B] hover:border-black/[0.15]"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      method === "online_card" ? "text-[#0F172A]" : "text-[#94A3B8]"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold block text-[#0F172A]">
                      Online Kart ile Öde
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      Anında seans yükleme (3D Secure)
                    </span>
                  </div>
                </button>

                {/* 2. Kasada Nakit Ödeme */}
                <button
                  type="button"
                  onClick={() => setMethod("cash_register")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    method === "cash_register"
                      ? "border-[#0F172A] bg-[#F1F5F9] text-[#0F172A] shadow-xs"
                      : "border-black/[0.06] bg-white text-[#64748B] hover:border-black/[0.15]"
                  }`}
                >
                  <Banknote
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
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

                {/* 3. Kasada POS / Kredi Kartı */}
                <button
                  type="button"
                  onClick={() => setMethod("pos_register")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    method === "pos_register"
                      ? "border-[#0F172A] bg-[#F1F5F9] text-[#0F172A] shadow-xs"
                      : "border-black/[0.06] bg-white text-[#64748B] hover:border-black/[0.15]"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      method === "pos_register" ? "text-[#0F172A]" : "text-[#94A3B8]"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold block text-[#0F172A]">
                      Kasada POS / Taksit
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      Stüdyoda tek çekim veya taksit
                    </span>
                  </div>
                </button>

                {/* 4. Havale / FAST */}
                <button
                  type="button"
                  onClick={() => setMethod("bank_transfer")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    method === "bank_transfer"
                      ? "border-[#0F172A] bg-[#F1F5F9] text-[#0F172A] shadow-xs"
                      : "border-black/[0.06] bg-white text-[#64748B] hover:border-black/[0.15]"
                  }`}
                >
                  <Building2
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
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
            <form onSubmit={handlePay} className="space-y-4">
              {method === "online_card" && (
                <div className="space-y-3.5 bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06]">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      KART NUMARASI
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4543 2100 8921 5432"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-black/[0.12] rounded-xl px-3.5 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      KART ÜZERİNDEKİ İSİM
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="EGE MERT"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-black/[0.12] rounded-xl px-3.5 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                        SON KULLANMA (AA/YY)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white border border-black/[0.12] rounded-xl px-3.5 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                        GÜVENLİK KODU (CVC)
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-white border border-black/[0.12] rounded-xl px-3.5 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#64748B] pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>256-Bit SSL ve 3D Secure ile korunan ödeme altyapısı</span>
                  </div>
                </div>
              )}

              {method === "cash_register" && (
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06] space-y-3">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-[#0F172A] uppercase">
                        KASADA NAKİT ÖDEME TAAHHÜDÜ
                      </h5>
                      <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                        Siparişiniz hemen oluşturulacak ve adınıza rezerve edilecektir. Ödemenizi ilk antrenmanınızda Nişantaşı stüdyo resepsiyonuna nakit olarak yapabilirsiniz.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-black/[0.06] text-xs text-[#059669] font-medium">
                    ✓ Seanslarınız hemen hesabınıza tanımlanır ve rezervasyon yapmaya başlayabilirsiniz.
                  </div>
                </div>
              )}

              {method === "pos_register" && (
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06] space-y-3">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-[#0F172A] uppercase">
                        STÜDYO KASASINDA POS İLE ÖDEME
                      </h5>
                      <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                        Stüdyoya geldiğinizde resepsiyondaki POS cihazımızdan tüm banka ve kredi kartlarıyla tek çekim veya anlaşmalı kartlara vade farksız 3/6 taksit seçeneğiyle ödeme yapabilirsiniz.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-black/[0.06] text-xs text-[#059669] font-medium">
                    ✓ Rezervasyonunuz onaylanır, ödemeniz ilk gelişinizde kasada tahsil edilir.
                  </div>
                </div>
              )}

              {method === "bank_transfer" && (
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06] space-y-3">
                  <p className="text-xs text-[#64748B]">
                    Aşağıdaki resmi stüdyo banka hesaplarımıza EFT/FAST yaparak dekontunuzu WhatsApp destek hattımıza iletebilirsiniz:
                  </p>
                  <div className="space-y-2">
                    {STUDIO_BANK_ACCOUNTS.map((acc, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white rounded-xl border border-black/[0.06] flex items-center justify-between shadow-xs"
                      >
                        <div className="text-xs font-sans">
                          <span className="font-bold text-[#0F172A] block">{acc.bankName}</span>
                          <span className="text-[11px] text-[#64748B] block">{acc.iban}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyIban(acc.iban)}
                          className="p-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg text-[#0F172A] text-xs font-sans flex items-center gap-1 transition-colors"
                        >
                          {copiedIban === acc.iban ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#10B981]" />
                              <span>Kopyalandı</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 py-4 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>İşlem Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {method === "online_card"
                        ? `${pkg.formattedPrice} İle Ödemeyi Tamamla`
                        : method === "cash_register"
                        ? "Kasada Nakit Ödeme Emri Oluştur"
                        : method === "pos_register"
                        ? "Kasada POS ile Ödeme Emri Oluştur"
                        : "Havale Siparişini Onayla"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Receipt Screen (Apple Style Clean Receipt) */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              Siparişiniz Başarıyla Oluşturuldu!
            </h4>

            <div className="p-5 bg-[#F8FAFC] border border-black/[0.06] rounded-2xl text-left space-y-2.5 font-sans text-xs max-w-sm mx-auto shadow-xs">
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
                  +{completedOrder.sessionCount} Seans
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
                    ? "✓ Ödendi (Online Kart)"
                    : completedOrder.paymentMethod === "cash_register"
                    ? "Kasada Nakit Ödenecek"
                    : completedOrder.paymentMethod === "pos_register"
                    ? "Kasada POS ile Ödenecek"
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
              Seanslarınız üye profilinize anında yansıtılmıştır. Dilerseniz hemen randevu planlayabilirsiniz.
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
