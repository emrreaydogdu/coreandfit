"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  X,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Award,
  Activity,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { StudioMemberCRM } from "@/types/portal";

interface AdminMemberDetailModalProps {
  member: StudioMemberCRM | null;
  onClose: () => void;
  onOpenWhatsApp: (name: string, phone: string) => void;
}

export const AdminMemberDetailModal: React.FC<AdminMemberDetailModalProps> = ({
  member,
  onClose,
  onOpenWhatsApp,
}) => {
  const { updateMemberSessions, updateMemberDetails } = useMember();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [injuryAlert, setInjuryAlert] = useState(member?.injuryAlert || "");
  const [healthNotes, setHealthNotes] = useState(member?.healthNotes || "");
  const [targetGoal, setTargetGoal] = useState(member?.targetGoal || "");
  const [weight, setWeight] = useState(member?.weight || "");
  const [bodyFat, setBodyFat] = useState(member?.bodyFat || "");
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!member) return null;

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberDetails(member.id, {
      injuryAlert,
      healthNotes,
      targetGoal,
      weight,
      bodyFat,
    });
    setSavedFeedback(true);
    setIsEditingNotes(false);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          className="relative w-full max-w-2xl bg-white rounded-t-[36px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Member Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-5 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                    {member.name}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200/60">
                    {member.memberNo}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {member.tier} • Baş Antrenör: <strong className="text-[#0F172A]">{member.coach}</strong>
                </p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenWhatsApp(member.name, member.phone)}
                className="px-3.5 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </button>
              <a
                href={`tel:${member.phone.replace(/\s+/g, "")}`}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ara</span>
              </a>
            </div>
          </div>

          {/* Toast feedback */}
          {savedFeedback && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Üye sağlık ve biyomekanik bilgileri başarıyla güncellendi.</span>
            </div>
          )}

          {/* INJURY & HEALTH ALERT BANNER - High visibility for Coach */}
          {member.injuryAlert && (
            <div className="mb-5 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 block">
                  🚨 SAKATLIK & EKLEM HASSASİYETİ UYARISI
                </span>
                <p className="text-xs text-red-950 font-medium mt-0.5 leading-relaxed">
                  {injuryAlert || member.injuryAlert}
                </p>
              </div>
            </div>
          )}

          {/* Session Balance & Quick Modifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  SEANS BAKİYESİ
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-emerald-600">
                    {member.remaining}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">/ {member.total} Toplam Seans</span>
                </div>
              </div>

              {/* Add / Deduct Session Quick Controls */}
              <div className="pt-3 mt-3 border-t border-black/[0.05] flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-[#64748B] mr-1">Hızlı Bakiye:</span>
                <button
                  type="button"
                  onClick={() => updateMemberSessions(member.id, 1)}
                  className="px-2 py-1 bg-white hover:bg-emerald-50 border border-black/[0.08] hover:border-emerald-300 text-xs font-bold rounded-lg transition-colors"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => updateMemberSessions(member.id, 6)}
                  className="px-2 py-1 bg-white hover:bg-emerald-50 border border-black/[0.08] hover:border-emerald-300 text-xs font-bold rounded-lg transition-colors"
                >
                  +6
                </button>
                <button
                  type="button"
                  onClick={() => updateMemberSessions(member.id, 12)}
                  className="px-2 py-1 bg-white hover:bg-emerald-50 border border-black/[0.08] hover:border-emerald-300 text-xs font-bold rounded-lg transition-colors"
                >
                  +12
                </button>
                <button
                  type="button"
                  onClick={() => updateMemberSessions(member.id, -1)}
                  className="px-2 py-1 bg-white hover:bg-red-50 border border-black/[0.08] hover:border-red-300 text-xs font-bold text-red-600 rounded-lg transition-colors"
                  title="1 Seans Düşür"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Biometric & PR Metrics */}
            <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                BİYOMETRİ & KİŞİSEL REKORLAR (PR)
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 bg-white rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-[#64748B] block">Kilo / Yağ</span>
                  <span className="font-bold text-[#0F172A]">{member.weight || "78.5 kg"} • {member.bodyFat || "%15.8"}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-[#64748B] block">Deadlift PR</span>
                  <span className="font-bold text-emerald-700">{member.deadliftPr || "140 kg"}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-[#64748B] block">Squat PR</span>
                  <span className="font-bold text-emerald-700">{member.squatPr || "115 kg"}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-[#64748B] block">Bench PR</span>
                  <span className="font-bold text-emerald-700">{member.benchPr || "95 kg"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health & Coach Notes Details */}
          <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                ANTRENÖR SAĞLIK & PROTOKOL BİLGİLERİ
              </span>
              <button
                type="button"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                {isEditingNotes ? "İptal" : "Bilgileri Düzenle ✎"}
              </button>
            </div>

            {isEditingNotes ? (
              <form onSubmit={handleSaveDetails} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Sakatlık & Eklem Hassasiyeti Uyarısı
                  </label>
                  <input
                    type="text"
                    value={injuryAlert}
                    onChange={(e) => setInjuryAlert(e.target.value)}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Antrenman Hedefi
                  </label>
                  <input
                    type="text"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Genel Sağlık & Koç Protokol Notları
                  </label>
                  <textarea
                    rows={2}
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(false)}
                    className="px-3 py-1.5 rounded-lg border text-xs text-[#64748B]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#0F172A] text-white text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Kaydet</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] block">ANTRENMAN HEDEFİ</span>
                  <p className="text-[#0F172A] font-semibold">{member.targetGoal || "Kuvvet artışı & mobilite"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] block">KOÇ PROTOKOL NOTLARI</span>
                  <p className="text-[#475569] leading-relaxed italic bg-white p-2.5 rounded-xl border border-black/[0.04]">
                    &ldquo;{member.healthNotes || "Biyomekanik taraması tamamlandı, düzenli antrenman periyodunda."}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-[#64748B] border-t border-black/[0.05] pt-4">
            <span>Kayıt Tarihi: {member.joinDate || "12 Temmuz 2026"}</span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs hover:bg-black"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
