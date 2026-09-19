"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LogIn, ArrowLeft } from "lucide-react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portal error:", error);
  }, [error]);

  const handleResetSession = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cf_member_user");
        sessionStorage.clear();
      }
    } catch {}
    window.location.href = "/portal/giris";
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/[0.08] shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            Üye Paneli Yüklenemedi
          </h2>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
            Oturum verileriniz yüklenirken geçici bir sorun oluştu. Sayfayı yeniden deneyebilir veya oturumunuzu tazeleyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yeniden Dene</span>
          </button>

          <button
            onClick={handleResetSession}
            className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-600" />
            <span>Oturumu Sıfırla & Tekrar Gir</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 text-xs text-[#64748B] hover:text-[#0F172A] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Web Sitesine Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
