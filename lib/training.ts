// Antrenman tipleri, randevu durumları ve program günleri: istemci ve sunucu ortak kullanır.

export type WorkoutType = "UPPER" | "LOWER" | "FULL";

export const WORKOUT_TYPES: Record<WorkoutType, { label: string; en: string }> = {
  UPPER: { label: "Üst Vücut", en: "Upper Body" },
  LOWER: { label: "Alt Vücut", en: "Lower Body" },
  FULL: { label: "Tam Vücut", en: "Full Body" },
};

export const WORKOUT_TYPE_LIST: WorkoutType[] = ["UPPER", "LOWER", "FULL"];

export const isWorkoutType = (value: unknown): value is WorkoutType =>
  typeof value === "string" && value in WORKOUT_TYPES;

export const workoutLabel = (type?: string | null) =>
  type && isWorkoutType(type) ? WORKOUT_TYPES[type].label : "Antrenman";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Onay Bekliyor",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};

// Rozet renkleri (Tailwind sınıfları) durumla birlikte tek yerde tutulur.
export const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 border border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border border-rose-200",
  COMPLETED: "bg-slate-100 text-slate-700 border border-slate-200",
};

// Slot dolu sayılan durumlar
export const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED"];

export type DayKey = "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz";

export const DAY_KEYS: { key: DayKey; name: string }[] = [
  { key: "pzt", name: "Pazartesi" },
  { key: "sal", name: "Salı" },
  { key: "car", name: "Çarşamba" },
  { key: "per", name: "Perşembe" },
  { key: "cum", name: "Cuma" },
  { key: "cts", name: "Cumartesi" },
  { key: "paz", name: "Pazar" },
];

export interface ProgramDay {
  dayKey: DayKey;
  type: WorkoutType;
}

// JS Date.getDay() (0 = Pazar) → DayKey
export const dayKeyFromDate = (isoDate: string): DayKey => {
  const order: DayKey[] = ["paz", "pzt", "sal", "car", "per", "cum", "cts"];
  return order[new Date(`${isoDate}T12:00:00`).getDay()];
};

export const STUDIO_AREA = "Core & Fit Spor Alanı";
export const HEAD_COACH_NAME = "İlker Yüksel";
