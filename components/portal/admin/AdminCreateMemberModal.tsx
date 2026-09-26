"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserPlus, X, CheckCircle2 } from "lucide-react";
import { useMember } from "@/context/MemberContext";

interface AdminCreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCreateMemberModal: React.FC<AdminCreateMemberModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addNewMember } = useMember();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [injuryAlert, setInjuryAlert] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ memberNo: string; tempPassword: string } | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setCreated(null);
    setError(null);
    setName("");
    setPhone("");
    setEmail("");
    setInjuryAlert("");
    setTargetGoal("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await addNewMember({
      fullName: name,
      phone,
      email,
      initialSessions: sessionCount,
      injuryAlert,
      targetGoal,
    });
    if (res.ok) setCreated({ memberNo: res.memberNo, tempPassword: res.tempPassword });
    else setError(res.error);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          className="relative w-full max-w-lg bg-white rounded-t-[36px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2.5 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stüdyo CRM Kaydı</span>
            </div>
            <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              Yeni Danışan & Üye Kaydet
            </h3>
            <p className="text-xs text-[#64748B]">
              Yeni kayıt olan üyeyi doğrudan stüdyo işletim sistemine tanımlayın.
            </p>
          </div>

          {created ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base text-[#0F172A]">Üye kaydedildi ({created.memberNo})</h4>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Üyenin ilk girişi için geçici şifre aşağıda. Üyeye iletin; üye şifresini Hesabım ekranından değiştirebilir. Bu şifre bir daha gösterilmez.
              </p>
              <p className="inline-block px-4 py-2 bg-slate-900 text-white font-mono font-bold rounded-xl text-sm tracking-wider select-all" data-keep-white>
                {created.tempPassword}
              </p>
              <div>
                <button type="button" onClick={handleClose} className="mt-2 min-h-11 px-6 rounded-xl bg-[#0F172A] text-white text-xs font-bold">
                  Tamam
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Selin Yılmaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Telefon Numarası *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 5xx xxx xx xx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="selin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Başlangıç Ders Hakkı
                  </label>
                  <select
                    value={sessionCount}
                    onChange={(e) => setSessionCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  >
                    <option value={0}>0 (paket kasadan satılacak)</option>
                    <option value={1}>1 Ders</option>
                    <option value={10}>10 Ders</option>
                    <option value={20}>20 Ders</option>
                    <option value={30}>30 Ders</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-red-700 uppercase block mb-1">
                  Sakatlık / Hassasiyet (Koç Notu)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Bel fıtığı L5-S1 başlangıcı / Sağ diz operasyon geçmişi"
                  value={injuryAlert}
                  onChange={(e) => setInjuryAlert(e.target.value)}
                  className="w-full p-2.5 bg-red-50/50 border border-red-200 rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  Hedef
                </label>
                <textarea
                  rows={2}
                  placeholder="Yağ kaybı, sıkılaşma, genel kondisyon vb."
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              {error && <p className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">{error}</p>}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98"
                >
                  Üyeyi Kaydet
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
