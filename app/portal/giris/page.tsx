"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Zap,
  Lock,
  Mail,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

export default function MemberAuthPage() {
  const router = useRouter();
  const { login, loginDemo, register } = useMember();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login(email, password);
    } else {
      register({ fullName, email, phone });
    }
    router.push("/portal");
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.push("/portal");
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col justify-between selection:bg-[#E8FF36] selection:text-[#08090B]">
      {/* Top Header */}
      <div className="py-6 px-4 sm:px-8 border-b border-[#191B20]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-[#72757C] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm font-mono tracking-tighter text-white uppercase">
              CORE & FIT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36]" />
          </div>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0D0F12] border border-[#23272F] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Logo & Headline */}
          <div className="text-center space-y-1">
            <div className="w-10 h-10 bg-[#E8FF36] text-[#08090B] font-mono font-black rounded-xl flex items-center justify-center mx-auto text-base shadow-[0_0_15px_rgba(232,255,54,0.3)]">
              CF
            </div>
            <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-[0.2em] font-bold block pt-2">
              ÜYE GİRİŞ PANELİ
            </span>
            <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-white">
              {mode === "login" ? "Stüdyo Hesabınıza Giriş" : "Yeni Üyelik Oluştur"}
            </h1>
            <p className="text-xs text-[#A5A7AD] font-mono">
              Seanslarınızı, randevularınızı ve üye kartınızı yönetin
            </p>
          </div>

          {/* Instant Demo Login Button (Highlight for Client Demo!) */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E8FF36] to-[#D4EB2B] text-[#08090B] font-black text-xs uppercase tracking-wider font-mono rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,255,54,0.25)] active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Örnek Üye ile Tek Tıkla Giriş Yap (Demo)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#191B20]" />
            <span className="absolute bg-[#0D0F12] px-3 text-[10px] font-mono text-[#72757C] uppercase tracking-wider">
              VEYA ŞİFRE İLE
            </span>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#131519] rounded-xl border border-[#23272F]">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                mode === "login"
                  ? "bg-[#0D0F12] text-white font-bold shadow-sm"
                  : "text-[#72757C] hover:text-white"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                mode === "register"
                  ? "bg-[#0D0F12] text-white font-bold shadow-sm"
                  : "text-[#72757C] hover:text-white"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                  AD SOYAD
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#72757C] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#131519] border border-[#23272F] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                E-POSTA VEYA ÜYE NO
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#72757C] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="ornek@mail.com veya CF-89210"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131519] border border-[#23272F] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                  TELEFON NUMARASI
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#72757C] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0532 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#131519] border border-[#23272F] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-[#72757C] uppercase block mb-1">
                ŞİFRE
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#72757C] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131519] border border-[#23272F] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#E8FF36]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-[#08090B] font-bold text-xs uppercase tracking-wider font-mono rounded-xl hover:bg-[#E8FF36] transition-colors"
            >
              {mode === "login" ? "Panele Giriş Yap" : "Hesap Oluştur ve Başla"}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 text-center text-[10px] font-mono text-[#72757C] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
            <span>256-Bit SSL Korumalı Özel Stüdyo Ağı</span>
          </div>
        </motion.div>
      </div>

      {/* Footer copyright */}
      <div className="py-4 text-center text-[11px] font-mono text-[#72757C] border-t border-[#191B20]">
        CORE & FIT PRIVATE SPORT STUDIO • NİŞANTAŞI
      </div>
    </div>
  );
}
