// Varsayılan stüdyo ayarları ve yalnızca geliştirme ortamında (SEED_DEMO=1) yüklenen demo verisi.
// Sunucu ilk açılışta bu verilerle veritabanını doldurur; istemci bu dosyayı veri kaynağı olarak kullanmaz.
import type { StudioSettings, StudioBankAccount, CoachScheduleProfile } from "@/types/portal";
import type { ProgramDay, WorkoutType, BookingStatus } from "@/lib/training";

export const STUDIO_BANK_ACCOUNTS: StudioBankAccount[] = [
  {
    id: "bank-1",
    bankName: "Garanti BBVA",
    accountHolder: "Core & Fit Spor ve Sağlıklı Yaşam Hizmetleri A.Ş.",
    iban: "TR34 0006 2000 1234 5678 9012 34",
    branch: "Nişantaşı Şubesi (Kod: 123)",
  },
  {
    id: "bank-2",
    bankName: "Yapı Kredi",
    accountHolder: "Core & Fit Spor ve Sağlıklı Yaşam Hizmetleri A.Ş.",
    iban: "TR92 0006 7010 0000 0098 7654 32",
    branch: "Teşvikiye Şubesi (Kod: 456)",
  },
];

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  studioName: "Core & Fit Nişantaşı Studio",
  legalTitle: "Core & Fit Spor ve Sağlıklı Yaşam Hizmetleri A.Ş.",
  address: "Abdi İpekçi Cad. No: 42/A, Nişantaşı, Şişli / İstanbul",
  phone: "+90 212 234 56 78",
  whatsapp: "+90 531 847 78 82",
  email: "info@coreandfit.com",
  maxCapacity: 20,
  turnstileRelayDelay: 5,
  qrRefreshSeconds: 60,
  autoDeductOnTurnstile: true,
  weekdayHours: "07:00 - 22:00",
  weekendHours: "08:30 - 20:00",
  bankAccounts: STUDIO_BANK_ACCOUNTS,
};

const BASE_WEEKLY_DAYS: { dayKey: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz"; dayName: string }[] = [
  { dayKey: "pzt", dayName: "Pazartesi" },
  { dayKey: "sal", dayName: "Salı" },
  { dayKey: "car", dayName: "Çarşamba" },
  { dayKey: "per", dayName: "Perşembe" },
  { dayKey: "cum", dayName: "Cuma" },
  { dayKey: "cts", dayName: "Cumartesi" },
  { dayKey: "paz", dayName: "Pazar" },
];

const DEFAULT_DAY_SLOTS = [
  { id: "slot-1", time: "08:00 - 09:00", isAvailable: true },
  { id: "slot-2", time: "09:30 - 10:30", isAvailable: true },
  { id: "slot-3", time: "11:00 - 12:00", isAvailable: true },
  { id: "slot-4", time: "13:00 - 14:00", isAvailable: false, label: "Öğle Molası" },
  { id: "slot-5", time: "14:30 - 15:30", isAvailable: true },
  { id: "slot-6", time: "16:00 - 17:00", isAvailable: true },
  { id: "slot-7", time: "17:30 - 18:30", isAvailable: true },
  { id: "slot-8", time: "19:00 - 20:00", isAvailable: true },
  { id: "slot-9", time: "20:30 - 21:30", isAvailable: false, label: "Akşam Kapanış" },
];

export const DEFAULT_COACH_SCHEDULES: CoachScheduleProfile[] = [
  {
    coachId: "coach-1",
    coachName: "İlker Yüksel",
    coachTitle: "Kurucu & Baş Antrenör",
    sessionDurationMin: 60,
    weeklySchedule: BASE_WEEKLY_DAYS.map((d) => ({
      dayKey: d.dayKey,
      dayName: d.dayName,
      isWorkingDay: d.dayKey !== "paz",
      slots: DEFAULT_DAY_SLOTS.map((s) => ({ ...s, id: `${d.dayKey}-${s.id}` })),
    })),
  },
];

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

// ---------------------------------------------------------------------------
// Demo verisi (yalnızca SEED_DEMO=1)
// ---------------------------------------------------------------------------

export interface DemoMemberSeed {
  key: string;
  fullName: string;
  email: string;
  phone: string;
  memberNo: string;
  referralCode: string;
  referredByKey?: string;
  remaining: number;
  total: number;
  status: "Aktif" | "Yenileme Bekliyor" | "Pasif";
  joinDate: string;
  injuryAlert?: string;
  healthNotes?: string;
  targetGoal?: string;
  program: ProgramDay[];
}

export const DEMO_MEMBERS: DemoMemberSeed[] = [
  {
    key: "ege",
    fullName: "Ege Mert",
    email: "egemert@example.com",
    phone: "+90 532 555 0124",
    memberNo: "CF-89210",
    referralCode: "CORE-EGE721",
    remaining: 9,
    total: 12,
    status: "Aktif",
    joinDate: "2026-07-12",
    injuryAlert: "Sol diz eski menisküs operasyonu; tek bacak hareketlerinde kontrollü derinlik.",
    targetGoal: "Yağ kaybı ve sıkılaşma",
    program: [
      { dayKey: "pzt", type: "UPPER" },
      { dayKey: "car", type: "LOWER" },
      { dayKey: "cum", type: "FULL" },
    ],
  },
  {
    key: "burak",
    fullName: "Burak Demir",
    email: "burak.demir@example.com",
    phone: "+90 533 421 8899",
    memberNo: "CF-77102",
    referralCode: "CORE-BURAK305",
    referredByKey: "ege",
    remaining: 4,
    total: 12,
    status: "Aktif",
    joinDate: "2026-08-03",
    injuryAlert: "Sağ omuz sıkışma sendromu; baş üstü itişlerde açıya dikkat.",
    targetGoal: "Kondisyon ve genel kuvvet",
    program: [
      { dayKey: "sal", type: "FULL" },
      { dayKey: "per", type: "UPPER" },
    ],
  },
  {
    key: "deniz",
    fullName: "Deniz Aydın",
    email: "deniz.aydin@example.com",
    phone: "+90 530 112 3344",
    memberNo: "CF-64019",
    referralCode: "CORE-DENIZ118",
    remaining: 18,
    total: 20,
    status: "Aktif",
    joinDate: "2026-05-19",
    targetGoal: "Duruş düzeltme ve ağrısız günlük yaşam",
    program: [
      { dayKey: "pzt", type: "LOWER" },
      { dayKey: "per", type: "FULL" },
    ],
  },
  {
    key: "zeynep",
    fullName: "Zeynep Kaya",
    email: "zeynep.kaya@example.com",
    phone: "+90 542 998 7766",
    memberNo: "CF-51920",
    referralCode: "CORE-ZEYNEP447",
    remaining: 1,
    total: 10,
    status: "Yenileme Bekliyor",
    joinDate: "2026-01-02",
    targetGoal: "Sıkılaşma ve günlük enerji",
    program: [{ dayKey: "sal", type: "FULL" }],
  },
];

export const DEMO_BOOKINGS: {
  memberKey: string;
  offsetDays: number;
  timeSlot: string;
  workoutType: WorkoutType;
  status: BookingStatus;
}[] = [
  { memberKey: "ege", offsetDays: -6, timeSlot: "17:30 - 18:30", workoutType: "UPPER", status: "COMPLETED" },
  { memberKey: "ege", offsetDays: -3, timeSlot: "17:30 - 18:30", workoutType: "LOWER", status: "COMPLETED" },
  { memberKey: "ege", offsetDays: 2, timeSlot: "17:30 - 18:30", workoutType: "FULL", status: "CONFIRMED" },
  { memberKey: "ege", offsetDays: 4, timeSlot: "11:00 - 12:00", workoutType: "UPPER", status: "PENDING" },
  { memberKey: "burak", offsetDays: 1, timeSlot: "09:30 - 10:30", workoutType: "FULL", status: "PENDING" },
  { memberKey: "deniz", offsetDays: 3, timeSlot: "16:00 - 17:00", workoutType: "LOWER", status: "CONFIRMED" },
];

export const DEMO_MEASUREMENTS: {
  memberKey: string;
  date: string;
  weightKg: number;
  shoulderCm: number;
  chestCm: number;
  waistCm: number;
  abdomenCm: number;
  hipCm: number;
  armRightCm: number;
  armLeftCm: number;
  legRightCm: number;
  legLeftCm: number;
}[] = [
  { memberKey: "ege", date: "2026-07-15", weightKg: 86, shoulderCm: 118, chestCm: 104, waistCm: 94, abdomenCm: 98, hipCm: 106, armRightCm: 36, armLeftCm: 35.5, legRightCm: 60, legLeftCm: 59.5 },
  { memberKey: "ege", date: "2026-08-15", weightKg: 83.2, shoulderCm: 118.5, chestCm: 103, waistCm: 91, abdomenCm: 95, hipCm: 104, armRightCm: 36.5, armLeftCm: 36, legRightCm: 59, legLeftCm: 58.5 },
  { memberKey: "ege", date: "2026-09-12", weightKg: 82.4, shoulderCm: 119, chestCm: 102.5, waistCm: 89, abdomenCm: 93, hipCm: 103, armRightCm: 37, armLeftCm: 36.5, legRightCm: 58.5, legLeftCm: 58 },
  { memberKey: "ege", date: "2026-09-19", weightKg: 81.4, shoulderCm: 119, chestCm: 102, waistCm: 88, abdomenCm: 92, hipCm: 102.5, armRightCm: 37, armLeftCm: 36.5, legRightCm: 58, legLeftCm: 58 },
  { memberKey: "deniz", date: "2026-05-20", weightKg: 65, shoulderCm: 102, chestCm: 90, waistCm: 76, abdomenCm: 82, hipCm: 98, armRightCm: 28, armLeftCm: 27.5, legRightCm: 55, legLeftCm: 55 },
  { memberKey: "deniz", date: "2026-09-10", weightKg: 63, shoulderCm: 102, chestCm: 89, waistCm: 72, abdomenCm: 78, hipCm: 96, armRightCm: 28.5, armLeftCm: 28, legRightCm: 54, legLeftCm: 54 },
];

export const DEMO_GIFTS: { memberKey: string | null; title: string; description: string }[] = [
  {
    memberKey: "ege",
    title: "1 Ücretsiz Ders",
    description: "Arkadaşını Getir kampanyası kapsamında hesabınıza tanımlandı. Randevu alırken stüdyoya bildirmeniz yeterli.",
  },
];
