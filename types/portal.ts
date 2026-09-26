import type { BookingStatus, ProgramDay, WorkoutType } from "@/lib/training";

export type PaymentMethod = "online_card" | "cash_register" | "bank_transfer";

export type PaymentStatus = "completed" | "pending_cashier" | "pending_transfer" | "cancelled";

export type MemberRole = "member" | "admin";

export type MemberStatus = "Aktif" | "Yenileme Bekliyor" | "Pasif";

export interface SavedCard {
  id: string;
  last4: string;
  cardHolder: string;
  expiry: string;
  brand: "visa" | "mastercard";
  isDefault: boolean;
}

export interface UserAddress {
  title: string;
  street: string;
  district: string;
  city: string;
  postalCode?: string;
}

export interface MemberUser {
  id: string;
  memberNo: string;
  role: MemberRole;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  membershipTier: string;
  joinDate: string;
  birthDate?: string;
  emergencyContact?: string;
  healthNotes?: string;
  address?: UserAddress;
  savedCards?: SavedCard[];
}

export interface BookedSession {
  id: string;
  memberId: string;
  memberName?: string;
  memberNo?: string;
  memberPhone?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "HH:mm - HH:mm"
  workoutType: WorkoutType;
  status: BookingStatus;
  memberNote?: string;
  // Yalnızca admin yanıtlarında gelir; müşteri API'si bu alanı hiç göndermez
  internalNote?: string;
  createdBy: "member" | "admin";
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  memberId: string;
  memberName?: string;
  packageId: string;
  packageName: string;
  sessionCount: number;
  basePrice: number;
  discountRate: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  receiptCode: string;
  paidAt?: string;
}

export type PortalTab = "dashboard" | "sessions" | "workout" | "history" | "store" | "profile";

// Vücut ölçüm kaydı: ağırlık kg, diğer tüm ölçüler cm
export interface BodyMeasurementRecord {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  shoulderCm?: number;
  chestCm?: number;
  waistCm?: number;
  abdomenCm?: number;
  hipCm?: number;
  armRightCm?: number;
  armLeftCm?: number;
  legRightCm?: number;
  legLeftCm?: number;
  note?: string;
}

export type GiftStatus = "available" | "used" | "expired";

export interface MemberGift {
  id: string;
  memberId: string | null; // null: tüm üyelere açık
  title: string;
  description: string;
  status: GiftStatus;
  createdAt: string;
}

export interface ReferralSummary {
  code: string;
  disabled: boolean;
  uses: number;
  successful: number;
  discountActive: boolean;
  referredByCode?: string;
}

export interface StudioBankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  branch: string;
}

export interface StudioSettings {
  studioName: string;
  legalTitle: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  maxCapacity: number;
  turnstileRelayDelay: number;
  qrRefreshSeconds: number;
  autoDeductOnTurnstile: boolean;
  weekdayHours: string;
  weekendHours: string;
  bankAccounts: StudioBankAccount[];
}

export interface CoachTimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  label?: string;
}

export interface CoachDaySchedule {
  dayKey: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz";
  dayName: string;
  isWorkingDay: boolean;
  slots: CoachTimeSlot[];
}

export interface CoachScheduleProfile {
  coachId: string;
  coachName: string;
  coachTitle: string;
  sessionDurationMin: number;
  weeklySchedule: CoachDaySchedule[];
}

// Admin üye rehberi satırı: üye kaydı + referans istatistikleri
export interface StudioMemberCRM {
  id: string;
  name: string;
  memberNo: string;
  email: string;
  phone: string;
  tier: string;
  remaining: number;
  total: number;
  status: MemberStatus;
  joinDate: string;
  injuryAlert?: string;
  healthNotes?: string;
  targetGoal?: string;
  program: ProgramDay[];
  referral: ReferralSummary;
  referredMembers: { id: string; name: string; joinDate: string; status: MemberStatus }[];
}

// Müşteri tarafının slot doluluğu için gördüğü anonim bilgi
export interface AvailabilityData {
  occupied: { date: string; timeSlot: string }[];
  blocked: Record<string, string[]>;
  coachSchedules: CoachScheduleProfile[];
}

export interface MemberSnapshot {
  user: MemberUser;
  remainingSessions: number;
  totalSessions: number;
  packageExpiry: string;
  bookings: BookedSession[];
  measurements: BodyMeasurementRecord[];
  program: ProgramDay[];
  gifts: MemberGift[];
  orders: OrderItem[];
  referral: ReferralSummary;
  bankAccounts: StudioBankAccount[];
}

export interface AdminSnapshot {
  members: StudioMemberCRM[];
  bookings: BookedSession[];
  orders: OrderItem[];
  measurements: BodyMeasurementRecord[];
  gifts: MemberGift[];
  studioSettings: StudioSettings;
  coachSchedules: CoachScheduleProfile[];
  blocked: Record<string, string[]>;
}
