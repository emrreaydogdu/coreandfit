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
  | "store" 
  | "history" 
  | "profile";
