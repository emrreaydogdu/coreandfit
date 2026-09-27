import type { PaymentStatus } from "@/types/portal";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const parse = (value: string) => new Date(value.length === 10 ? `${value}T12:00:00` : value);

// "2026-09-12" → "12.09.2026"
export const formatDateShort = (value: string) => {
  if (!value) return "";
  const d = parse(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

// "2026-09-26" → "26 Eylül Cumartesi"
export const formatDateLong = (value: string) => {
  if (!value) return "";
  const d = parse(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${DAYS[d.getDay()]}`;
};

// "2026-09-26" → "26 Eylül 2026"
export const formatDateMedium = (value: string) => {
  if (!value) return "";
  const d = parse(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// Sipariş ödeme durumu etiketleri (admin kasası ve üye hesabı aynı listeyi kullanır)
export const PAYMENT_STATUS_INFO: Record<PaymentStatus, { label: string; className: string }> = {
  completed: { label: "Ödendi", className: "bg-emerald-100 text-emerald-800" },
  pending_cashier: { label: "Stüdyoda Ödenecek", className: "bg-amber-100 text-amber-800" },
  pending_transfer: { label: "Havale Bekleniyor", className: "bg-amber-100 text-amber-800" },
  awaiting_payment: { label: "Ödeme Bekleniyor", className: "bg-slate-200 text-slate-700" },
  review: { label: "İncelemede", className: "bg-orange-100 text-orange-800" },
  failed: { label: "Başarısız", className: "bg-rose-100 text-rose-800" },
  cancelled: { label: "İptal", className: "bg-slate-200 text-slate-600" },
};

// Admin onayı bekleyen tahsilatlar: nakit, havale ve incelemeye düşen online ödeme
export const APPROVABLE_PAYMENT_STATUSES: PaymentStatus[] = ["pending_cashier", "pending_transfer", "review"];
