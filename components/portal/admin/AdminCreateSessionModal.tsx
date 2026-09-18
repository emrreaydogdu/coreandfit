"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Check,
  Sparkles,
  Dumbbell,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { COACHES_DATA } from "@/data/coaches";

interface AdminCreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCoachName?: string;
}

const STATIONS = [
  "Özel İstasyon A (Kuvvet Alanı)",
  "Özel İstasyon B (Biyomekanik)",
  "Fonksiyonel Alan (Kettlebell Parkuru)",
  "Reformer Pilates Bölümü",
];

const FOCUS_AREAS = [
  "Biyomekanik & Kuvvet (Deadlift / Squat)",
  "Postüral Düzeltme & Omurga Sağlığı",
  "Metabolik Kondisyon & Yağ Yakımı",
  "Fonksiyonel Mobilite & Esneklik",
  "Hipertrofi & Kas Kütlesi Kazanımı",
];

export const AdminCreateSessionModal: React.FC<AdminCreateSessionModalProps> = ({
  isOpen,
  onClose,
  defaultCoachName,
}) => {
  const {
    user,
    remainingSessions,
    totalSessions,
    coachSchedules,
    adminCreateSession,
  } = useMember();

  // Mock members list
  const memberOptions = useMemo(
    () => [
      {
        id: "mem-1",
        name: user?.fullName || "Ege Mert",
        memberNo: user?.memberNo || "CF-89210",
        tier: user?.membershipTier || "VIP 1:1 Personal Training",
        remaining: remainingSessions,
        phone: user?.phone || "+90 532 555 0124",
      },
      {
        id: "mem-2",
        name: "Burak Demir",
        memberNo: "CF-77102",
        tier: "Performance Athlete",
        remaining: 4,
        phone: "+90 533 421 8899",
      },
      {
        id: "mem-3",
        name: "Deniz Aydın",
        memberNo: "CF-64019",
        tier: "VIP 1:1 Personal Training",
        remaining: 18,
        phone: "+90 530 112 3344",
      },
      {
        id: "mem-4",
        name: "Zeynep Kaya",
        memberNo: "CF-51920",
        tier: "Studio Member",
        remaining: 1,
        phone: "+90 542 998 7766",
      },
      {
        id: "custom",
        name: "+ Yeni Misafir / Üye Girişi",
        memberNo: "GUEST",
        tier: "Misafir Seansı",
        remaining: 0,
        phone: "",
      },
    ],
    [user, remainingSessions]
  );

  // Form states
  const [selectedMemberId, setSelectedMemberId] = useState<string>("mem-1");
  const [customMemberName, setCustomMemberName] = useState<string>("");
  const [customMemberPhone, setCustomMemberPhone] = useState<string>("");

  const defaultCoach =
    COACHES_DATA.find((c) => defaultCoachName && c.name.includes(defaultCoachName)) ||
    COACHES_DATA[0];
  const [selectedCoach, setSelectedCoach] = useState(defaultCoach);

  // Date default tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("09:30 - 10:30");
  const [selectedStation, setSelectedStation] = useState<string>(STATIONS[0]);
  const [selectedFocus, setSelectedFocus] = useState<string>(FOCUS_AREAS[0]);
  const [notes, setNotes] = useState<string>("");
  const [deductCredit, setDeductCredit] = useState<boolean>(true);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Find active slots for selected coach on selected day
  const activeCoachSlots = useMemo(() => {
    const coachSchedule = coachSchedules.find((c) => c.coachId === selectedCoach.id);
    if (!coachSchedule) return [];

    const dateObj = new Date(selectedDate);
    const dayIndex = dateObj.getDay(); // 0 = Paz, 1 = Pzt...
    const dayKeys: ("paz" | "pzt" | "sal" | "car" | "per" | "cum" | "cts")[] = [
      "paz",
      "pzt",
      "sal",
      "car",
      "per",
      "cum",
      "cts",
    ];
    const targetKey = dayKeys[dayIndex];
    const daySchedule = coachSchedule.weeklySchedule.find((d) => d.dayKey === targetKey);

    return daySchedule?.slots || [];
  }, [coachSchedules, selectedCoach.id, selectedDate]);

  if (!isOpen) return null;

  const currentMember = memberOptions.find((m) => m.id === selectedMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const memberName =
      selectedMemberId === "custom"
        ? customMemberName || "Misafir Danışan"
        : currentMember?.name || "Ege Mert";

    const memberNo =
      selectedMemberId === "custom"
        ? `GUEST-${Math.floor(1000 + Math.random() * 9000)}`
        : currentMember?.memberNo;

    const res = adminCreateSession({
      memberId: selectedMemberId === "custom" ? undefined : selectedMemberId,
      memberName,
      memberNo,
      coachId: selectedCoach.id,
      coachName: selectedCoach.name,
      coachTitle: selectedCoach.title,
      coachAvatar: selectedCoach.image,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      focusArea: selectedFocus,
      station: selectedStation,
      notes: notes || undefined,
      deductCredit: deductCredit && (currentMember?.remaining || 0) > 0,
    });

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white border border-black/[0.08] rounded-[32px] shadow-2xl p-6 sm:p-8 text-[#0F172A] my-8 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-display uppercase tracking-tight text-[#0F172A]">
                Manuel Seans Oluştur & Planla
              </h3>
              <p className="text-xs text-[#64748B]">
                Stüdyo yönetimi veya koç adına doğrudan 1:1 seans randevusu girin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-5 pt-4 pr-1">
          {/* Section 1: Member Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              1. ÜYE / DANIŞAN SEÇİMİ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {memberOptions.map((mem) => {
                const isSelected = selectedMemberId === mem.id;
                return (
                  <button
                    key={mem.id}
                    type="button"
                    onClick={() => setSelectedMemberId(mem.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-[#0F172A] bg-slate-50 ring-2 ring-[#0F172A]/15 shadow-xs"
                        : "border-black/[0.06] hover:bg-slate-50/60 bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{mem.name}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">
                        {mem.tier} {mem.remaining > 0 ? `• ${mem.remaining} Seans Hak` : ""}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom member input fields */}
            {selectedMemberId === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 p-3 bg-slate-50 rounded-2xl border border-black/[0.06]">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Misafir Adı Soyadı
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ayşe Kaya"
                    value={customMemberName}
                    onChange={(e) => setCustomMemberName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    placeholder="+90 530 000 0000"
                    value={customMemberPhone}
                    onChange={(e) => setCustomMemberPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Coach Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              2. ANTRENÖR / KOÇ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {COACHES_DATA.map((coach) => {
                const isSelected = selectedCoach.id === coach.id;
                return (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => setSelectedCoach(coach)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-[#0F172A] bg-slate-50 ring-2 ring-[#0F172A]/15 shadow-xs"
                        : "border-black/[0.06] hover:bg-slate-50/60 bg-white"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#0F172A] truncate">
                        {coach.name}
                      </div>
                      <div className="text-[10px] text-[#64748B] truncate">
                        {coach.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                3. SEANS TARİHİ
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                4. SAAT ARALIĞI
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]"
              >
                {activeCoachSlots.length > 0 ? (
                  activeCoachSlots.map((slot) => (
                    <option key={slot.id} value={slot.time}>
                      {slot.time} {slot.isAvailable ? "✓ (Müsait)" : `⛔ (${slot.label || "Dolu/Mola"})`}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="08:00 - 09:00">08:00 - 09:00</option>
                    <option value="09:30 - 10:30">09:30 - 10:30</option>
                    <option value="11:00 - 12:00">11:00 - 12:00</option>
                    <option value="14:00 - 15:00">14:00 - 15:00</option>
                    <option value="16:30 - 17:30">16:30 - 17:30</option>
                    <option value="18:00 - 19:00">18:00 - 19:00</option>
                    <option value="19:30 - 20:30">19:30 - 20:30</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Section 4: Station & Focus Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                5. ÖZEL İSTASYON / ALAN
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-medium text-[#0F172A]"
              >
                {STATIONS.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                6. SEANS ODAK ALANI
              </label>
              <select
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-medium text-[#0F172A]"
              >
                {FOCUS_AREAS.map((focus) => (
                  <option key={focus} value={focus}>
                    {focus}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 5: Trainer Directives & Notes */}
          <div>
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
              7. EĞİTMEN DİREKTİFİ & SEANS PLANI (OPSİYONEL)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Sol omuz rotasyon testi yapılacak, deadlift tempo 3-1-1 uygulanacak..."
              className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Section 6: Deduct Credit Toggle */}
          {selectedMemberId !== "custom" && (currentMember?.remaining || 0) > 0 && (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Üyenin Mevcut Seans Bakiyesinden 1 Seans Düş
                  </div>
                  <div className="text-[11px] text-emerald-800/80">
                    Kalan bakiye: {currentMember?.remaining} Seans → {deductCredit ? (currentMember?.remaining || 1) - 1 : currentMember?.remaining} Seans
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                id="deductToggle"
                checked={deductCredit}
                onChange={(e) => setDeductCredit(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seansı Onayla & Randevuyu Kaydet</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
