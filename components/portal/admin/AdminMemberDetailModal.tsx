"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, AlertCircle, MessageSquare, Save, CheckCircle2, Gift, Users, Ruler, Dumbbell } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import type { MemberStatus, StudioMemberCRM } from "@/types/portal";
import { DAY_KEYS, WORKOUT_TYPES, WORKOUT_TYPE_LIST, type ProgramDay, type WorkoutType } from "@/lib/training";
import { BODY_FIELDS, firstVsLatest, signed, formatNumber, type BodyFieldKey } from "@/lib/measurements";
import { formatDateShort, formatDateMedium } from "@/lib/format";

interface AdminMemberDetailModalProps {
  member: StudioMemberCRM | null;
  onClose: () => void;
  onOpenWhatsApp: (name: string, phone: string) => void;
}

const emptyMeasurement = () =>
  ({ weightKg: "", ...Object.fromEntries(BODY_FIELDS.map((f) => [f.key, ""])) }) as Record<"weightKg" | BodyFieldKey, string>;

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  icon: Icon,
  children,
  action,
}) => (
  <section className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl space-y-3">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-emerald-600" />
        {title}
      </span>
      {action}
    </div>
    {children}
  </section>
);

export const AdminMemberDetailModal: React.FC<AdminMemberDetailModalProps> = ({ member, onClose, onOpenWhatsApp }) => {
  const {
    crmMembers,
    adminMeasurements,
    adminGifts,
    updateMemberSessions,
    updateMemberDetails,
    adminAddMeasurement,
    createGift,
    updateGiftStatus,
  } = useMember();

  const current = crmMembers.find((m) => m.id === member?.id) ?? member;

  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [injuryAlert, setInjuryAlert] = useState(member?.injuryAlert || "");
  const [healthNotes, setHealthNotes] = useState(member?.healthNotes || "");
  const [targetGoal, setTargetGoal] = useState(member?.targetGoal || "");
  const [program, setProgram] = useState<ProgramDay[]>(member?.program ?? []);
  const [measurementForm, setMeasurementForm] = useState(emptyMeasurement);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [giftTitle, setGiftTitle] = useState("");
  const [giftDescription, setGiftDescription] = useState("");

  if (!current) return null;

  const measurements = adminMeasurements.filter((m) => m.memberId === current.id);
  const weight = firstVsLatest(measurements, "weightKg");
  const lastMeasurementDate = measurements.length ? measurements[measurements.length - 1].date : null;
  const gifts = adminGifts.filter((g) => g.memberId === current.id);

  const report = (res: { ok: boolean; message?: string; error?: string }) => {
    setFeedback({ ok: res.ok, text: res.ok ? res.message ?? "Kaydedildi." : res.error ?? "İşlem tamamlanamadı." });
    setTimeout(() => setFeedback(null), 3000);
  };

  const setDayType = (dayKey: ProgramDay["dayKey"], type: WorkoutType | "") =>
    setProgram((prev) => {
      const rest = prev.filter((p) => p.dayKey !== dayKey);
      return type ? [...rest, { dayKey, type }] : rest;
    });

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateMemberDetails(current.id, { injuryAlert, healthNotes, targetGoal });
    report(res);
    if (res.ok) setIsEditingNotes(false);
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(measurementForm)
        .filter(([, v]) => v.trim() !== "")
        .map(([k, v]) => [k, Number(v.replace(",", "."))])
    );
    const res = await adminAddMeasurement(current.id, { date: new Date().toISOString().slice(0, 10), ...payload });
    report(res);
    if (res.ok) {
      setMeasurementForm(emptyMeasurement());
      setShowMeasurementForm(false);
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createGift({ memberId: current.id, title: giftTitle, description: giftDescription });
    report(res);
    if (res.ok) {
      setGiftTitle("");
      setGiftDescription("");
    }
  };

  const inputClass = "w-full min-h-10 p-2 bg-white border border-black/[0.08] rounded-xl text-xs";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto overscroll-contain space-y-4"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-slate-100"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Başlık */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-4 pr-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                {current.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold">{current.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full">{current.memberNo}</span>
                </div>
                <p className="text-xs text-[#64748B]">
                  {current.tier} • Kayıt: {formatDateMedium(current.joinDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={current.status}
                onChange={async (e) => report(await updateMemberDetails(current.id, { status: e.target.value as MemberStatus }))}
                className="min-h-10 px-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold"
                aria-label="Üyelik durumu"
              >
                <option value="Aktif">Aktif</option>
                <option value="Yenileme Bekliyor">Yenileme Bekliyor</option>
                <option value="Pasif">Pasif</option>
              </select>
              <button
                type="button"
                onClick={() => onOpenWhatsApp(current.name, current.phone)}
                className="min-h-10 px-3 bg-[#25D366]/10 text-[#128C7E] font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <a
                href={`tel:${current.phone.replace(/\s+/g, "")}`}
                className="min-h-10 px-3 bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5"
                aria-label="Ara"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback.text}</span>
            </div>
          )}

          {current.injuryAlert && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-950 font-medium leading-relaxed">{current.injuryAlert}</p>
            </div>
          )}

          {/* Ders hakkı */}
          <Section title="Ders Hakkı" icon={CheckCircle2}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-600">{current.remaining}</span>
                <span className="text-xs text-[#64748B]">/ {current.total} toplam ders</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 10, 20].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={async () => report(await updateMemberSessions(current.id, n))}
                    className="min-h-10 px-3 bg-white border border-black/[0.08] hover:border-emerald-300 text-xs font-bold rounded-lg"
                  >
                    +{n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={async () => report(await updateMemberSessions(current.id, -1))}
                  className="min-h-10 px-3 bg-white border border-black/[0.08] hover:border-red-300 text-xs font-bold text-red-600 rounded-lg"
                >
                  -1
                </button>
              </div>
            </div>
          </Section>

          {/* Program */}
          <Section
            title="Haftalık Program"
            icon={Dumbbell}
            action={
              <button
                type="button"
                onClick={async () => report(await updateMemberDetails(current.id, { program }))}
                className="min-h-9 px-3 rounded-lg bg-[#0F172A] text-white text-xs font-bold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                Kaydet
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DAY_KEYS.map((d) => (
                <label key={d.key} className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-black/[0.04]">
                  <span className="text-xs font-semibold">{d.name}</span>
                  <select
                    value={program.find((p) => p.dayKey === d.key)?.type ?? ""}
                    onChange={(e) => setDayType(d.key, e.target.value as WorkoutType | "")}
                    className="min-h-9 px-2 bg-[#F8FAFC] border border-black/[0.08] rounded-lg text-xs"
                  >
                    <option value="">Dinlenme</option>
                    {WORKOUT_TYPE_LIST.map((t) => (
                      <option key={t} value={t}>
                        {WORKOUT_TYPES[t].label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </Section>

          {/* Vücut ölçümleri */}
          <Section
            title="Vücut Ölçümleri"
            icon={Ruler}
            action={
              <button
                type="button"
                onClick={() => setShowMeasurementForm((v) => !v)}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                {showMeasurementForm ? "Vazgeç" : "+ Yeni ölçüm"}
              </button>
            }
          >
            {lastMeasurementDate && (
              <p className="text-[11px] text-[#64748B]">Son ölçüm tarihi: {formatDateShort(lastMeasurementDate)}</p>
            )}
            <div className="p-3 bg-white rounded-xl border border-black/[0.04] grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-[#64748B] block">İlk ağırlık</span>
                <span className="font-bold">{weight ? `${formatNumber(weight.first)} kg` : "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">Güncel</span>
                <span className="font-bold">{weight ? `${formatNumber(weight.latest)} kg` : "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">Fark</span>
                <span className={`font-bold ${weight && weight.diff > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {weight ? `${signed(weight.diff)} kg` : "—"}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-black/[0.04] bg-white">
              <table className="w-full text-xs min-w-[360px]">
                <thead>
                  <tr className="text-[10px] text-[#64748B] uppercase">
                    <th className="p-2 text-left">Ölçü</th>
                    <th className="p-2 text-right">İlk</th>
                    <th className="p-2 text-right">Güncel</th>
                    <th className="p-2 text-right">Fark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {BODY_FIELDS.map((f) => {
                    const v = firstVsLatest(measurements, f.key);
                    return (
                      <tr key={f.key}>
                        <td className="p-2 font-semibold">{f.label}</td>
                        <td className="p-2 text-right">{v ? `${formatNumber(v.first)} cm` : "—"}</td>
                        <td className="p-2 text-right">{v ? `${formatNumber(v.latest)} cm` : "—"}</td>
                        <td className={`p-2 text-right font-bold ${v && v.diff > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                          {v ? `${signed(v.diff)} cm` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {showMeasurementForm && (
              <form onSubmit={handleAddMeasurement} className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <label className="col-span-2 sm:col-span-3">
                  <span className="text-[10px] font-bold text-[#64748B] block mb-1">Vücut Ağırlığı (kg)</span>
                  <input
                    inputMode="decimal"
                    value={measurementForm.weightKg}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, weightKg: e.target.value })}
                    className={inputClass}
                  />
                </label>
                {BODY_FIELDS.map((f) => (
                  <label key={f.key}>
                    <span className="text-[10px] font-bold text-[#64748B] block mb-1">{f.label} (cm)</span>
                    <input
                      inputMode="decimal"
                      value={measurementForm[f.key]}
                      onChange={(e) => setMeasurementForm({ ...measurementForm, [f.key]: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  className="col-span-2 sm:col-span-3 min-h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Ölçümü Kaydet
                </button>
              </form>
            )}
          </Section>

          {/* Hediye */}
          <Section title="Hediye ve Avantajlar" icon={Gift}>
            {gifts.length > 0 && (
              <ul className="space-y-2">
                {gifts.map((g) => (
                  <li key={g.id} className="p-2.5 bg-white rounded-xl border border-black/[0.04] flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold block">{g.title}</span>
                      {g.description && <span className="text-[#64748B] block truncate">{g.description}</span>}
                    </div>
                    <select
                      value={g.status}
                      onChange={async (e) => report(await updateGiftStatus(g.id, e.target.value as typeof g.status))}
                      className="min-h-9 px-2 bg-[#F8FAFC] border border-black/[0.08] rounded-lg text-xs shrink-0"
                      aria-label="Hediye durumu"
                    >
                      <option value="available">Kullanılabilir</option>
                      <option value="used">Kullanıldı</option>
                      <option value="expired">Süresi Doldu</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddGift} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_auto] gap-2 text-xs">
              <input
                required
                placeholder="Başlık (örn. 1 Ücretsiz Ders)"
                value={giftTitle}
                onChange={(e) => setGiftTitle(e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Kısa açıklama"
                value={giftDescription}
                onChange={(e) => setGiftDescription(e.target.value)}
                className={inputClass}
              />
              <button type="submit" className="min-h-10 px-4 rounded-xl bg-[#0F172A] text-white font-bold">
                Tanımla
              </button>
            </form>
          </Section>

          {/* Referans */}
          <Section title="Referans" icon={Users}>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono font-black text-sm">{current.referral.code || "—"}</span>
                <span className="text-[#64748B] block">
                  {current.referral.uses} kullanım • {current.referral.successful} başarılı •{" "}
                  {current.referral.discountActive ? "%10 indirim aktif" : "indirim pasif"}
                </span>
              </div>
              <button
                type="button"
                onClick={async () =>
                  report(await updateMemberDetails(current.id, { referralCodeDisabled: !current.referral.disabled }))
                }
                className={`min-h-10 px-3 rounded-xl text-xs font-bold ${
                  current.referral.disabled ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
                }`}
              >
                {current.referral.disabled ? "Kodu Aktifleştir" : "Kodu Geçersiz Kıl"}
              </button>
            </div>
            {current.referredMembers.length > 0 && (
              <ul className="text-xs space-y-1">
                {current.referredMembers.map((r) => (
                  <li key={r.id} className="flex justify-between gap-2 p-2 bg-white rounded-lg border border-black/[0.04]">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-[#64748B]">
                      {formatDateShort(r.joinDate)} • {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Notlar (yalnızca yönetici görür) */}
          <Section
            title="Antrenör Notları (üyeye gösterilmez)"
            icon={AlertCircle}
            action={
              <button type="button" onClick={() => setIsEditingNotes(!isEditingNotes)} className="text-xs font-semibold text-emerald-700 hover:underline">
                {isEditingNotes ? "Vazgeç" : "Düzenle"}
              </button>
            }
          >
            {isEditingNotes ? (
              <form onSubmit={handleSaveNotes} className="space-y-2 text-xs">
                <input placeholder="Sakatlık / hassasiyet uyarısı" value={injuryAlert} onChange={(e) => setInjuryAlert(e.target.value)} className={inputClass} />
                <input placeholder="Hedef" value={targetGoal} onChange={(e) => setTargetGoal(e.target.value)} className={inputClass} />
                <textarea
                  rows={2}
                  placeholder="Sağlık notları"
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs"
                />
                <button type="submit" className="min-h-10 px-4 rounded-xl bg-[#0F172A] text-white font-bold flex items-center gap-1">
                  <Save className="w-3.5 h-3.5" />
                  Kaydet
                </button>
              </form>
            ) : (
              <div className="space-y-1.5 text-xs">
                <p>
                  <span className="text-[#64748B]">Hedef: </span>
                  <span className="font-semibold">{current.targetGoal || "—"}</span>
                </p>
                <p>
                  <span className="text-[#64748B]">Sağlık notu: </span>
                  <span className="font-semibold">{current.healthNotes || "—"}</span>
                </p>
              </div>
            )}
          </Section>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
