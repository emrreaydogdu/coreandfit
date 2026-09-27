"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

// Kod süresi dolmadan bu kadar saniye önce yenilenir (sunucu tarafı geçerlilik 90 sn).
const REFRESH_MARGIN_MS = 20_000;

interface PassState {
  dataUrl: string;
  code: string;
  expiresAt: number;
}

// Dijital giriş kartı: QR içeriği sunucunun imzaladığı kısa ömürlü koddur; tarayıcıda üretilmez.
export function useMemberPass(active: boolean) {
  const [pass, setPass] = useState<PassState | null>(null);
  const [now, setNow] = useState(0);
  const [failed, setFailed] = useState(false);
  const expiresRef = useRef(0);
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const res = await fetch("/api/me/pass", { cache: "no-store", credentials: "same-origin" });
      if (!res.ok) throw new Error("pass");
      const data = (await res.json()) as { token: string; expiresAt: number; code: string };
      const dataUrl = await QRCode.toDataURL(data.token, {
        width: 360,
        margin: 1,
        color: { dark: "#0F172A", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
      expiresRef.current = data.expiresAt;
      setPass({ dataUrl, code: `${data.code.slice(0, 3)} ${data.code.slice(3)}`, expiresAt: data.expiresAt });
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (expiresRef.current - t < REFRESH_MARGIN_MS) void load();
    };
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [active, load]);

  // Ekranda bir sonraki otomatik yenilemeye kalan süre gösterilir.
  const secondsLeft = pass ? Math.max(0, Math.ceil((pass.expiresAt - REFRESH_MARGIN_MS - now) / 1000)) : 0;
  const cycleSeconds = 70;

  return {
    qrDataUrl: pass?.dataUrl ?? "",
    code: pass?.code ?? "--- ---",
    secondsLeft,
    progressPercent: Math.min(100, (secondsLeft / cycleSeconds) * 100),
    failed,
    refresh: () => {
      expiresRef.current = 0;
      void load();
    },
  };
}
