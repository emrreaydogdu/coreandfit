"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  const handleReset = () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    } catch {}
    reset();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#08090B] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#131519] border border-[#23272F] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#E8FF36]/10 text-[#E8FF36] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
            CF
          </div>

          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">
              Sayfa Yüklenirken Bir Sorun Oluştu
            </h1>
            <p className="text-xs text-[#A5A7AD] mt-2 leading-relaxed">
              Bağlantı veya oturum durumu yenilenirken geçici bir aksaklık meydana geldi. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleReset}
              className="w-full py-3.5 px-4 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#d4eb2b] transition-all shadow-md active:scale-98"
            >
              Sayfayı Yeniden Dene
            </button>

            <button
              onClick={handleGoHome}
              className="w-full py-3 px-4 bg-transparent border border-[#23272F] text-[#A5A7AD] hover:text-white hover:border-white/20 text-xs font-semibold rounded-xl transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
