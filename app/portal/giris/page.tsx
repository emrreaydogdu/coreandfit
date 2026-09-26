"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Mail, Phone, User, ShieldCheck, Gift, Loader2 } from "lucide-react";
import { useMember } from "@/context/MemberContext";

export default function MemberAuthPage() {
  const router = useRouter();
  const { login, register, user, mounted } = useMember();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Oturum açıksa doğrudan ilgili panele gönder
  useEffect(() => {
    if (mounted && user) router.replace(user.role === "admin" ? "/admin" : "/portal");
  }, [mounted, user, router]);

  const checkReferral = async () => {
    const code = referralCode.trim();
    if (!code) {
      setReferralStatus(null);
      return;
    }
    const res = await fetch("/api/auth/referral", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, email }),
    });
    const data = await res.json().catch(() => null);
    setReferralStatus(
      res.ok && data?.valid
        ? { ok: true, text: "Referans kodu uygulandı. Paketlerde %10 avantaj kazandınız." }
        : { ok: false, text: data?.error || "Referans kodu bulunamadı." }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    if (mode === "login") {
      const res = await login(email, password);
      setSubmitting(false);
      if (!res.ok) return setError(res.error);
      router.push(res.role === "admin" ? "/admin" : "/portal");
    } else {
      const res = await register({ fullName, email, phone, password, referralCode: referralCode.trim() || undefined });
      setSubmitting(false);
      if (!res.ok) return setError(res.error);
      router.push("/portal");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#0F172A] flex flex-col justify-between selection:bg-[#10B981] selection:text-white">
      {/* Top Header */}
      <div className="py-5 px-4 sm:px-8 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-sans text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm font-sans tracking-tighter text-[#0F172A] uppercase">
              CORE & FIT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          </div>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6"
        >
          {/* Logo & Headline */}
          <div className="text-center space-y-1">
            <div className="w-11 h-11 bg-[#0F172A] text-white font-sans font-black rounded-2xl flex items-center justify-center mx-auto text-base shadow-xs">
              CF
            </div>
            <span className="text-[10px] font-sans text-[#10B981] uppercase tracking-[0.2em] font-bold block pt-2">
              ÜYE GİRİŞ PANELİ
            </span>
            <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              {mode === "login" ? "Stüdyo Hesabınıza Giriş" : "Yeni Üyelik Oluştur"}
            </h1>
            <p className="text-xs text-[#64748B] font-sans">
              Seanslarınızı, randevularınızı ve üye kartınızı yönetin
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-xl border border-black/[0.04]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`py-2 text-xs font-sans uppercase tracking-wider rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-[#0F172A] font-bold shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`py-2 text-xs font-sans uppercase tracking-wider rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white text-[#0F172A] font-bold shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-[10px] font-sans text-[#64748B] uppercase block mb-1 font-semibold">
                  AD SOYAD
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-sans text-[#64748B] uppercase block mb-1 font-semibold">
                E-POSTA
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 transition-all"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="text-[10px] font-sans text-[#64748B] uppercase block mb-1 font-semibold">
                  TELEFON NUMARASI
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0532 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-sans text-[#64748B] uppercase block mb-1 font-semibold">
                ŞİFRE
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={mode === "register" ? 8 : undefined}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={mode === "register" ? "En az 8 karakter" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs font-sans text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 transition-all"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="text-[10px] font-sans text-[#64748B] uppercase block mb-1 font-semibold">
                  REFERANS KODUNUZ VAR MI? (İSTEĞE BAĞLI)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Gift className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Örn: CORE-EGE721"
                      value={referralCode}
                      onChange={(e) => {
                        setReferralCode(e.target.value.toUpperCase());
                        setReferralStatus(null);
                      }}
                      onBlur={checkReferral}
                      className="w-full min-h-11 bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 text-xs font-mono uppercase text-[#0F172A] placeholder:text-[#94A3B8] placeholder:normal-case focus:bg-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={checkReferral}
                    className="min-h-11 px-4 rounded-xl border border-black/[0.1] text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
                  >
                    Uygula
                  </button>
                </div>
                {referralStatus && (
                  <p className={`mt-1.5 text-[11px] font-medium ${referralStatus.ok ? "text-emerald-700" : "text-rose-600"}`}>
                    {referralStatus.text}
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-12 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider font-sans rounded-xl hover:bg-black transition-colors shadow-xs active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Panele Giriş Yap" : "Hesap Oluştur ve Başla"}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 text-center text-[10px] font-sans text-[#64748B] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Bilgileriniz şifreli bağlantı ile korunur</span>
          </div>
        </motion.div>
      </div>

      {/* Footer copyright */}
      <div className="py-4 text-center text-[11px] font-sans text-[#94A3B8] border-t border-black/[0.06] bg-white/40">
        CORE & FIT PRIVATE SPORT STUDIO • NİŞANTAŞI
      </div>
    </div>
  );
}
