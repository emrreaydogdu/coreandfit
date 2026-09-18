"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { COACHES_DATA } from "@/data/coaches";

const DAYS_META: { key: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz"; name: string; short: string }[] = [
  { key: "pzt", name: "Pazartesi", short: "Pzt" },
  { key: "sal", name: "Salı", short: "Sal" },
  { key: "car", name: "Çarşamba", short: "Çar" },
  { key: "per", name: "Perşembe", short: "Per" },
  { key: "cum", name: "Cuma", short: "Cum" },
  { key: "cts", name: "Cumartesi", short: "Cts" },
  { key: "paz", name: "Pazar", short: "Paz" },
];

export const AdminCoachSlotsTab: React.FC = () => {
  const {
    coachSchedules,
    updateCoachDayStatus,
    toggleCoachSlotAvailability,
    addCoachSlot,
    removeCoachSlot,
    copyCoachScheduleToWeekdays,
  } = useMember();

  const [selectedCoachId, setSelectedCoachId] = useState<string>("coach-1");
  const [selectedDayKey, setSelectedDayKey] = useState<"pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz">("pzt");

  // New slot modal / inline
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState("");
  const [newSlotLabel, setNewSlotLabel] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find active coach profile
  const currentCoachProfile = coachSchedules.find((c) => c.coachId === selectedCoachId) || coachSchedules[0];
  const currentDaySchedule = currentCoachProfile?.weeklySchedule.find((d) => d.dayKey === selectedDayKey);
  const currentCoachMeta = COACHES_DATA.find((c) => c.id === selectedCoachId) || COACHES_DATA[0];

  const handleToggleSlot = (slotId: string) => {
    toggleCoachSlotAvailability(selectedCoachId, selectedDayKey, slotId);
    setToastMessage("Slot müsaitlik durumu güncellendi.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleDayWorking = (working: boolean) => {
    updateCoachDayStatus(selectedCoachId, selectedDayKey, working);
    setToastMessage(working ? "Gün çalışma gününe alındı." : "Gün dinlenme/izinli gününe alındı.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddNewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) return;

    addCoachSlot(selectedCoachId, selectedDayKey, newSlotTime.trim(), newSlotLabel.trim() || undefined);
    setNewSlotTime("");
    setNewSlotLabel("");
    setIsAddingSlot(false);
    setToastMessage("Yeni seans saati eklendi.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyWeekdays = () => {
    copyCoachScheduleToWeekdays(selectedCoachId, selectedDayKey);
    setToastMessage(`${currentDaySchedule?.dayName} programı tüm hafta içi günlerine (Pzt-Cum) başarıyla kopyalandı.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Coach Switcher Card */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
          <div>
            <h3 className="font-bold text-base uppercase text-[#0F172A]">
              Koç Randevu & Müsaitlik Saatleri Yönetimi
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Antrenörün gün içindeki müsait seans slotlarını, mola saatlerini ve çalışma günlerini yönetin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748B] uppercase">Seans Süresi:</span>
            <span className="px-3 py-1 bg-slate-100 text-[#0F172A] rounded-xl text-xs font-bold">
              {currentCoachProfile?.sessionDurationMin || 60} Dakika
            </span>
          </div>
        </div>

        {/* Coach Profiles Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COACHES_DATA.map((coach) => {
            const isSelected = selectedCoachId === coach.id;
            return (
              <button
                key={coach.id}
                type="button"
                onClick={() => setSelectedCoachId(coach.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                  isSelected
                    ? "border-[#0F172A] bg-slate-50 ring-2 ring-[#0F172A]/15 shadow-sm"
                    : "border-black/[0.06] hover:bg-slate-50/50 bg-white"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[#0F172A] truncate">
                    {coach.name}
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate mt-0.5">
                    {coach.title}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Aktif Koç</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekday Selection Bar & Day Status */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
          {/* Day Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {DAYS_META.map((d) => {
              const isSelected = selectedDayKey === d.key;
              const dayData = currentCoachProfile?.weeklySchedule.find((s) => s.dayKey === d.key);
              const isWorking = dayData?.isWorkingDay ?? true;

              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDayKey(d.key)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-[#0F172A] text-white shadow-sm"
                      : "bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] border border-black/[0.04]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isWorking ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />
                  <span>{d.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Copy to Weekdays Button */}
          <button
            type="button"
            onClick={handleCopyWeekdays}
            className="px-3.5 py-2 bg-[#F1F5F9] hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
            title="Bu günün saat ayarlarını tüm hafta içine kopyala"
          >
            <Copy className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Hafta İçi Günlerine Kopyala</span>
          </button>
        </div>

        {/* Selected Day Status Bar */}
        <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#0F172A]">
                {currentCoachMeta.name} • {currentDaySchedule?.dayName} Programı
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentDaySchedule?.isWorkingDay
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {currentDaySchedule?.isWorkingDay ? "Randevuya Açık" : "İzinli Gün"}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Slot kartlarına tıklayarak seansları randevuya açabilir veya mola/kapalı duruma getirebilirsiniz.
            </p>
          </div>

          {/* Working Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-semibold text-[#0F172A]">
              {currentDaySchedule?.isWorkingDay ? "Çalışıyor" : "İzinli"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentDaySchedule?.isWorkingDay ?? true}
                onChange={(e) => handleToggleDayWorking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Add custom slot button / inline form */}
        <div className="flex items-center justify-between">
          <div className="font-bold text-xs uppercase text-[#0F172A]">
            Saat Aralıkları & Mola Planı ({currentDaySchedule?.slots.length || 0} Slot)
          </div>

          <button
            type="button"
            onClick={() => setIsAddingSlot(!isAddingSlot)}
            className="px-3 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Yeni Saat Aralığı Ekle</span>
          </button>
        </div>

        {/* Inline Slot Adder */}
        {isAddingSlot && (
          <form
            onSubmit={handleAddNewSlot}
            className="p-4 bg-slate-50 border border-black/[0.08] rounded-2xl flex flex-col sm:flex-row items-end gap-3 text-xs"
          >
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                Saat Aralığı
              </label>
              <input
                type="text"
                required
                placeholder="Örn: 12:30 - 13:30 veya 21:00"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                Etiket / Açıklama (Opsiyonel)
              </label>
              <input
                type="text"
                placeholder="Örn: VIP Slot, Mola vb."
                value={newSlotLabel}
                onChange={(e) => setNewSlotLabel(e.target.value)}
                className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={() => setIsAddingSlot(false)}
                className="px-3 py-2 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors"
              >
                Ekle
              </button>
            </div>
          </form>
        )}

        {/* Slot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentDaySchedule?.slots.map((slot) => {
            const isAvail = slot.isAvailable && (currentDaySchedule.isWorkingDay ?? true);
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isAvail
                    ? "bg-white border-black/[0.08] hover:border-emerald-500 shadow-2xs"
                    : "bg-slate-50 border-black/[0.04] opacity-75"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-4 h-4 ${
                          isAvail ? "text-emerald-600" : "text-[#94A3B8]"
                        }`}
                      />
                      <span className="font-bold text-sm text-[#0F172A]">
                        {slot.time}
                      </span>
                    </div>
                    {slot.label && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-[#64748B] text-[10px] font-semibold rounded-md">
                        {slot.label}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCoachSlot(selectedCoachId, selectedDayKey, slot.id)}
                    className="text-[#94A3B8] hover:text-rose-600 p-1 transition-colors"
                    title="Bu slotu kaldır"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Click to toggle status */}
                <button
                  type="button"
                  onClick={() => handleToggleSlot(slot.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isAvail
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvail ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  <span>
                    {isAvail ? "✓ Randevuya Açık (Müsait)" : "⛔ Kapalı / Mola / Blokeli"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
