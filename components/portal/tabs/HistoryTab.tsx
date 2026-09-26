"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scale, Ruler, Plus, X, ChevronRight, History, CheckCircle2, Clock } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { BODY_FIELDS, firstVsLatest, measurementHistory, signed, formatNumber, type BodyFieldKey } from "@/lib/measurements";
import { formatDateShort, formatDateLong } from "@/lib/format";
import { workoutLabel } from "@/lib/training";

const DiffBadge: React.FC<{ diff: number; unit: string }> = ({ diff, unit }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
      diff < 0 ? "bg-emerald-50 text-emerald-700" : diff > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
    }`}
  >
    {signed(diff)} {unit}
  </span>
);

const emptyForm = () => ({
  weightKg: "",
  ...Object.fromEntries(BODY_FIELDS.map((f) => [f.key, ""])),
}) as Record<"weightKg" | BodyFieldKey, string>;

export const HistoryTab: React.FC = () => {
  const { bookedSessions, bodyMeasurements, addBodyMeasurement } = useMember();
  const [subTab, setSubTab] = useState<"body" | "sessions">("body");
  const [isMeasuresOpen, setIsMeasuresOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const weight = firstVsLatest(bodyMeasurements, "weightKg");
  const history = measurementHistory(bodyMeasurements);
  const completed = bookedSessions
    .filter((s) => s.status === "COMPLETED")
    .sort((a, b) => (b.date + b.timeSlot).localeCompare(a.date + a.timeSlot));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(form)
        .filter(([, v]) => v.trim() !== "")
        .map(([k, v]) => [k, Number(v.replace(",", "."))])
    );
    const res = await addBodyMeasurement({ date: new Date().toISOString().slice(0, 10), ...payload });
    setSaving(false);
    if (res.ok) {
      setForm(emptyForm());
      setError(null);
      setIsAddOpen(false);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Değişimini Takip Et</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-0.5 font-display uppercase">Gelişimim</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">İlk başladığın günden bugüne vücudundaki değişim.</p>
        </div>
        <div className="flex items-center p-1 bg-black/[0.04] rounded-2xl self-start">
          <button
            type="button"
            onClick={() => setSubTab("body")}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${subTab === "body" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"}`}
          >
            Vücut Ölçümleri
          </button>
          <button
            type="button"
            onClick={() => setSubTab("sessions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${subTab === "sessions" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"}`}
          >
            Seans Geçmişi
          </button>
        </div>
      </div>

      {subTab === "body" && (
        <div className="space-y-5">
          {/* A. Vücut ağırlığı */}
          <section className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Vücut Ağırlığı</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="min-h-10 px-3.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ölçüm Ekle</span>
              </button>
            </div>
            {weight ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-3 sm:p-4 bg-[#F8FAFC] rounded-2xl">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase block">İlk</span>
                  <span className="text-lg sm:text-2xl font-black text-[#0F172A]">{formatNumber(weight.first)} kg</span>
                  <span className="text-[10px] text-[#94A3B8] block">{formatDateShort(weight.firstDate)}</span>
                </div>
                <div className="p-3 sm:p-4 bg-[#F8FAFC] rounded-2xl">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Güncel</span>
                  <span className="text-lg sm:text-2xl font-black text-[#0F172A]">{formatNumber(weight.latest)} kg</span>
                  <span className="text-[10px] text-[#94A3B8] block">{formatDateShort(weight.latestDate)}</span>
                </div>
                <div className={`p-3 sm:p-4 rounded-2xl ${weight.diff <= 0 ? "bg-emerald-50" : "bg-amber-50"}`}>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Değişim</span>
                  <span className={`text-lg sm:text-2xl font-black ${weight.diff <= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                    {signed(weight.diff)} kg
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#64748B]">Henüz kilo ölçümü yok.</p>
            )}
          </section>

          {/* B. Vücut ölçülerim */}
          <button
            type="button"
            onClick={() => setIsMeasuresOpen(true)}
            className="w-full text-left bg-white border border-black/[0.06] hover:border-black/[0.14] rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Vücut Ölçülerim</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Omuz, göğüs, bel, karın, kalça, kol ve bacak ölçülerinde ilk ve güncel değer</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
          </button>

          {/* Ölçüm geçmişi */}
          <section className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Ölçüm Geçmişi</h3>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-[#64748B]">Henüz ölçüm kaydı yok.</p>
            ) : (
              <ol className="space-y-3">
                {history.map((entry) => {
                  const rows = entry.changes.length > 0 ? entry.changes : entry.initial;
                  return (
                    <li key={entry.id} className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-[#0F172A]">{formatDateShort(entry.date)}</span>
                        {entry.changes.length === 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">İlk ölçüm</span>
                        )}
                      </div>
                      {rows.length === 0 ? (
                        <p className="text-xs text-[#64748B]">Değişiklik yok.</p>
                      ) : (
                        <ul className="space-y-1">
                          {rows.map((c) => (
                            <li key={c.label} className="flex items-center justify-between gap-3 text-xs">
                              <span className="text-[#64748B]">{c.label}</span>
                              <span className="font-semibold text-[#0F172A] text-right">
                                {entry.changes.length > 0 ? (
                                  <>
                                    {formatNumber(c.from)} {c.unit} → {formatNumber(c.to)} {c.unit}
                                  </>
                                ) : (
                                  <>
                                    {formatNumber(c.to)} {c.unit}
                                  </>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      )}

      {subTab === "sessions" && (
        <section className="space-y-3">
          {completed.length === 0 ? (
            <div className="p-8 text-center bg-white border border-black/[0.06] rounded-3xl text-xs text-[#64748B]">
              Henüz tamamlanan seansınız yok.
            </div>
          ) : (
            completed.map((s) => (
              <div key={s.id} className="bg-white border border-black/[0.06] rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0F172A]">{workoutLabel(s.workoutType)}</h4>
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDateLong(s.date)} • {s.timeSlot}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Vücut ölçülerim penceresi */}
      <AnimatePresence>
        {isMeasuresOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl text-[#0F172A] max-h-[90vh] flex flex-col"
            >
              <div className="p-5 sm:p-6 border-b border-black/[0.06] flex items-start justify-between gap-3 shrink-0">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase">Vücut Ölçülerim</h3>
                  <p className="text-xs text-[#64748B]">İlk ölçüm, güncel ölçüm ve aradaki fark (cm)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMeasuresOpen(false)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-2.5">
                {BODY_FIELDS.map((f) => {
                  const v = firstVsLatest(bodyMeasurements, f.key);
                  return (
                    <div key={f.key} className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#0F172A]">{f.label}</span>
                        {v && <DiffBadge diff={v.diff} unit="cm" />}
                      </div>
                      {v ? (
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-[10px] text-[#64748B] block">İlk Ölçüm ({formatDateShort(v.firstDate)})</span>
                            <span className="font-semibold">{formatNumber(v.first)} cm</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#64748B] block">Güncel ({formatDateShort(v.latestDate)})</span>
                            <span className="font-semibold">{formatNumber(v.latest)} cm</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#94A3B8] mt-1">Henüz ölçülmedi</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Yeni ölçüm penceresi */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl text-[#0F172A] max-h-[92vh] flex flex-col"
            >
              <div className="p-5 sm:p-6 border-b border-black/[0.06] flex items-start justify-between gap-3 shrink-0">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase">Ölçüm Ekle</h3>
                  <p className="text-xs text-[#64748B]">Sadece ölçtüğünüz değerleri girmeniz yeterli.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSave} className="flex flex-col min-h-0">
                <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 grid grid-cols-2 gap-3 text-xs">
                  <label className="col-span-2">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Vücut Ağırlığı (kg)</span>
                    <input
                      inputMode="decimal"
                      value={form.weightKg}
                      onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                      placeholder="Örn: 81,4"
                      className="w-full min-h-11 p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl"
                    />
                  </label>
                  {BODY_FIELDS.map((f) => (
                    <label key={f.key}>
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">{f.label} (cm)</span>
                      <input
                        inputMode="decimal"
                        value={form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full min-h-11 p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl"
                      />
                    </label>
                  ))}
                  {error && <p className="col-span-2 text-rose-600 font-medium">{error}</p>}
                </div>
                <div className="p-4 sm:p-5 border-t border-black/[0.06] flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="min-h-11 px-4 border border-black/[0.08] text-[#64748B] rounded-xl text-xs font-semibold"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="min-h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
