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

// Stüdyo İstanbul saatiyle çalışır; sunucu UTC'de olsa da "bugün" ve turnike saati İstanbul'a göre hesaplanır.
const STUDIO_TZ = "Europe/Istanbul";

// Bugünün YYYY-MM-DD karşılığı (İstanbul)
export const todayIso = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: STUDIO_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

// Şu anki saat SS:DD (İstanbul)
export const istanbulTime = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: STUDIO_TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
