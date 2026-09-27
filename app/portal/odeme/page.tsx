import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme Sonucu",
  robots: { index: false, follow: false },
};

// PayTR ödeme sonrası müşteriyi bu sayfaya yönlendirir (genellikle ödeme penceresinin içinde).
// Bu sayfa hiçbir sipariş işlemi yapmaz; kesin sonuç PayTR'ın sunucuya gönderdiği imzalı bildirimle belirlenir.
export default async function PaymentResultPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const { durum } = await searchParams;
  const success = durum === "basarili";

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center p-6 text-center">
      <div className="max-w-sm space-y-3">
        <h1 className="text-lg font-bold text-[#0F172A]">{success ? "Ödeme işleminiz tamamlandı" : "Ödeme tamamlanamadı"}</h1>
        <p className="text-sm text-[#64748B] leading-relaxed">
          {success
            ? "Ödemenizin onayı birkaç saniye içinde panelinize yansıyacak."
            : "Kartınızdan çekim yapılmadı. Ödeme penceresini kapatıp tekrar deneyebilirsiniz."}
        </p>
        <Link href="/portal" target="_top" className="inline-block text-sm font-semibold text-[#059669] underline underline-offset-4">
          Panele dön
        </Link>
      </div>
    </div>
  );
}
