export type PaymentMethod = 
  | "online_card" 
  | "cash_register" 
  | "pos_register" 
  | "bank_transfer";

export type PaymentStatus = 
  | "completed" 
  | "pending_cashier" 
  | "pending_transfer" 
  | "cancelled";

export type SessionStatus = 
  | "confirmed" 
  | "completed" 
  | "cancelled";

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
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  membershipTier: "VIP 1:1 Personal Training" | "Performance Athlete" | "Studio Member";
  joinDate: string;
  birthDate?: string;
  emergencyContact?: string;
  healthNotes?: string;
  address?: UserAddress;
  savedCards?: SavedCard[];
}

export interface BookedSession {
  id: string;
  memberId?: string;
  memberName?: string;
  memberNo?: string;
  coachId: string;
  coachName: string;
  coachTitle: string;
  coachAvatar: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  focusArea: string;
  station: string;
  status: SessionStatus;
  notes?: string;
  createdAt: string;
}

export interface CheckInLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  coachName: string;
  sessionType: string;
  performanceNote: string;
  keyMetric?: string;
}

export interface PortalPackage {
  id: string;
  name: string;
  subtitle: string;
  sessionCount: number;
  validityDays: number;
  price: number;
  formattedPrice: string;
  badge?: string;
  features: string[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  packageId: string;
  packageName: string;
  sessionCount: number;
  amount: number;
  formattedAmount: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  receiptCode: string;
  paidAt?: string;
}

export type PortalTab = 
  | "dashboard" 
  | "sessions" 
  | "workout"
  | "history" 
  | "store" 
  | "profile";

export interface BodyMeasurementRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent: number;
  muscleMassKg: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  note?: string;
  coachConfirmed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category: "warmup" | "strength" | "core" | "cooldown";
  targetMuscles: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetRpe?: string;
  targetWeight?: string;
  formTips: string[];
  commonMistakes: string[];
  isCompleted?: boolean;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  coachName: string;
  coachTitle: string;
  phase: string;
  durationMinutes: number;
  intensity: "Orta" | "Yüksek" | "Maksimal";
  exercises: WorkoutExercise[];
  coachNotes: string;
}

export interface UserBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconType: "flame" | "trophy" | "shield" | "zap" | "star" | "heart";
  unlockedAt?: string;
  isUnlocked: boolean;
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
  turnstileRelayDelay: number; // in seconds, e.g. 5
  qrRefreshSeconds: number; // e.g. 60
  autoDeductOnTurnstile: boolean;
  weekdayHours: string; // e.g. "07:00 - 22:00"
  weekendHours: string; // e.g. "08:30 - 20:00"
  bankAccounts: StudioBankAccount[];
}

export interface CoachTimeSlot {
  id: string;
  time: string; // e.g. "09:30 - 10:30" or "09:30"
  isAvailable: boolean;
  label?: string; // e.g. "Öğle Molası", "VIP Özel"
}

export interface CoachDaySchedule {
  dayKey: "pzt" | "sal" | "car" | "per" | "cum" | "cts" | "paz";
  dayName: string; // e.g. "Pazartesi"
  isWorkingDay: boolean;
  slots: CoachTimeSlot[];
}

export interface CoachScheduleProfile {
  coachId: string;
  coachName: string;
  coachTitle: string;
  sessionDurationMin: number; // e.g. 60
  weeklySchedule: CoachDaySchedule[];
}

export interface StudioInventoryItem {
  id: string;
  name: string;
  category: "sarf" | "icecek" | "hijyen" | "ekipman";
  quantity: number;
  unit: string;
  minThreshold: number;
  lastRestocked: string;
}

export interface StudioMaintenanceTask {
  id: string;
  equipmentName: string;
  category: string;
  status: "perfect" | "attention" | "maintenance_needed";
  lastChecked: string;
  nextDueDate: string;
  notes: string;
  assignedTo: string;
}

export interface StudioDailyChecklistItem {
  id: string;
  title: string;
  category: "acilis" | "hijyen" | "kapanis" | "guvenlik";
  completed: boolean;
  time?: string;
}

export interface StudioMemberCRM {
  id: string;
  name: string;
  memberNo: string;
  tier: string;
  remaining: number;
  total: number;
  status: "Aktif" | "Yenileme Bekliyor" | "Pasif";
  phone: string;
  email: string;
  coach: string;
  injuryAlert?: string;
  healthNotes?: string;
  targetGoal?: string;
  weight?: string;
  bodyFat?: string;
  deadliftPr?: string;
  squatPr?: string;
  benchPr?: string;
  joinDate?: string;
}
