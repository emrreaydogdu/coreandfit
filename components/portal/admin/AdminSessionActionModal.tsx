"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  UserX,
  ArrowRight,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { BookedSession } from "@/types/portal";

interface AdminSessionActionModalProps {
  session: BookedSession | null;
  onClose: () => void;
}

export const AdminSessionActionModal: React.FC<AdminSessionActionModalProps> = ({
  session,
  onClose,
}) => {
  const { cancelBookedSession, rescheduleBookedSession } = useMember();

  const [activeMode, setActiveMode] = useState<"reschedule" | "cancel" | "noshow">("reschedule");
  const [newDate, setNewDate] = useState<string>(session?.date || "2026-09-20");
  const [newTime, setNewTime] = useState<string>(session?.timeSlot || "14:30 - 15:30");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [refundCredit, setRefundCredit] = useState<boolean>(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!session) return null;

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    const res = rescheduleBookedSession(session.id, newDate, newTime);
    if (res.success) {
      setActionSuccessMsg(res.message);
      setTimeout(() => {
        setActionSuccessMsg(null);
        onClose();
      }, 2000);
    }
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    const res = cancelBookedSession(session.id, refundCredit, cancelReason || "Danışan talebiyle iptal");
    if (res.success) {
      setActionSuccessMsg(res.message);
      setTimeout(() => {
        setActionSuccessMsg(null);
        onClose();
      }, 2000);
    }
  };

  const handleNoShow = () => {
    const res = cancelBookedSession(session.id, false, "No-Show (Danışan seansa mazeretsiz katılmadı)");
    if (res.success) {
      setActionSuccessMsg("Seans No-Show olarak işaretlendi ve kredi düşüldü.");
      setTimeout(() => {
        setActionSuccessMsg(null);
        onClose();
      }, 2000);
    }
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
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              SEANS OPERASYONEL DÜZENLEME
            </span>
            <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              Seansı Ertele veya İptal Et
            </h3>
            <p className="text-xs text-[#64748B]">
              Danışan: <strong className="text-[#0F172A]">{session.memberName || "Ege Mert"}</strong> •{" "}
              Mevcut Saat: <span className="font-mono text-emerald-700 font-bold">{session.date} {session.timeSlot}</span>
            </p>
          </div>

          {actionSuccessMsg ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-[#0F172A]">{actionSuccessMsg}</p>
            </div>
          ) : (
            <div className="space-y-5 text-xs font-sans">
              {/* Mode Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                {[
                  { id: "reschedule", label: "Saat Ertele", icon: RotateCcw },
                  { id: "cancel", label: "İptal Et", icon: AlertTriangle },
                  { id: "noshow", label: "No-Show (Gelmedi)", icon: UserX },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveMode(tab.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? "bg-white text-[#0F172A] shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 1. RESCHEDULE FORM */}
              {activeMode === "reschedule" && (
                <form onSubmit={handleReschedule} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      YENİ SEANS TARİHİ
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      YENİ SEANS SAATİ
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 16:00 - 17:00 veya 18:30"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200/50 rounded-xl text-xs text-blue-900">
                    ℹ️ Seans yeni tarihe taşınır, danışanın seans kredisinde eksilme/artış olmaz.
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Yeni Saati Kaydet
                    </button>
                  </div>
                </form>
              )}

              {/* 2. CANCEL FORM */}
              {activeMode === "cancel" && (
                <form onSubmit={handleCancel} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      İPTAL SEBEBİ
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Danışan acil toplantı nedeniyle iptal etti"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-black/[0.05] rounded-xl space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={refundCredit}
                        onChange={(e) => setRefundCredit(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-[#0F172A]">
                        Danışanın seans kredisini iade et (+1 Seans)
                      </span>
                    </label>
                    <p className="text-[11px] text-[#64748B] pl-6">
                      İşaretlenirse danışanın bakiyesine 1 seans geri yüklenir. İşaretlenmezse seans yanmış sayılır.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Seansı İptal Et
                    </button>
                  </div>
                </form>
              )}

              {/* 3. NO-SHOW */}
              {activeMode === "noshow" && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-amber-900">
                    <h5 className="font-bold text-xs uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Danışan Randevusuna Gelmedi (No-Show)</span>
                    </h5>
                    <p className="text-xs leading-relaxed">
                      Stüdyo kuralı gereğince mazeretsiz katılınmayan seanslar tamamlanmış sayılarak krediden düşülür.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      onClick={handleNoShow}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      No-Show Onayla & Kredi Düş
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
