import type { CoachScheduleProfile } from "@/types/portal";
import { dayKeyFromDate } from "@/lib/training";

// "17:30 - 18:30" veya "17:30" biçimindeki saatleri dakika aralığına çevirir.
const parseRange = (slot: string) => {
  const matches = Array.from(slot.replace(/\./g, ":").matchAll(/(\d{1,2}):(\d{2})/g));
  if (matches.length === 0) return null;
  const start = Number(matches[0][1]) * 60 + Number(matches[0][2]);
  let end = matches.length > 1 ? Number(matches[1][1]) * 60 + Number(matches[1][2]) : start + 60;
  if (end <= start) end = start + 60;
  return { start, end };
};

export const timeSlotsOverlap = (a: string, b: string) => {
  if (!a || !b) return false;
  if (a.trim() === b.trim()) return true;
  const ra = parseRange(a);
  const rb = parseRange(b);
  if (!ra || !rb) return false;
  return Math.max(ra.start, rb.start) < Math.min(ra.end, rb.end);
};

export type SlotUnavailableReason = "booked" | "blocked" | "day_off" | "break" | "past";

export interface SlotContext {
  occupied: { id?: string; date: string; timeSlot: string }[];
  blocked: Record<string, string[]>;
  coachSchedules: CoachScheduleProfile[];
}

export function slotStatus(
  ctx: SlotContext,
  date: string,
  timeSlot: string,
  ignoreBookingId?: string
): { isAvailable: true } | { isAvailable: false; reason: SlotUnavailableReason } {
  const taken = ctx.occupied.some(
    (o) => o.id !== ignoreBookingId && o.date === date && timeSlotsOverlap(o.timeSlot, timeSlot)
  );
  if (taken) return { isAvailable: false, reason: "booked" };

  if ((ctx.blocked[date] || []).some((b) => timeSlotsOverlap(b, timeSlot))) {
    return { isAvailable: false, reason: "blocked" };
  }

  const coach = ctx.coachSchedules[0];
  const day = coach?.weeklySchedule.find((d) => d.dayKey === dayKeyFromDate(date));
  if (day && !day.isWorkingDay) return { isAvailable: false, reason: "day_off" };
  const scheduled = day?.slots.find((s) => timeSlotsOverlap(s.time, timeSlot));
  if (scheduled && !scheduled.isAvailable) return { isAvailable: false, reason: "break" };

  return { isAvailable: true };
}

export const SLOT_REASON_TEXT: Record<SlotUnavailableReason, string> = {
  booked: "Bu saat dolu.",
  blocked: "Bu saat randevuya kapalı.",
  day_off: "Bu gün antrenörümüzün izinli günü.",
  break: "Bu saat mola aralığında.",
  past: "Geçmiş bir saate randevu alınamaz.",
};

// Yerel saat diliminde bugünün YYYY-MM-DD karşılığı
export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
