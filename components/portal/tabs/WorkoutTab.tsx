"use client";

import React from "react";
import { Dumbbell, MessageSquare, CalendarPlus } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { todayIso } from "@/lib/slots";
import { DAY_KEYS, HEAD_COACH_NAME, WORKOUT_TYPES, dayKeyFromDate } from "@/lib/training";

export const WorkoutTab: React.FC = () => {
  const { program, setActiveTab } = useMember();
  const todayKey = dayKeyFromDate(todayIso());
  const plannedDays = DAY_KEYS.filter((d) => program.some((p) => p.dayKey === d.key));

  const openWhatsApp = () => {
    const text = encodeURIComponent("Merhaba İlker Hocam, antrenman programım hakkında bir sorum var:");
    window.open(`https://wa.me/905318477882?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] text-emerald-600 uppercase tracking-wider font-bold">Haftalık Plan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
            Antrenman Programım
          </h2>
          <p className="text-xs text-[#64748B] mt-1">Programınız {HEAD_COACH_NAME} tarafından hazırlanır ve güncellenir.</p>
        </div>
        <button
          type="button"
          onClick={openWhatsApp}
          className="self-start min-h-11 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-full text-xs font-bold flex items-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Koça Soru Sor</span>
        </button>
      </div>

      {plannedDays.length === 0 ? (
        <div className="p-8 text-center bg-white border border-black/[0.06] rounded-3xl space-y-2">
          <Dumbbell className="w-9 h-9 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-semibold text-[#0F172A]">Programınız henüz hazırlanmadı</p>
          <p className="text-xs text-[#64748B]">İlk görüşmenizden sonra haftalık planınız burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {DAY_KEYS.map((day) => {
            const entry = program.find((p) => p.dayKey === day.key);
            const isToday = day.key === todayKey;
            return (
              <div
                key={day.key}
                className={`flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                  entry
                    ? isToday
                      ? "bg-[#0F172A] border-[#0F172A] text-white"
                      : "bg-white border-black/[0.06]"
                    : "bg-[#F8FAFC] border-dashed border-black/[0.06]"
                }`}
                data-keep-white={entry && isToday ? "" : undefined}
              >
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${entry && isToday ? "text-emerald-300" : "text-[#64748B]"}`}>
                    {day.name}
                    {isToday && " • Bugün"}
                  </span>
                  {entry ? (
                    <p className={`text-lg sm:text-xl font-black mt-0.5 ${isToday ? "text-white" : "text-[#0F172A]"}`}>
                      {WORKOUT_TYPES[entry.type].label}
                      <span className={`ml-2 text-xs font-semibold ${isToday ? "text-slate-300" : "text-[#94A3B8]"}`}>
                        {WORKOUT_TYPES[entry.type].en}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-[#94A3B8] mt-0.5">Dinlenme</p>
                  )}
                </div>
                {entry && (
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isToday ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <Dumbbell className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setActiveTab("sessions")}
        className="w-full min-h-12 bg-[#0F172A] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
      >
        <CalendarPlus className="w-4 h-4 text-emerald-400" />
        <span>Seans Ayırt</span>
      </button>
    </div>
  );
};
