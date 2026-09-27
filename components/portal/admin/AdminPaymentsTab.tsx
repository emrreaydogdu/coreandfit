"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Copy, Check, ShieldCheck, ShieldAlert, Power, RefreshCw } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { PAYMENT_STATUS_INFO, formatDateMedium } from "@/lib/format";
import { formatTL } from "@/lib/pricing";

interface PaymentOverview {
  configured: boolean;
  enabled: boolean;
  testMode: boolean;
  merchantIdMasked: string | null;
  noInstallment: boolean;
  callbackUrl: string | null;
  okUrl: string | null;
  failUrl: string | null;
  events: {
    id: string;
    merchantOid: string | null;
    event: string;
    status: string | null;
    totalAmount: number | null;
    paymentAmount: number | null;
    hashValid: boolean;
    reason: string | null;
    testMode: boolean | null;
    createdAt: string;
  }[];
}

const EVENT_LABEL: Record<string, string> = {
  callback_success: "Ödeme onaylandı",
  callback_failed: "Ödeme başarısız",
  callback_review: "İncelemeye alındı",
  callback_duplicate: "Tekrar eden bildirim",
  callback_unknown_order: "Bilinmeyen sipariş",
  callback_bad_hash: "Geçersiz imza (reddedildi)",
  callback_unconfigured: "Mağaza bilgisi yok",
  token_error: "Ödeme sayfası açılamadı",
};

const time = (iso: string) => new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

// Mağaza anahtarları bu ekranda gösterilmez ve değiştirilemez; yalnızca sunucudaki ortam dosyasında durur.
// Admin hesabı ele geçirilse bile ödemeler başka bir PayTR hesabına yönlendirilemez.
export const AdminPaymentsTab: React.FC = () => {
  const { adminOrders } = useMember();
  const [data, setData] = useState<PaymentOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store", credentials: "same-origin" });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Ödeme bilgileri alınamadı.");
      setData(body);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ödeme bilgileri alınamadı.");
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => void load(), 0);
    return () => clearTimeout(first);
  }, [load]);

  const toggle = async () => {
    if (!data) return;
    const next = !data.enabled;
    if (next && !data.testMode && !window.confirm("Canlı modda online ödemeyi açıyorsunuz. Üyeler gerçek kartla ödeme yapabilecek. Devam edilsin mi?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
        credentials: "same-origin",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Kaydedilemedi.");
      setData(body);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  };

  const onlineOrders = adminOrders.filter((o) => o.paymentMethod === "online_card");

  return (
    <div className="space-y-5">
      <section className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Online Ödeme (PayTR)</h3>
            <p className="text-xs text-[#64748B] mt-0.5 max-w-xl">
              Kart ödemeleri PayTR güvenli ödeme sayfasında alınır. Ders hakkı yalnızca PayTR&apos;ın imzalı onay bildirimi geldiğinde tanımlanır.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-10 px-3.5 bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Yenile
          </button>
        </div>

        {error && <p className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">{error}</p>}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-[#F8FAFC] rounded-2xl">
                <span className="text-[10px] font-bold text-[#64748B] uppercase">Mağaza Bağlantısı</span>
                <span className={`flex items-center gap-1.5 mt-1.5 text-sm font-bold ${data.configured ? "text-emerald-700" : "text-rose-700"}`}>
                  {data.configured ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  {data.configured ? `Tanımlı (${data.merchantIdMasked})` : "Tanımlı değil"}
                </span>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-2xl">
                <span className="text-[10px] font-bold text-[#64748B] uppercase">Mod</span>
                <span className={`block mt-1.5 text-sm font-bold ${data.testMode ? "text-amber-700" : "text-emerald-700"}`}>
                  {data.testMode ? "Test modu (gerçek çekim yok)" : "Canlı mod"}
                </span>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Üyelere Açık</span>
                  <span className={`block mt-1.5 text-sm font-bold ${data.enabled ? "text-emerald-700" : "text-[#64748B]"}`}>
                    {data.enabled ? "Açık" : "Kapalı"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  disabled={saving || (!data.configured && !data.enabled)}
                  className={`min-h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 ${
                    data.enabled ? "bg-rose-50 text-rose-700" : "bg-emerald-600 text-white"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {data.enabled ? "Kapat" : "Aç"}
                </button>
              </div>
            </div>

            {!data.configured ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed space-y-1">
                <p className="font-bold">PayTR mağaza bilgileri sunucuda tanımlı değil.</p>
                <p>
                  Güvenlik gereği mağaza numarası, anahtar ve gizli anahtar bu panelden girilmez. Sunucudaki ortam dosyasına
                  (PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT, APP_BASE_URL) eklenip uygulama yeniden başlatılmalıdır.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#64748B] uppercase">PayTR Mağaza Paneline Girilecek Adres</p>
                {[
                  ["Bildirim URL (Destek & Kurulum › Ayarlar)", data.callbackUrl],
                  ["Başarılı ödeme sayfası", data.okUrl],
                  ["Başarısız ödeme sayfası", data.failUrl],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="p-3 bg-[#F8FAFC] rounded-xl flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#64748B] block">{label}</span>
                        <span className="text-xs font-mono break-all">{value}</span>
                      </div>
                      <button type="button" onClick={() => copy(value)} className="p-2 rounded-lg bg-white border border-black/[0.06] shrink-0" aria-label="Kopyala">
                        {copied === value ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </>
        )}
      </section>

      <section className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-3">
        <h3 className="font-bold text-sm uppercase">Online Siparişler ({onlineOrders.length})</h3>
        {onlineOrders.length === 0 ? (
          <p className="text-xs text-[#64748B] p-4 bg-[#F8FAFC] rounded-2xl">Henüz online sipariş yok.</p>
        ) : (
          <div className="space-y-2">
            {onlineOrders.map((o) => (
              <div key={o.id} className="p-3.5 bg-[#F8FAFC] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{o.packageName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PAYMENT_STATUS_INFO[o.paymentStatus].className}`}>
                      {PAYMENT_STATUS_INFO[o.paymentStatus].label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 break-all">
                    {o.memberName} • {formatDateMedium(o.createdAt)} {time(o.createdAt)} • {o.merchantOid}
                  </p>
                  {o.failureReason && <p className="text-[11px] text-rose-700 mt-0.5">{o.failureReason}</p>}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black block">{formatTL(o.amount)}</span>
                  {o.providerTotalAmount !== undefined && o.providerTotalAmount !== o.amount * 100 && (
                    <span className="text-[10px] text-[#64748B]">Tahsil: {formatTL(Math.round(o.providerTotalAmount / 100))}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-3">
        <div>
          <h3 className="font-bold text-sm uppercase">PayTR Bildirim Kayıtları</h3>
          <p className="text-[11px] text-[#64748B] mt-0.5">Son 50 bildirim. İmzası doğrulanamayan istekler sipariş durumunu değiştirmez.</p>
        </div>
        {!data || data.events.length === 0 ? (
          <p className="text-xs text-[#64748B] p-4 bg-[#F8FAFC] rounded-2xl">Kayıt yok.</p>
        ) : (
          <div className="space-y-1.5">
            {data.events.map((e) => (
              <div key={e.id} className="p-3 bg-[#F8FAFC] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {e.hashValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-semibold">{EVENT_LABEL[e.event] ?? e.event}</span>
                  {e.testMode && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">TEST</span>}
                </div>
                <span className="text-[11px] text-[#64748B] break-all">
                  {formatDateMedium(e.createdAt)} {time(e.createdAt)}
                  {e.merchantOid ? ` • ${e.merchantOid}` : ""}
                  {e.reason ? ` • ${e.reason}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
