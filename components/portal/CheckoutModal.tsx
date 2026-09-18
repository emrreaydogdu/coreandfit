"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Receipt,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#0D0F12] border border-[#23272F] rounded-2xl p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#72757C] hover:text-white rounded-full bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedOrder ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-widest block">
                GÜVENLİ ÖDEME ADIMI
              </span>
              <h3 className="text-xl font-bold font-display uppercase text-white mt-1">
                Paket Satın Alma
              </h3>
              <p className="text-xs text-[#A5A7AD] mt-1 font-mono">
                {pkg.name} ({pkg.sessionCount} Seans • {pkg.formattedPrice})
              </p>
            </div>

            {/* Package Summary Card */}
            <div className="bg-[#131519] border border-[#23272F] p-4 rounded-xl mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{pkg.name}</span>
                <span className="text-[11px] font-mono text-[#A5A7AD]">
                  +{pkg.sessionCount} Seans Bakiyenize Eklenir
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-[#E8FF36]">
                  {pkg.formattedPrice}
                </span>
                <span className="text-[10px] font-mono text-[#72757C] block">KDV Dahil</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-mono uppercase text-[#A5A7AD] tracking-wider block">
                Ödeme Yöntemini Seçiniz:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Online Kredi Kartı */}
                <button
                  type="button"
                  onClick={() => setMethod("online_card")}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    method === "online_card"
                      ? "border-[#E8FF36] bg-[#E8FF36]/10 text-white"
                      : "border-[#23272F] bg-[#131519] text-[#A5A7AD] hover:border-[#343A46]"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      method === "online_card" ? "text-[#E8FF36]" : "text-[#72757C]"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold font-mono block text-white">
                      Online Kart ile Öde
                    </span>
                    <span className="text-[10px] text-[#A5A7AD]">
                      Anında seans yükleme (3D Secure)
                    </span>
                  </div>
                </button>

                {/* 2. Kasada Nakit Ödeme */}
                <button
                  type="button"
                  onClick={() => setMethod("cash_register")}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    method === "cash_register"
                      ? "border-[#E8FF36] bg-[#E8FF36]/10 text-white"
                      : "border-[#23272F] bg-[#131519] text-[#A5A7AD] hover:border-[#343A46]"
                  }`}
                >
                  <Banknote
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      method === "cash_register" ? "text-[#E8FF36]" : "text-[#72757C]"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold font-mono block text-white">
                      Kasada Nakit Ödeme
                    </span>
                    <span className="text-[10px] text-[#A5A7AD]">
                      Stüdyoda girişte nakit öde
                    </span>
                  </div>
                </button>

                {/* 3. Kasada POS / Kredi Kartı */}
                <button
                  type="button"
                  onClick={() => setMethod("pos_register")}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    method === "pos_register"
                      ? "border-[#E8FF36] bg-[#E8FF36]/10 text-white"
                      : "border-[#23272F] bg-[#131519] text-[#A5A7AD] hover:border-[#343A46]"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      method === "pos_register" ? "text-[#E8FF36]" : "text-[#72757C]"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold font-mono block text-white">
                      Kasada Kredi Kartı / POS
                    </span>
                    <span className="text-[10px] text-[#A5A7AD]">
                      Stüdyoda tek çekim veya taksit
                    </span>
                  </div>
                </button>

                {/* 4. Havale / FAST */}
                <button
                  type="button"
                  onClick={() => setMethod("bank_transfer")}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    method === "bank_transfer"
                      ? "border-[#E8FF36] bg-[#E8FF36]/10 text-white"
                      : "border-[#23272F] bg-[#131519] text-[#A5A7AD] hover:border-[#343A46]"
                  }`}
                >
                  <Building2
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      method === "bank_transfer" ? "text-[#E8FF36]" : "text-[#72757C]"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold font-mono block text-white">
                      Banka Havalesi / FAST
                    </span>
                    <span className="text-[10px] text-[#A5A7AD]">
                      IBAN ile doğrudan transfer
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Method Form Body */}
            <form onSubmit={handlePay} className="space-y-4">
              {method === "online_card" && (
                <div className="space-y-3 bg-[#131519] p-4 rounded-xl border border-[#23272F]">
                  <div>
                    <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                      KART NUMARASI
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4543 2100 8921 5432"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#0D0F12] border border-[#23272F] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                      KART ÜZERİNDEKİ İSİM
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="EGE MERT"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full bg-[#0D0F12] border border-[#23272F] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                        SON KULLANMA (AA/YY)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-[#23272F] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                        GÜVENLİK KODU (CVC)
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-[#23272F] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#72757C] pt-2">
                    <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                    <span>256-Bit SSL ve 3D Secure ile korunan ödeme altyapısı</span>
                  </div>
                </div>
              )}

              {method === "cash_register" && (
                <div className="bg-[#131519] p-4 rounded-xl border border-[#23272F] space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Banknote className="w-5 h-5 text-[#E8FF36] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase font-mono">
                        KASADA NAKİT ÖDEME TAAHHÜDÜ
                      </h5>
                      <p className="text-xs text-[#A5A7AD] leading-relaxed mt-1">
                        Siparişiniz hemen oluşturulacak ve adınıza rezerve edilecektir. Ödemenizi ilk antrenmanınızda Nişantaşı stüdyo resepsiyonuna nakit olarak yapabilirsiniz.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#0D0F12] rounded-lg border border-[#23272F] text-[11px] font-mono text-[#E8FF36]">
                    ✓ Seanslarınız hemen tanımlanır ve rezervasyon yapmaya başlayabilirsiniz.
                  </div>
                </div>
              )}

              {method === "pos_register" && (
                <div className="bg-[#131519] p-4 rounded-xl border border-[#23272F] space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CreditCard className="w-5 h-5 text-[#E8FF36] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase font-mono">
                        STÜDYO KASASINDA POS İLE ÖDEME
                      </h5>
                      <p className="text-xs text-[#A5A7AD] leading-relaxed mt-1">
                        Stüdyoya geldiğinizde resepsiyondaki POS cihazımızdan tüm banka ve kredi kartlarıyla tek çekim veya anlaşmalı kartlara vade farksız 3/6 taksit seçeneğiyle ödeme yapabilirsiniz.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#0D0F12] rounded-lg border border-[#23272F] text-[11px] font-mono text-[#E8FF36]">
                    ✓ Rezervasyonunuz onaylanır, ödemeniz ilk gelişinizde kasada tahsil edilir.
                  </div>
                </div>
              )}

              {method === "bank_transfer" && (
                <div className="bg-[#131519] p-4 rounded-xl border border-[#23272F] space-y-3">
                  <p className="text-xs text-[#A5A7AD]">
                    Aşağıdaki resmi stüdyo banka hesaplarımıza EFT/FAST yaparak dekontunuzu WhatsApp destek hattımıza iletebilirsiniz:
                  </p>
                  <div className="space-y-2">
                    {STUDIO_BANK_ACCOUNTS.map((acc, i) => (
                      <div
                        key={i}
                        className="p-3 bg-[#0D0F12] rounded-lg border border-[#23272F] flex items-center justify-between"
                      >
                        <div className="text-xs font-mono">
                          <span className="font-bold text-white block">{acc.bankName}</span>
                          <span className="text-[11px] text-[#72757C] block">{acc.iban}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyIban(acc.iban)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-[#E8FF36] text-[10px] font-mono flex items-center gap-1"
                        >
                          {copiedIban === acc.iban ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#25D366]" />
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
                className="w-full mt-6 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,255,54,0.2)] disabled:opacity-50"
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
          /* Success Receipt Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-2xl font-bold font-display uppercase text-white">
              Siparişiniz Başarıyla Oluşturuldu!
            </h4>

            <div className="p-4 bg-[#131519] border border-[#23272F] rounded-xl text-left space-y-2 font-mono text-xs max-w-sm mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#72757C]">Sipariş No:</span>
                <span className="font-bold text-white">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#72757C]">Paket:</span>
                <span className="text-white">{completedOrder.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#72757C]">Yüklenen Seans:</span>
                <span className="text-[#E8FF36] font-bold">
                  +{completedOrder.sessionCount} Seans
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[#72757C]">Ödeme Durumu:</span>
                <span
                  className={
                    completedOrder.paymentStatus === "completed"
                      ? "text-[#25D366] font-bold"
                      : "text-amber-400 font-bold"
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
              <div className="flex justify-between pt-1">
                <span className="text-[#72757C]">Makbuz Kodu:</span>
                <span className="text-white font-bold tracking-wider">
                  {completedOrder.receiptCode}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A5A7AD] max-w-sm mx-auto leading-relaxed">
              Seanslarınız üye profilinize anında yansıtılmıştır. Dilerseniz hemen randevu planlayabilirsiniz.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4EB2B] transition-colors"
            >
              Panele Dön
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
