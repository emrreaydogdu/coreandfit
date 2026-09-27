"use client";

import React, { useState } from "react";
import { X, KeyRound, Loader2 } from "lucide-react";
import { useMember } from "@/context/MemberContext";

interface AdminPasswordModalProps {
  onClose: () => void;
}

// Yönetici parolası değişince diğer cihazlardaki tüm oturumlar kapanır, bu cihazda yeni oturum açılır.
export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ onClose }) => {
  const { changePassword } = useMember();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 12) return setMessage({ ok: false, text: "Yönetici parolası en az 12 karakter olmalı." });
    if (next !== repeat) return setMessage({ ok: false, text: "Yeni parolalar eşleşmiyor." });
    setSaving(true);
    const res = await changePassword(current, next);
    setSaving(false);
    if (res.ok) {
      setCurrent("");
      setNext("");
      setRepeat("");
      setMessage({ ok: true, text: "Parolanız güncellendi. Diğer cihazlardaki oturumlar kapatıldı." });
    } else {
      setMessage({ ok: false, text: res.error });
    }
  };

  const input = "w-full min-h-11 px-3.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:border-[#0F172A]";

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl p-5 sm:p-7 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-[#F1F5F9]" aria-label="Kapat">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-lg">Parolayı Değiştir</h3>
        </div>
        <p className="text-xs text-[#64748B] mb-4">En az 12 karakter. Harf, rakam ve sembol karışık, başka yerde kullanmadığınız bir parola seçin.</p>
        <form onSubmit={submit} className="space-y-3">
          <input type="password" autoComplete="current-password" placeholder="Mevcut parola" value={current} onChange={(e) => setCurrent(e.target.value)} className={input} required />
          <input type="password" autoComplete="new-password" placeholder="Yeni parola" value={next} onChange={(e) => setNext(e.target.value)} className={input} required maxLength={128} />
          <input type="password" autoComplete="new-password" placeholder="Yeni parola (tekrar)" value={repeat} onChange={(e) => setRepeat(e.target.value)} className={input} required maxLength={128} />
          {message && (
            <p className={`p-3 rounded-xl text-xs font-medium ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{message.text}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full min-h-11 bg-[#0F172A] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Parolayı Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};
