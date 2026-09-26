"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar as CalendarIcon, CheckCircle2, MapPin, ShieldCheck, AlertCircle } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { todayIso, SLOT_REASON_TEXT } from "@/lib/slots";
import { HEAD_COACH_NAME, STUDIO_AREA, WORKOUT_TYPES, WORKOUT_TYPE_LIST, dayKeyFromDate, type WorkoutType } from "@/lib/training";

interface AdminCreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTimeSlot?: string;
}

export const AdminCreateSessionModal: React.FC<AdminCreateSessionModalProps> = ({ isOpen, onClose, initialDate, initialTimeSlot }) => {
  const { crmMembers, coachSchedules, adminCreateSession, checkSlotAvailability } = useMember();

  const activeMembers = crmMembers.filter((m) => m.status !== "Pasif");
  const [memberId, setMemberId] = useState("");
  // Modal her açılışta yeniden oluşturulur (key); başlangıç değerleri prop'lardan gelir.
  const [date, setDate] = useState(initialDate ?? todayIso());
  const [timeSlot, setTimeSlot] = useState(initialTimeSlot ?? "");
  const [workoutType, setWorkoutType] = useState<WorkoutType>("FULL");
  const [internalNote, setInternalNote] = useState("");
  const [deductCredit, setDeductCredit] = useState(true);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const member = crmMembers.find((m) => m.id === memberId);

  // Üyenin programındaki güne göre antrenman tipini öner
  const suggestType = (id: string, day: string) => {
    const m = crmMembers.find((x) => x.id === id);
    setWorkoutType(m?.program.find((p) => p.dayKey === dayKeyFromDate(day))?.type ?? "FULL");
  };

  const daySlots = useMemo(() => {
    const day = coachSchedules[0]?.weeklySchedule.find((d) => d.dayKey === dayKeyFromDate(date));
    return day?.slots ?? [];
  }, [coachSchedules, date]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !timeSlot) return;
    setSaving(true);
    const res = await adminCreateSession({ memberId, date, timeSlot, workoutType, internalNote, deductCredit });
    setSaving(false);
    setResult(res.ok ? { ok: true, text: res.message ?? "Randevu oluşturuldu." } : { ok: false, text: res.error });
    if (res.ok) setTimeout(onClose, 1500);
  };

  const fieldClass = "w-full min-h-11 p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative w-full max-w-xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl text-[#0F172A] max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-black/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Randevu Oluştur</h3>
              <p className="text-xs text-[#64748B]">Yöneticinin oluşturduğu randevu doğrudan onaylanır.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]" aria-label="Kapat">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4 text-xs">
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3.5 rounded-2xl flex items-center gap-2.5 font-semibold ${
                  result.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-800"
                }`}
              >
                {result.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{result.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <label className="block">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">Üye</span>
            <select
              required
              value={memberId}
              onChange={(e) => {
                setMemberId(e.target.value);
                suggestType(e.target.value, date);
              }}
              className={fieldClass}
            >
              <option value="">Üye seçin</option>
              {activeMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.memberNo}) • {m.remaining} ders
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">Tarih</span>
              <input
                type="date"
                required
                min={todayIso()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTimeSlot("");
                  suggestType(memberId, e.target.value);
                }}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">Saat</span>
              <select required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className={fieldClass}>
                <option value="">Saat seçin</option>
                {daySlots.map((slot) => {
                  const status = checkSlotAvailability(date, slot.time);
                  return (
                    <option key={slot.id} value={slot.time} disabled={!status.isAvailable}>
                      {slot.time} {status.isAvailable ? "" : `(${SLOT_REASON_TEXT[status.reason].replace(".", "")})`}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">Antrenman Tipi</span>
            <div className="grid grid-cols-3 gap-2">
              {WORKOUT_TYPE_LIST.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setWorkoutType(t)}
                  className={`min-h-12 rounded-xl border font-bold transition-all ${
                    workoutType === t ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-black/[0.08] bg-[#F8FAFC]"
                  }`}
                >
                  {WORKOUT_TYPES[t].label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-xl flex items-center gap-2 text-[#475569]">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {HEAD_COACH_NAME} • {STUDIO_AREA}
            </span>
          </div>

          <label className="block">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">Dahili not (üyeye gösterilmez)</span>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs"
            />
          </label>

          {member && member.remaining > 0 && (
            <label className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 cursor-pointer">
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <span className="font-bold text-emerald-950 block">Üyenin ders hakkından 1 düş</span>
                  <span className="text-[11px] text-emerald-800/80">
                    Kalan: {member.remaining} → {deductCredit ? member.remaining - 1 : member.remaining}
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={deductCredit}
                onChange={(e) => setDeductCredit(e.target.checked)}
                className="w-5 h-5 accent-emerald-600"
              />
            </label>
          )}

          <div className="pt-1 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="min-h-11 px-4 rounded-xl border border-black/[0.08] font-semibold text-[#64748B]">
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving || !memberId || !timeSlot}
              className="min-h-11 px-6 rounded-xl bg-[#0F172A] hover:bg-black text-white font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Randevuyu Kaydet"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
