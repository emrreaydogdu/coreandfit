"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, RotateCcw, CheckCircle2, UserX } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import type { BookedSession } from "@/types/portal";
import { formatDateLong } from "@/lib/format";
import { todayIso, SLOT_REASON_TEXT } from "@/lib/slots";
import { dayKeyFromDate, workoutLabel } from "@/lib/training";

interface AdminSessionActionModalProps {
  session: BookedSession | null;
  onClose: () => void;
}

export const AdminSessionActionModal: React.FC<AdminSessionActionModalProps> = ({ session, onClose }) => {
  const { cancelBookedSession, rescheduleBookedSession, coachSchedules, checkSlotAvailability } = useMember();

  const [activeMode, setActiveMode] = useState<"reschedule" | "cancel" | "noshow">("reschedule");
  const [newDate, setNewDate] = useState<string>(session?.date || todayIso());
  const [newTime, setNewTime] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [refundCredit, setRefundCredit] = useState<boolean>(true);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  if (!session) return null;

  const daySlots = coachSchedules[0]?.weeklySchedule.find((d) => d.dayKey === dayKeyFromDate(newDate))?.slots ?? [];

  const finish = (res: { ok: true; message?: string } | { ok: false; error: string }) => {
    setResult(res.ok ? { ok: true, text: res.message ?? "Kaydedildi." } : { ok: false, text: res.error });
    if (res.ok) setTimeout(onClose, 1500);
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    finish(await rescheduleBookedSession(session.id, newDate, newTime));
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    finish(await cancelBookedSession(session.id, refundCredit, cancelReason || "Üye talebiyle iptal"));
  };

  const handleNoShow = async () => {
    finish(await cancelBookedSession(session.id, false, "Üye randevuya gelmedi"));
  };

  const fieldClass = "w-full min-h-11 p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto overscroll-contain"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2.5 text-[#94A3B8] rounded-full bg-slate-100" aria-label="Kapat">
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1 mb-5 pr-10">
            <h3 className="text-xl font-bold">Ertele veya İptal Et</h3>
            <p className="text-xs text-[#64748B]">
              <strong className="text-[#0F172A]">{session.memberName}</strong> • {workoutLabel(session.workoutType)} •{" "}
              {formatDateLong(session.date)} {session.timeSlot}
            </p>
          </div>

          {result && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                result.ok ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{result.text}</span>
            </div>
          )}

          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
              {[
                { id: "reschedule", label: "Ertele", icon: RotateCcw },
                { id: "cancel", label: "İptal Et", icon: AlertTriangle },
                { id: "noshow", label: "Gelmedi", icon: UserX },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveMode(tab.id as typeof activeMode)}
                    className={`min-h-10 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 ${
                      isActive ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeMode === "reschedule" && (
              <form onSubmit={handleReschedule} className="space-y-3">
                <label className="block">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Yeni tarih</span>
                  <input
                    type="date"
                    required
                    min={todayIso()}
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      setNewTime("");
                    }}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Yeni saat</span>
                  <select required value={newTime} onChange={(e) => setNewTime(e.target.value)} className={fieldClass}>
                    <option value="">Saat seçin</option>
                    {daySlots.map((slot) => {
                      const status = checkSlotAvailability(newDate, slot.time, session.id);
                      return (
                        <option key={slot.id} value={slot.time} disabled={!status.isAvailable}>
                          {slot.time} {status.isAvailable ? "" : `(${SLOT_REASON_TEXT[status.reason].replace(".", "")})`}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <p className="p-3 bg-blue-50 rounded-xl text-blue-900">Randevu yeni saate taşınır ve onaylı olarak kalır. Ders hakkı değişmez.</p>
                <button type="submit" className="w-full min-h-11 rounded-xl bg-[#0F172A] text-white font-bold uppercase tracking-wider">
                  Yeni Saati Kaydet
                </button>
              </form>
            )}

            {activeMode === "cancel" && (
              <form onSubmit={handleCancel} className="space-y-3">
                <label className="block">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">İptal sebebi (dahili)</span>
                  <input
                    type="text"
                    placeholder="Örn: Üye iş toplantısı nedeniyle iptal etti"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refundCredit}
                    onChange={(e) => setRefundCredit(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="font-bold">Ders hakkını iade et (+1)</span>
                </label>
                <button type="submit" className="w-full min-h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider">
                  Randevuyu İptal Et
                </button>
              </form>
            )}

            {activeMode === "noshow" && (
              <div className="space-y-3">
                <p className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 leading-relaxed">
                  Üye randevusuna haber vermeden gelmediyse randevu iptal edilir ve ders hakkı iade edilmez.
                </p>
                <button
                  type="button"
                  onClick={handleNoShow}
                  className="w-full min-h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider"
                >
                  Gelmedi Olarak İşaretle
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
