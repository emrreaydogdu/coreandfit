import { randomUUID, randomInt, randomBytes, createHmac, timingSafeEqual } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { getDb, transaction } from "./db";
import { HttpError, revokeMemberSessions } from "./auth";
import { burnPasswordTime, hashPassword, verifyPassword, PASSWORD_MAX, PASSWORD_MIN } from "./password";
import { EMAIL_RE, PHONE_RE, integer, isIsoDate, optionalText, text } from "./security";
import {
  PAYTR_IFRAME_BASE,
  maskMerchantId,
  paytrConfig,
  readCallbackFields,
  requestIframeToken,
  verifyCallbackHash,
} from "./paytr";
import { findPackage, type PackageItem } from "@/data/packages";
import { discountRateFor, REFERRAL_DISCOUNT_RATE } from "@/lib/pricing";
import { istanbulTime, slotStatus, SLOT_REASON_TEXT, todayIso, type SlotContext } from "@/lib/slots";
import {
  ACTIVE_BOOKING_STATUSES,
  DAY_KEYS,
  dayKeyFromDate,
  isWorkoutType,
  type BookingStatus,
  type ProgramDay,
  type WorkoutType,
} from "@/lib/training";
import { DEFAULT_AVATAR } from "@/data/portal-mock";
import type {
  AdminSnapshot,
  AvailabilityData,
  BodyMeasurementRecord,
  BookedSession,
  CoachScheduleProfile,
  MemberGift,
  MemberRole,
  MemberSnapshot,
  MemberStatus,
  MemberUser,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
  ReferralSummary,
  StudioMemberCRM,
  StudioSettings,
} from "@/types/portal";

// ---------------------------------------------------------------------------
// Satır tipleri ve dönüştürücüler
// ---------------------------------------------------------------------------

interface MemberRow {
  id: string;
  member_no: string;
  role: "member" | "admin";
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  avatar_url: string;
  membership_tier: string;
  join_date: string;
  remaining_sessions: number;
  total_sessions: number;
  package_expiry: string;
  status: MemberStatus;
  profile_json: string;
  injury_alert: string | null;
  target_goal: string | null;
  program_json: string;
  referral_code: string | null;
  referred_by_id: string | null;
  referral_code_disabled: number;
  kvkk_notice_at: string | null;
  health_consent_at: string | null;
}

interface BookingRow {
  id: string;
  member_id: string;
  date: string;
  time_slot: string;
  workout_type: WorkoutType;
  status: BookingStatus;
  member_note: string | null;
  internal_note: string | null;
  credit_deducted: number;
  created_by: "member" | "admin";
  created_at: string;
  member_name?: string;
  member_no?: string;
  member_phone?: string;
}

interface MeasurementRow {
  id: string;
  member_id: string;
  date: string;
  weight_kg: number | null;
  shoulder_cm: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  abdomen_cm: number | null;
  hip_cm: number | null;
  arm_right_cm: number | null;
  arm_left_cm: number | null;
  leg_right_cm: number | null;
  leg_left_cm: number | null;
  note: string | null;
}

interface OrderRow {
  id: string;
  order_number: string;
  member_id: string;
  package_id: string;
  package_name: string;
  session_count: number;
  base_price: number;
  discount_rate: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: OrderItem["paymentStatus"];
  receipt_code: string;
  merchant_oid: string | null;
  provider_total_amount: number | null;
  failure_reason: string | null;
  created_at: string;
  paid_at: string | null;
  member_name?: string;
}

interface GiftRow {
  id: string;
  member_id: string | null;
  title: string;
  description: string;
  status: MemberGift["status"];
  created_at: string;
}

const nowIso = () => new Date().toISOString();

const parseJson = <T>(raw: string, fallback: T): T => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const toUser = (row: MemberRow): MemberUser => {
  const profile = parseJson<Partial<MemberUser>>(row.profile_json, {});
  return {
    id: row.id,
    memberNo: row.member_no,
    role: row.role,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatar_url || DEFAULT_AVATAR,
    membershipTier: row.membership_tier,
    joinDate: row.join_date,
    birthDate: profile.birthDate,
    emergencyContact: profile.emergencyContact,
    healthNotes: profile.healthNotes,
    address: profile.address,
    savedCards: profile.savedCards ?? [],
    kvkkNoticeAt: row.kvkk_notice_at ?? undefined,
    healthConsentAt: row.health_consent_at ?? undefined,
  };
};

// KVKK m.6: sağlık verisi (sağlık notu, sakatlık uyarısı, vücut ölçüleri) yalnızca açık rızayla işlenir.
const HEALTH_CONSENT_REQUIRED = "Bu bilgi sağlık verisi sayılır. Üye açık rıza vermeden kaydedilemez.";
const assertHealthConsent = (row: MemberRow) => {
  if (!row.health_consent_at) throw new HttpError(409, HEALTH_CONSENT_REQUIRED);
};

// Müşteri tarafı internal_note alanını hiçbir zaman almaz.
const toBooking = (row: BookingRow, includeInternal: boolean): BookedSession => ({
  id: row.id,
  memberId: row.member_id,
  memberName: row.member_name,
  memberNo: row.member_no,
  memberPhone: row.member_phone,
  date: row.date,
  timeSlot: row.time_slot,
  workoutType: row.workout_type,
  status: row.status,
  memberNote: row.member_note ?? undefined,
  internalNote: includeInternal ? row.internal_note ?? undefined : undefined,
  createdBy: row.created_by,
  createdAt: row.created_at,
});

const optional = (value: number | null) => (value === null ? undefined : value);

const toMeasurement = (row: MeasurementRow): BodyMeasurementRecord => ({
  id: row.id,
  memberId: row.member_id,
  date: row.date,
  weightKg: optional(row.weight_kg),
  shoulderCm: optional(row.shoulder_cm),
  chestCm: optional(row.chest_cm),
  waistCm: optional(row.waist_cm),
  abdomenCm: optional(row.abdomen_cm),
  hipCm: optional(row.hip_cm),
  armRightCm: optional(row.arm_right_cm),
  armLeftCm: optional(row.arm_left_cm),
  legRightCm: optional(row.leg_right_cm),
  legLeftCm: optional(row.leg_left_cm),
  note: row.note ?? undefined,
});

const toOrder = (row: OrderRow): OrderItem => ({
  id: row.id,
  orderNumber: row.order_number,
  memberId: row.member_id,
  memberName: row.member_name,
  packageId: row.package_id,
  packageName: row.package_name,
  sessionCount: row.session_count,
  basePrice: row.base_price,
  discountRate: row.discount_rate,
  amount: row.amount,
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status,
  createdAt: row.created_at,
  receiptCode: row.receipt_code,
  paidAt: row.paid_at ?? undefined,
  merchantOid: row.merchant_oid ?? undefined,
  providerTotalAmount: row.provider_total_amount ?? undefined,
  failureReason: row.failure_reason ?? undefined,
});

const toGift = (row: GiftRow): MemberGift => ({
  id: row.id,
  memberId: row.member_id,
  title: row.title,
  description: row.description,
  status: row.status,
  createdAt: row.created_at,
});

const getMemberRow = (db: DatabaseSync, id: string): MemberRow => {
  const row = db.prepare("SELECT * FROM members WHERE id = ?").get(id) as MemberRow | undefined;
  if (!row) throw new HttpError(404, "Üye bulunamadı.");
  return row;
};

// ---------------------------------------------------------------------------
// Referans sistemi
// ---------------------------------------------------------------------------

const asciiUpper = (text: string) =>
  text
    .replace(/[çÇ]/g, "C")
    .replace(/[ğĞ]/g, "G")
    .replace(/[ıİ]/g, "I")
    .replace(/[öÖ]/g, "O")
    .replace(/[şŞ]/g, "S")
    .replace(/[üÜ]/g, "U")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

// Örnek: "Ege Mert" → CORE-EGE482. Kayıtta bir kez üretilir, sonradan değiştirilmez.
const generateReferralCode = (db: DatabaseSync, fullName: string) => {
  const base = asciiUpper(fullName.split(/\s+/)[0] || "UYE").slice(0, 6) || "UYE";
  for (let i = 0; i < 20; i++) {
    const code = `CORE-${base}${randomInt(100, 1000)}`;
    if (!db.prepare("SELECT 1 FROM members WHERE referral_code = ?").get(code)) return code;
  }
  throw new HttpError(500, "Referans kodu üretilemedi, lütfen tekrar deneyin.");
};

const generateMemberNo = (db: DatabaseSync) => {
  for (let i = 0; i < 20; i++) {
    const no = `CF-${randomInt(10000, 100000)}`;
    if (!db.prepare("SELECT 1 FROM members WHERE member_no = ?").get(no)) return no;
  }
  throw new HttpError(500, "Üye numarası üretilemedi, lütfen tekrar deneyin.");
};

const normalizeCode = (code: string) => code.trim().toUpperCase();

// Başarılı referans: bu kodla kayıt olmuş, hesabı aktif ve en az bir siparişinin ödemesi tamamlanmış üye.
// Ödeme şartı, sahte hesap açıp kendi koduyla kayıt olarak indirim açmayı engeller.
const referralStats = (db: DatabaseSync, memberId: string) => {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS uses,
         SUM(CASE WHEN m.status != 'Pasif' AND EXISTS (
           SELECT 1 FROM orders o WHERE o.member_id = m.id AND o.payment_status = 'completed'
         ) THEN 1 ELSE 0 END) AS successful
       FROM members m WHERE m.referred_by_id = ?`
    )
    .get(memberId) as { uses: number; successful: number | null };
  return { uses: row.uses, successful: row.successful ?? 0 };
};

// %10 indirim: referans koduyla kayıt olan yeni üye VEYA en az 1 başarılı referansı olan üye.
const buildReferral = (db: DatabaseSync, row: MemberRow): ReferralSummary => {
  const { uses, successful } = referralStats(db, row.id);
  const referredBy = row.referred_by_id
    ? (db.prepare("SELECT referral_code FROM members WHERE id = ?").get(row.referred_by_id) as
        | { referral_code: string | null }
        | undefined)
    : undefined;
  return {
    code: row.referral_code ?? "",
    disabled: row.referral_code_disabled === 1,
    uses,
    successful,
    discountActive: Boolean(row.referred_by_id) || successful >= 1,
    referredByCode: referredBy?.referral_code ?? undefined,
  };
};

export function checkReferralCode(code: string, email?: string) {
  if (code.length > 24) throw new HttpError(404, "Referans kodu bulunamadı.");
  const row = getDb()
    .prepare("SELECT id, email, referral_code_disabled FROM members WHERE referral_code = ? AND role = 'member'")
    .get(normalizeCode(code)) as { id: string; email: string; referral_code_disabled: number } | undefined;
  if (!row || row.referral_code_disabled === 1) {
    throw new HttpError(404, "Referans kodu bulunamadı.");
  }
  if (email && row.email.toLowerCase() === email.trim().toLowerCase()) {
    throw new HttpError(400, "Kendi referans kodunuzu kullanamazsınız.");
  }
  return { valid: true as const, discountRate: REFERRAL_DISCOUNT_RATE };
}

// ---------------------------------------------------------------------------
// Kimlik
// ---------------------------------------------------------------------------

const assertPasswordPolicy = (password: string, label = "Şifre") => {
  if (password.length < PASSWORD_MIN) throw new HttpError(400, `${label} en az ${PASSWORD_MIN} karakter olmalı.`);
  if (password.length > PASSWORD_MAX) throw new HttpError(400, `${label} en fazla ${PASSWORD_MAX} karakter olabilir.`);
};

const cleanEmail = (value: unknown) => {
  const email = text(value, "E-posta", 254).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new HttpError(400, "Geçerli bir e-posta adresi girin.");
  return email;
};

const cleanPhone = (value: unknown) => {
  const phone = text(value, "Telefon", 20);
  if (!PHONE_RE.test(phone)) throw new HttpError(400, "Geçerli bir telefon numarası girin.");
  return phone;
};

export async function registerMember(input: {
  fullName: unknown;
  email: unknown;
  phone: unknown;
  password: string;
  referralCode?: unknown;
  // Üye kendi kaydolurken aydınlatma metnini görmüş olmalı; admin stüdyoda kayıt açarken null kalır.
  kvkkNotice?: boolean;
  healthConsent?: boolean;
  requireNotice?: boolean;
}) {
  if (input.requireNotice !== false && input.kvkkNotice !== true) {
    throw new HttpError(400, "Devam etmek için KVKK Aydınlatma Metni'ni okuduğunuzu onaylayın.");
  }
  const fullName = text(input.fullName, "Ad soyad", 80);
  if (fullName.length < 3) throw new HttpError(400, "Lütfen adınızı ve soyadınızı girin.");
  const email = cleanEmail(input.email);
  const phone = cleanPhone(input.phone);
  assertPasswordPolicy(input.password);
  const referralCode = optionalText(input.referralCode, "Referans kodu", 24);
  // Parola özeti işlem dışında hesaplanır; yazma kilidi scrypt süresince tutulmaz.
  const passwordHash = await hashPassword(input.password);

  return transaction((db) => {
    if (db.prepare("SELECT 1 FROM members WHERE email = ?").get(email)) {
      throw new HttpError(409, "Bu e-posta adresiyle kayıtlı bir hesap zaten var.");
    }
    let referredById: string | null = null;
    if (referralCode) {
      checkReferralCode(referralCode, email);
      const owner = db
        .prepare("SELECT id FROM members WHERE referral_code = ?")
        .get(normalizeCode(referralCode)) as { id: string };
      referredById = owner.id;
    }
    const id = randomUUID();
    db.prepare(
      `INSERT INTO members (id, member_no, full_name, email, phone, password_hash, avatar_url, join_date,
         referral_code, referred_by_id, kvkk_notice_at, health_consent_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      generateMemberNo(db),
      fullName,
      email,
      phone,
      passwordHash,
      DEFAULT_AVATAR,
      todayIso(),
      generateReferralCode(db, fullName),
      referredById,
      input.kvkkNotice === true ? nowIso() : null,
      input.kvkkNotice === true && input.healthConsent === true ? nowIso() : null,
      nowIso()
    );
    return { id, referralApplied: referredById !== null };
  });
}

const LOGIN_FAILED = "E-posta veya şifre hatalı.";

export async function authenticate(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  if (!email || email.length > 254 || !password || password.length > PASSWORD_MAX) {
    await burnPasswordTime(password);
    throw new HttpError(401, LOGIN_FAILED);
  }
  const row = getDb()
    .prepare("SELECT id, role, password_hash, status FROM members WHERE email = ?")
    .get(email) as { id: string; role: MemberRole; password_hash: string; status: MemberStatus } | undefined;
  if (!row) {
    await burnPasswordTime(password);
    throw new HttpError(401, LOGIN_FAILED);
  }
  if (!(await verifyPassword(password, row.password_hash))) throw new HttpError(401, LOGIN_FAILED);
  if (row.status === "Pasif") throw new HttpError(403, "Hesabınız pasif durumda. Lütfen stüdyo ile iletişime geçin.");
  return { id: row.id, role: row.role };
}

// Başarılı değişiklikte üyenin tüm oturumları kapanır; çağıran yeni oturum açar.
export async function changePassword(memberId: string, currentPassword: string, nextPassword: string) {
  const row = getMemberRow(getDb(), memberId);
  if (!(await verifyPassword(currentPassword, row.password_hash))) throw new HttpError(400, "Mevcut şifre hatalı.");
  assertPasswordPolicy(nextPassword, "Yeni şifre");
  if (currentPassword === nextPassword) throw new HttpError(400, "Yeni şifre mevcut şifreden farklı olmalı.");
  const hash = await hashPassword(nextPassword);
  getDb().prepare("UPDATE members SET password_hash = ? WHERE id = ?").run(hash, memberId);
  revokeMemberSessions(memberId);
  return { role: row.role };
}

// ---------------------------------------------------------------------------
// Ayarlar ve müsaitlik
// ---------------------------------------------------------------------------

const readSetting = <T>(db: DatabaseSync, key: string, fallback: T): T => {
  const row = db.prepare("SELECT value_json FROM settings WHERE key = ?").get(key) as { value_json: string } | undefined;
  return row ? parseJson<T>(row.value_json, fallback) : fallback;
};

const writeSetting = (db: DatabaseSync, key: string, value: unknown) =>
  db
    .prepare("INSERT INTO settings (key, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json")
    .run(key, JSON.stringify(value));

const slotContext = (db: DatabaseSync): SlotContext => {
  const placeholders = ACTIVE_BOOKING_STATUSES.map(() => "?").join(", ");
  const occupied = db
    .prepare(`SELECT id, date, time_slot AS timeSlot FROM bookings WHERE status IN (${placeholders}) AND date >= ?`)
    .all(...ACTIVE_BOOKING_STATUSES, todayIso()) as { id: string; date: string; timeSlot: string }[];
  return {
    occupied,
    blocked: readSetting<Record<string, string[]>>(db, "blocked_slots", {}),
    coachSchedules: readSetting<CoachScheduleProfile[]>(db, "coach_schedules", []),
  };
};

export function getAvailability(): AvailabilityData {
  const ctx = slotContext(getDb());
  return {
    occupied: ctx.occupied.map(({ date, timeSlot }) => ({ date, timeSlot })),
    blocked: ctx.blocked,
    coachSchedules: ctx.coachSchedules,
  };
}

const TIME_SLOT_RE = /^([01]\d|2[0-3]):[0-5]\d( - ([01]\d|2[0-3]):[0-5]\d)?$/;
const MAX_BOOKING_DAYS_AHEAD = 90;

const assertSlotBookable = (db: DatabaseSync, date: string, timeSlot: string, ignoreBookingId?: string) => {
  if (!isIsoDate(date)) throw new HttpError(400, "Geçersiz tarih.");
  if (!TIME_SLOT_RE.test(timeSlot)) throw new HttpError(400, "Geçersiz saat.");
  if (date < todayIso()) throw new HttpError(400, SLOT_REASON_TEXT.past);
  const limit = new Date();
  limit.setDate(limit.getDate() + MAX_BOOKING_DAYS_AHEAD);
  if (date > limit.toISOString().slice(0, 10)) throw new HttpError(400, `En fazla ${MAX_BOOKING_DAYS_AHEAD} gün sonrasına randevu alınabilir.`);
  const status = slotStatus(slotContext(db), date, timeSlot, ignoreBookingId);
  if (!status.isAvailable) throw new HttpError(409, SLOT_REASON_TEXT[status.reason]);
};

// ---------------------------------------------------------------------------
// Müşteri paneli
// ---------------------------------------------------------------------------

const BOOKING_SELECT = `SELECT b.*, m.full_name AS member_name, m.member_no, m.phone AS member_phone
  FROM bookings b JOIN members m ON m.id = b.member_id`;

export function getMemberSnapshot(memberId: string): MemberSnapshot {
  const db = getDb();
  const row = getMemberRow(db, memberId);
  const bookings = (db.prepare(`${BOOKING_SELECT} WHERE b.member_id = ? ORDER BY b.date, b.time_slot`).all(memberId) as unknown as BookingRow[]).map(
    (b) => toBooking(b, false)
  );
  const measurements = (db.prepare("SELECT * FROM measurements WHERE member_id = ? ORDER BY date, created_at").all(memberId) as unknown as MeasurementRow[]).map(toMeasurement);
  const gifts = (db
    .prepare("SELECT * FROM gifts WHERE member_id = ? OR member_id IS NULL ORDER BY created_at DESC")
    .all(memberId) as unknown as GiftRow[]).map(toGift);
  const orders = (db.prepare("SELECT * FROM orders WHERE member_id = ? ORDER BY created_at DESC").all(memberId) as unknown as OrderRow[]).map(toOrder);
  const settings = readSetting<StudioSettings | null>(db, "studio_settings", null);

  return {
    user: toUser(row),
    remainingSessions: row.remaining_sessions,
    totalSessions: row.total_sessions,
    packageExpiry: row.package_expiry,
    bookings,
    measurements,
    program: parseJson<ProgramDay[]>(row.program_json, []),
    gifts,
    orders,
    referral: buildReferral(db, row),
    bankAccounts: settings?.bankAccounts ?? [],
    onlinePayment: onlinePaymentAvailable(db),
  };
}

type ProfilePatch = Partial<Pick<MemberUser, "fullName" | "phone" | "birthDate" | "emergencyContact" | "healthNotes" | "address" | "savedCards">>;

// Profil alanları tek tek doğrulanır; bilinmeyen alanlar yok sayılır. Kart için yalnızca son 4 hane saklanır.
const cleanProfilePatch = (raw: unknown): ProfilePatch => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new HttpError(400, "Geçersiz profil bilgisi.");
  const input = raw as Record<string, unknown>;
  const out: ProfilePatch = {};
  if (input.fullName !== undefined) {
    out.fullName = text(input.fullName, "Ad soyad", 80);
    if (out.fullName.length < 3) throw new HttpError(400, "Lütfen adınızı ve soyadınızı girin.");
  }
  if (input.phone !== undefined) out.phone = cleanPhone(input.phone);
  if (input.birthDate !== undefined) {
    const birth = text(input.birthDate, "Doğum tarihi", 10);
    if (birth && !isIsoDate(birth)) throw new HttpError(400, "Doğum tarihi geçersiz.");
    out.birthDate = birth || undefined;
  }
  if (input.emergencyContact !== undefined) out.emergencyContact = text(input.emergencyContact, "Acil durum kişisi", 120);
  if (input.healthNotes !== undefined) out.healthNotes = text(input.healthNotes, "Sağlık notu", 1000);
  if (input.address !== undefined) {
    const a = input.address as Record<string, unknown> | null;
    if (!a || typeof a !== "object" || Array.isArray(a)) throw new HttpError(400, "Adres geçersiz.");
    out.address = {
      title: text(a.title, "Adres başlığı", 40),
      street: text(a.street, "Adres", 200),
      district: text(a.district, "İlçe", 60),
      city: text(a.city, "Şehir", 60),
      postalCode: optionalText(a.postalCode, "Posta kodu", 10),
    };
  }
  if (input.savedCards !== undefined) {
    if (!Array.isArray(input.savedCards) || input.savedCards.length > 5) throw new HttpError(400, "Kart listesi geçersiz.");
    out.savedCards = input.savedCards.map((c) => {
      const card = (c ?? {}) as Record<string, unknown>;
      const last4 = text(card.last4, "Kart", 4);
      const expiry = text(card.expiry, "Son kullanma", 5);
      if (!/^\d{4}$/.test(last4) || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) throw new HttpError(400, "Kart bilgisi geçersiz.");
      return {
        id: text(card.id, "Kart", 40, { required: true }),
        last4,
        expiry,
        cardHolder: text(card.cardHolder, "Kart sahibi", 60),
        brand: card.brand === "mastercard" ? "mastercard" : "visa",
        isDefault: card.isDefault === true,
      };
    });
  }
  return out;
};

export function updateProfile(memberId: string, rawPatch: unknown) {
  const patch = cleanProfilePatch(rawPatch);
  transaction((db) => {
    const row = getMemberRow(db, memberId);
    if (patch.healthNotes) assertHealthConsent(row);
    const profile = parseJson<Record<string, unknown>>(row.profile_json, {});
    for (const key of ["birthDate", "emergencyContact", "healthNotes", "address", "savedCards"] as const) {
      if (key in patch) profile[key] = patch[key];
    }
    db.prepare("UPDATE members SET full_name = ?, phone = ?, profile_json = ? WHERE id = ?").run(
      patch.fullName || row.full_name,
      patch.phone ?? row.phone,
      JSON.stringify(profile),
      memberId
    );
  });
}

// Açık rıza verilir veya geri alınır. Geri alındığında sağlık verileri silinir (KVKK m.7).
export function setHealthConsent(memberId: string, give: unknown) {
  if (typeof give !== "boolean") throw new HttpError(400, "Geçersiz değer.");
  transaction((db) => {
    const row = getMemberRow(db, memberId);
    if (give) {
      if (!row.health_consent_at) db.prepare("UPDATE members SET health_consent_at = ? WHERE id = ?").run(nowIso(), memberId);
      return;
    }
    const profile = parseJson<Record<string, unknown>>(row.profile_json, {});
    delete profile.healthNotes;
    db.prepare("UPDATE members SET health_consent_at = NULL, injury_alert = NULL, profile_json = ? WHERE id = ?").run(JSON.stringify(profile), memberId);
    db.prepare("DELETE FROM measurements WHERE member_id = ?").run(memberId);
  });
}

// Aydınlatma metninin sonradan (ör. admin kaydı açtıktan sonra ilk girişte) okunduğunu kaydeder.
export function acknowledgeKvkkNotice(memberId: string) {
  getDb().prepare("UPDATE members SET kvkk_notice_at = COALESCE(kvkk_notice_at, ?) WHERE id = ?").run(nowIso(), memberId);
}

export function createMemberBooking(
  memberId: string,
  input: { date: unknown; timeSlot: unknown; workoutType: unknown; memberNote?: unknown }
) {
  const workoutType = String(input.workoutType ?? "");
  if (!isWorkoutType(workoutType)) throw new HttpError(400, "Antrenman tipi seçin.");
  const date = text(input.date, "Tarih", 10);
  const timeSlot = text(input.timeSlot, "Saat", 13);
  const memberNote = optionalText(input.memberNote, "Not", 500);
  return transaction((db) => {
    const row = getMemberRow(db, memberId);
    if (row.remaining_sessions <= 0) {
      throw new HttpError(409, "Ders hakkınız kalmadı. Yeni paket alarak randevu oluşturabilirsiniz.");
    }
    assertSlotBookable(db, date, timeSlot);
    // Üye yalnızca koç programında tanımlı ve açık saatleri seçebilir.
    const schedule = readSetting<CoachScheduleProfile[]>(db, "coach_schedules", [])[0];
    const day = schedule?.weeklySchedule.find((d) => d.dayKey === dayKeyFromDate(date));
    if (!day?.isWorkingDay || !day.slots.some((s) => s.isAvailable && s.time === timeSlot)) {
      throw new HttpError(409, "Bu saat randevuya açık değil.");
    }
    const id = randomUUID();
    // Yeni randevu her zaman onay bekler; ders hakkı rezerve edilir, iptalde iade edilir.
    db.prepare(
      `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, member_note, credit_deducted, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'PENDING', ?, 1, 'member', ?, ?)`
    ).run(id, memberId, date, timeSlot, workoutType, memberNote ?? null, nowIso(), nowIso());
    db.prepare("UPDATE members SET remaining_sessions = remaining_sessions - 1 WHERE id = ?").run(memberId);
    return id;
  });
}

const cancelBookingTx = (db: DatabaseSync, booking: BookingRow, refund: boolean, internalNote?: string) => {
  if (!ACTIVE_BOOKING_STATUSES.includes(booking.status)) {
    throw new HttpError(409, "Bu randevu artık iptal edilemez.");
  }
  db.prepare("UPDATE bookings SET status = 'CANCELLED', internal_note = COALESCE(?, internal_note), updated_at = ? WHERE id = ?").run(
    internalNote ?? null,
    nowIso(),
    booking.id
  );
  if (refund && booking.credit_deducted === 1) {
    db.prepare("UPDATE members SET remaining_sessions = remaining_sessions + 1 WHERE id = ?").run(booking.member_id);
  }
};

export function cancelMemberBooking(memberId: string, bookingId: string) {
  transaction((db) => {
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ? AND member_id = ?").get(bookingId, memberId) as
      | BookingRow
      | undefined;
    if (!booking) throw new HttpError(404, "Randevu bulunamadı.");
    cancelBookingTx(db, booking, true);
  });
}

const OFFLINE_METHODS: PaymentMethod[] = ["cash_register", "bank_transfer"];

// Fiyat istemciden alınmaz; paket kataloğu ve referans durumundan sunucuda hesaplanır.
const priceFor = (db: DatabaseSync, member: MemberRow, pkg: PackageItem, extraDiscountRate = 0) => {
  const referral = buildReferral(db, member);
  const rate = Math.max(discountRateFor(pkg, referral.discountActive), extraDiscountRate);
  return { rate, amount: Math.round(pkg.basePrice * (1 - rate)) };
};

const newOrderNumber = () => `CF-ORD-${new Date().getFullYear()}-${randomInt(100000, 1000000)}`;

// Paketin ders hakkını ve geçerlilik süresini üyeye işler.
const grantPackageTx = (db: DatabaseSync, memberId: string, packageId: string, packageName: string, sessionCount: number) => {
  const validityDays = findPackage(packageId)?.validityDays ?? 60;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + validityDays);
  db.prepare(
    `UPDATE members SET remaining_sessions = remaining_sessions + ?, total_sessions = total_sessions + ?,
       package_expiry = ?, membership_tier = ?, status = CASE WHEN status = 'Pasif' THEN status ELSE 'Aktif' END
     WHERE id = ?`
  ).run(sessionCount, sessionCount, expiry.toISOString().slice(0, 10), packageName, memberId);
};

const getOrderRow = (db: DatabaseSync, id: string) => db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as unknown as OrderRow;

// Nakit / havale siparişi: ders hakkı hemen tanımlanır, tahsilat admin onayına kadar bekler.
// Admin hızlı satışında tahsilat o an yapıldığı için sipariş doğrudan "completed" olur.
const createOfflineOrderTx = (
  db: DatabaseSync,
  memberId: string,
  packageId: string,
  paymentMethod: PaymentMethod,
  options: { extraDiscountRate?: number; collectedNow: boolean }
) => {
  const pkg = findPackage(packageId);
  if (!pkg) throw new HttpError(400, "Paket bulunamadı.");
  if (!OFFLINE_METHODS.includes(paymentMethod)) throw new HttpError(400, "Geçersiz ödeme yöntemi.");
  const member = getMemberRow(db, memberId);
  if (member.role !== "member") throw new HttpError(400, "Paket yalnızca üyelere satılabilir.");
  const { rate, amount } = priceFor(db, member, pkg, options.extraDiscountRate);
  const status: PaymentStatus = options.collectedNow ? "completed" : paymentMethod === "bank_transfer" ? "pending_transfer" : "pending_cashier";
  const orderNo = newOrderNumber();
  const id = randomUUID();
  const created = nowIso();
  db.prepare(
    `INSERT INTO orders (id, order_number, member_id, package_id, package_name, session_count, base_price, discount_rate,
       amount, payment_method, payment_status, receipt_code, created_at, paid_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, orderNo, memberId, pkg.id, pkg.name, pkg.sessionCount, pkg.basePrice, rate, amount, paymentMethod, status,
    `REC-${orderNo.slice(-6)}`, created, status === "completed" ? created : null, created);
  grantPackageTx(db, memberId, pkg.id, pkg.name, pkg.sessionCount);
  return toOrder(getOrderRow(db, id));
};

// Online kart ödemesi yalnızca PayTR akışıyla (startOnlinePayment) yapılır.
export function purchasePackage(memberId: string, packageId: unknown, paymentMethod: unknown) {
  if (paymentMethod === "online_card") {
    throw new HttpError(400, "Online kart ödemesi için ödeme ekranındaki kart seçeneğini kullanın.");
  }
  return transaction((db) =>
    createOfflineOrderTx(db, memberId, String(packageId ?? ""), paymentMethod as PaymentMethod, { collectedNow: false })
  );
}

// ---------------------------------------------------------------------------
// Online ödeme (PayTR)
// ---------------------------------------------------------------------------

const ONLINE_PAYMENT_SETTING = "online_payment_enabled";
const PAYMENT_WINDOW_MINUTES = 40;

const logPaymentEvent = (
  db: DatabaseSync,
  event: {
    merchantOid?: string;
    event: string;
    status?: string;
    totalAmount?: number | null;
    paymentAmount?: number | null;
    hashValid: boolean;
    reason?: string;
    testMode?: boolean | null;
    ip?: string;
  }
) =>
  db
    .prepare(
      `INSERT INTO payment_events (id, merchant_oid, event, status, total_amount, payment_amount, hash_valid, reason, test_mode, ip, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      randomUUID(),
      event.merchantOid?.slice(0, 64) ?? null,
      event.event,
      event.status?.slice(0, 20) ?? null,
      event.totalAmount ?? null,
      event.paymentAmount ?? null,
      event.hashValid ? 1 : 0,
      event.reason?.slice(0, 300) ?? null,
      event.testMode === undefined || event.testMode === null ? null : event.testMode ? 1 : 0,
      event.ip?.slice(0, 45) ?? null,
      nowIso()
    );

export function onlinePaymentAvailable(db: DatabaseSync = getDb()) {
  return paytrConfig() !== null && readSetting<boolean>(db, ONLINE_PAYMENT_SETTING, false) === true;
}

// Süresi dolan ödeme oturumları iptal sayılır (PayTR timeout_limit 30 dk; pay bırakılır).
const expireStalePayments = (db: DatabaseSync) => {
  const cutoff = new Date(Date.now() - PAYMENT_WINDOW_MINUTES * 60_000).toISOString();
  db.prepare(
    `UPDATE orders SET payment_status = 'cancelled', failure_reason = COALESCE(failure_reason, 'Ödeme süresi doldu'), updated_at = ?
     WHERE payment_status = 'awaiting_payment' AND created_at < ?`
  ).run(nowIso(), cutoff);
};

export async function startOnlinePayment(memberId: string, packageIdInput: unknown, userIp: string) {
  const config = paytrConfig();
  if (!config || !onlinePaymentAvailable()) throw new HttpError(503, "Online kart ödemesi şu an aktif değil.");
  const packageId = text(packageIdInput, "Paket", 40);

  const pending = transaction((db) => {
    expireStalePayments(db);
    const member = getMemberRow(db, memberId);
    if (member.role !== "member") throw new HttpError(400, "Paket yalnızca üyelere satılabilir.");
    const open = db
      .prepare("SELECT COUNT(*) AS c FROM orders WHERE member_id = ? AND payment_status = 'awaiting_payment'")
      .get(memberId) as { c: number };
    if (open.c >= 3) throw new HttpError(429, "Tamamlanmamış ödemeleriniz var. Lütfen birkaç dakika sonra tekrar deneyin.");
    const pkg = findPackage(packageId);
    if (!pkg) throw new HttpError(400, "Paket bulunamadı.");
    const { rate, amount } = priceFor(db, member, pkg);
    // PayTR sipariş numarası yalnızca harf ve rakam içerebilir; tahmin edilemez olması için rastgele üretilir.
    const merchantOid = `CF${Date.now().toString(36).toUpperCase()}${randomBytes(8).toString("hex").toUpperCase()}`;
    const orderNo = newOrderNumber();
    const id = randomUUID();
    const created = nowIso();
    db.prepare(
      `INSERT INTO orders (id, order_number, member_id, package_id, package_name, session_count, base_price, discount_rate,
         amount, payment_method, payment_status, receipt_code, merchant_oid, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'online_card', 'awaiting_payment', ?, ?, ?, ?)`
    ).run(id, orderNo, memberId, pkg.id, pkg.name, pkg.sessionCount, pkg.basePrice, rate, amount, `REC-${orderNo.slice(-6)}`, merchantOid, created, created);
    const profile = parseJson<{ address?: { street?: string; district?: string; city?: string } }>(member.profile_json, {});
    const address = [profile.address?.street, profile.address?.district, profile.address?.city].filter(Boolean).join(", ");
    return { id, merchantOid, amount, pkgName: pkg.name, member, address };
  });

  try {
    const token = await requestIframeToken(config, {
      merchantOid: pending.merchantOid,
      userIp,
      email: pending.member.email,
      amountTl: pending.amount,
      basketItemName: `Core & Fit ${pending.pkgName}`,
      userName: pending.member.full_name,
      userPhone: pending.member.phone,
      userAddress: pending.address,
    });
    return { merchantOid: pending.merchantOid, iframeUrl: PAYTR_IFRAME_BASE + token, amount: pending.amount };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Bilinmeyen hata";
    const db = getDb();
    db.prepare("UPDATE orders SET payment_status = 'failed', failure_reason = ?, updated_at = ? WHERE id = ? AND payment_status = 'awaiting_payment'").run(
      reason.slice(0, 300),
      nowIso(),
      pending.id
    );
    logPaymentEvent(db, { merchantOid: pending.merchantOid, event: "token_error", hashValid: false, reason, ip: userIp });
    console.error("[paytr] token", reason);
    throw new HttpError(502, "Ödeme sayfası açılamadı. Lütfen biraz sonra tekrar deneyin.");
  }
}

export function getMemberPaymentStatus(memberId: string, merchantOid: string) {
  if (!/^[A-Z0-9]{10,64}$/.test(merchantOid)) throw new HttpError(404, "Ödeme bulunamadı.");
  const row = getDb()
    .prepare("SELECT payment_status, failure_reason FROM orders WHERE merchant_oid = ? AND member_id = ?")
    .get(merchantOid, memberId) as { payment_status: PaymentStatus; failure_reason: string | null } | undefined;
  if (!row) throw new HttpError(404, "Ödeme bulunamadı.");
  return { status: row.payment_status, reason: row.payment_status === "failed" ? row.failure_reason ?? undefined : undefined };
}

// PayTR bildirimi. Yalnızca imzası doğrulanan bildirim sipariş durumunu değiştirir. Aynı sipariş için
// tekrar gelen bildirimler yalnızca "OK" ile kapatılır (PayTR 2. Adım uyarısı).
export function handlePaytrCallback(form: FormData, ip: string): { status: number; body: string } {
  const config = paytrConfig();
  const fields = readCallbackFields(form);
  const db = getDb();
  if (!config) {
    logPaymentEvent(db, { merchantOid: fields.merchantOid, event: "callback_unconfigured", hashValid: false, ip });
    return { status: 503, body: "PAYTR notification failed: not configured" };
  }
  const toInt = (v: string) => (/^\d{1,12}$/.test(v) ? Number(v) : null);
  const totalAmount = toInt(fields.totalAmount);
  const paymentAmount = toInt(fields.paymentAmount);
  const hashValid = verifyCallbackHash(config, fields);
  if (!hashValid) {
    logPaymentEvent(db, { merchantOid: fields.merchantOid, event: "callback_bad_hash", status: fields.status, totalAmount, paymentAmount, hashValid: false, ip });
    console.warn("[paytr] bad hash", fields.merchantOid, ip);
    return { status: 400, body: "PAYTR notification failed: bad hash" };
  }

  transaction((tx) => {
    const order = tx.prepare("SELECT * FROM orders WHERE merchant_oid = ?").get(fields.merchantOid) as OrderRow | undefined;
    const testMode = fields.testMode === "1";
    const base = { merchantOid: fields.merchantOid, status: fields.status, totalAmount, paymentAmount, hashValid: true, testMode, ip };
    if (!order) {
      logPaymentEvent(tx, { ...base, event: "callback_unknown_order" });
      return;
    }
    if (order.payment_status !== "awaiting_payment" && order.payment_status !== "cancelled") {
      logPaymentEvent(tx, { ...base, event: "callback_duplicate", reason: `Mevcut durum: ${order.payment_status}` });
      return;
    }
    const now = nowIso();
    if (fields.status !== "success") {
      const reason = `${fields.failedReasonCode} ${fields.failedReasonMsg}`.trim() || "Ödeme başarısız";
      tx.prepare("UPDATE orders SET payment_status = 'failed', failure_reason = ?, updated_at = ? WHERE id = ?").run(reason.slice(0, 300), now, order.id);
      logPaymentEvent(tx, { ...base, event: "callback_failed", reason });
      return;
    }
    // İmza geçerli olsa da tutar, para birimi ve mod siparişle birebir uyuşmalı; uyuşmazsa ders hakkı verilmez.
    const problems: string[] = [];
    if (paymentAmount !== order.amount * 100) problems.push(`tutar uyuşmuyor (${paymentAmount} ≠ ${order.amount * 100})`);
    if (totalAmount === null || totalAmount < order.amount * 100) problems.push("tahsil edilen tutar eksik");
    if (fields.currency && fields.currency !== "TL" && fields.currency !== "TRY") problems.push(`para birimi ${fields.currency}`);
    if (testMode && !config.testMode) problems.push("canlı mağazada test işlemi");
    if (problems.length > 0) {
      const reason = `İnceleme gerekli: ${problems.join(", ")}`;
      tx.prepare("UPDATE orders SET payment_status = 'review', provider_total_amount = ?, failure_reason = ?, updated_at = ? WHERE id = ?").run(
        totalAmount,
        reason,
        now,
        order.id
      );
      logPaymentEvent(tx, { ...base, event: "callback_review", reason });
      console.warn("[paytr] review", fields.merchantOid, reason);
      return;
    }
    tx.prepare("UPDATE orders SET payment_status = 'completed', provider_total_amount = ?, failure_reason = NULL, paid_at = ?, updated_at = ? WHERE id = ?").run(
      totalAmount,
      now,
      now,
      order.id
    );
    grantPackageTx(tx, order.member_id, order.package_id, order.package_name, order.session_count);
    logPaymentEvent(tx, { ...base, event: "callback_success" });
  });
  return { status: 200, body: "OK" };
}

export function adminPaymentOverview() {
  const db = getDb();
  expireStalePayments(db);
  const config = paytrConfig();
  const events = db
    .prepare("SELECT id, merchant_oid, event, status, total_amount, payment_amount, hash_valid, reason, test_mode, created_at FROM payment_events ORDER BY created_at DESC LIMIT 50")
    .all() as {
    id: string;
    merchant_oid: string | null;
    event: string;
    status: string | null;
    total_amount: number | null;
    payment_amount: number | null;
    hash_valid: number;
    reason: string | null;
    test_mode: number | null;
    created_at: string;
  }[];
  return {
    configured: config !== null,
    enabled: readSetting<boolean>(db, ONLINE_PAYMENT_SETTING, false) === true,
    testMode: config?.testMode ?? true,
    merchantIdMasked: config ? maskMerchantId(config.merchantId) : null,
    noInstallment: config?.noInstallment ?? true,
    callbackUrl: config ? `${config.baseUrl}/api/payments/paytr/callback` : null,
    okUrl: config ? `${config.baseUrl}/portal/odeme?durum=basarili` : null,
    failUrl: config ? `${config.baseUrl}/portal/odeme?durum=basarisiz` : null,
    events: events.map((e) => ({
      id: e.id,
      merchantOid: e.merchant_oid,
      event: e.event,
      status: e.status,
      totalAmount: e.total_amount,
      paymentAmount: e.payment_amount,
      hashValid: e.hash_valid === 1,
      reason: e.reason,
      testMode: e.test_mode === null ? null : e.test_mode === 1,
      createdAt: e.created_at,
    })),
  };
}

export function adminSetOnlinePayment(enabled: unknown) {
  if (typeof enabled !== "boolean") throw new HttpError(400, "Geçersiz değer.");
  if (enabled && !paytrConfig()) throw new HttpError(409, "PayTR mağaza bilgileri sunucuda tanımlı değil.");
  writeSetting(getDb(), ONLINE_PAYMENT_SETTING, enabled);
}

// ---------------------------------------------------------------------------
// Dijital giriş kartı (imzalı, kısa ömürlü QR)
// ---------------------------------------------------------------------------

const PASS_TTL_SECONDS = 90;
const PASS_PREFIX = "CFP1";

// İmza anahtarı ilk kullanımda rastgele üretilir ve yalnızca sunucudaki veritabanında durur.
const passSecret = (db: DatabaseSync) => {
  let secret = readSetting<string | null>(db, "pass_secret", null);
  if (!secret) {
    secret = randomBytes(32).toString("hex");
    db.prepare("INSERT OR IGNORE INTO settings (key, value_json) VALUES ('pass_secret', ?)").run(JSON.stringify(secret));
    secret = readSetting<string>(db, "pass_secret", secret);
  }
  return secret;
};

const signPass = (secret: string, payload: string) => createHmac("sha256", secret).update(payload).digest("base64url").slice(0, 32);

export function issueMemberPass(memberId: string) {
  const db = getDb();
  const member = getMemberRow(db, memberId);
  const expires = Math.floor(Date.now() / 1000) + PASS_TTL_SECONDS;
  const payload = `${PASS_PREFIX}.${member.member_no}.${expires}`;
  const signature = signPass(passSecret(db), payload);
  return { token: `${payload}.${signature}`, expiresAt: expires * 1000, code: signature.replace(/[^0-9]/g, "").padEnd(6, "0").slice(0, 6) };
}

const globalForPass = globalThis as unknown as { __cfUsedPasses?: Map<string, number> };
const usedPasses = (globalForPass.__cfUsedPasses ??= new Map<string, number>());

// İmza, süre ve tek kullanım kontrolü; geçerliyse üye numarasını döndürür.
const verifyMemberPass = (db: DatabaseSync, token: string): string => {
  const match = /^CFP1\.(CF-\d{5})\.(\d{10})\.([A-Za-z0-9_-]{32})$/.exec(token);
  if (!match) throw new HttpError(400, "QR kod tanınmadı.");
  const [, memberNo, expiresRaw, signature] = match;
  const expected = Buffer.from(signPass(passSecret(db), `${PASS_PREFIX}.${memberNo}.${expiresRaw}`));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) throw new HttpError(400, "QR kod geçersiz.");
  const expires = Number(expiresRaw) * 1000;
  const now = Date.now();
  if (expires < now) throw new HttpError(400, "QR kodun süresi dolmuş. Üyeden kartını yenilemesini isteyin.");
  if (expires > now + (PASS_TTL_SECONDS + 30) * 1000) throw new HttpError(400, "QR kod geçersiz.");
  for (const [key, exp] of usedPasses) if (exp < now) usedPasses.delete(key);
  if (usedPasses.has(signature)) throw new HttpError(409, "Bu QR kod zaten kullanıldı.");
  usedPasses.set(signature, expires);
  return memberNo;
};

type MeasurementInput = Omit<BodyMeasurementRecord, "id" | "memberId">;

const MEASUREMENT_FIELDS: [keyof MeasurementInput, string][] = [
  ["weightKg", "weight_kg"],
  ["shoulderCm", "shoulder_cm"],
  ["chestCm", "chest_cm"],
  ["waistCm", "waist_cm"],
  ["abdomenCm", "abdomen_cm"],
  ["hipCm", "hip_cm"],
  ["armRightCm", "arm_right_cm"],
  ["armLeftCm", "arm_left_cm"],
  ["legRightCm", "leg_right_cm"],
  ["legLeftCm", "leg_left_cm"],
];

export function addMeasurement(memberId: string, raw: Record<string, unknown>) {
  const input = raw as Partial<Record<keyof MeasurementInput, unknown>>;
  const dateText = typeof input.date === "string" ? input.date : "";
  const date = isIsoDate(dateText) && dateText <= todayIso() ? dateText : todayIso();
  const values = MEASUREMENT_FIELDS.map(([key]) => {
    const value = input[key];
    const num = typeof value === "number" ? value : value === undefined || value === "" || value === null ? NaN : Number(value);
    if (Number.isNaN(num)) return null;
    if (!Number.isFinite(num) || num <= 0 || num >= 500) throw new HttpError(400, "Ölçüm değerleri 0 ile 500 arasında olmalı.");
    return Math.round(num * 10) / 10;
  });
  const note = optionalText(input.note, "Not", 500);
  if (values.every((v) => v === null)) throw new HttpError(400, "En az bir ölçüm değeri girin.");
  const db = getDb();
  assertHealthConsent(getMemberRow(db, memberId));
  db.prepare(
    `INSERT INTO measurements (id, member_id, date, ${MEASUREMENT_FIELDS.map(([, col]) => col).join(", ")}, note, created_at)
     VALUES (?, ?, ?, ${MEASUREMENT_FIELDS.map(() => "?").join(", ")}, ?, ?)`
  ).run(randomUUID(), memberId, date, ...values, note ?? null, nowIso());
}

// ---------------------------------------------------------------------------
// Yönetici paneli
// ---------------------------------------------------------------------------

export function getAdminSnapshot(): AdminSnapshot {
  const db = getDb();
  const memberRows = db.prepare("SELECT * FROM members WHERE role = 'member' ORDER BY created_at DESC").all() as unknown as MemberRow[];

  const members: StudioMemberCRM[] = memberRows.map((row) => ({
    id: row.id,
    name: row.full_name,
    memberNo: row.member_no,
    email: row.email,
    phone: row.phone,
    tier: row.membership_tier,
    remaining: row.remaining_sessions,
    total: row.total_sessions,
    status: row.status,
    joinDate: row.join_date,
    injuryAlert: row.injury_alert ?? undefined,
    healthNotes: parseJson<{ healthNotes?: string }>(row.profile_json, {}).healthNotes,
    healthConsent: Boolean(row.health_consent_at),
    targetGoal: row.target_goal ?? undefined,
    program: parseJson<ProgramDay[]>(row.program_json, []),
    referral: buildReferral(db, row),
    referredMembers: memberRows
      .filter((r) => r.referred_by_id === row.id)
      .map((r) => ({ id: r.id, name: r.full_name, joinDate: r.join_date, status: r.status })),
  }));

  return {
    members,
    bookings: (db.prepare(`${BOOKING_SELECT} ORDER BY b.date, b.time_slot`).all() as unknown as BookingRow[]).map((b) => toBooking(b, true)),
    orders: (db
      .prepare("SELECT o.*, m.full_name AS member_name FROM orders o JOIN members m ON m.id = o.member_id ORDER BY o.created_at DESC")
      .all() as unknown as OrderRow[]).map(toOrder),
    measurements: (db.prepare("SELECT * FROM measurements ORDER BY date, created_at").all() as unknown as MeasurementRow[]).map(toMeasurement),
    gifts: (db.prepare("SELECT * FROM gifts ORDER BY created_at DESC").all() as unknown as GiftRow[]).map(toGift),
    studioSettings: readSetting<StudioSettings>(db, "studio_settings", {} as StudioSettings),
    coachSchedules: readSetting<CoachScheduleProfile[]>(db, "coach_schedules", []),
    blocked: readSetting<Record<string, string[]>>(db, "blocked_slots", {}),
  };
}

export function adminCreateBooking(input: {
  memberId: string;
  date: string;
  timeSlot: string;
  workoutType: string;
  internalNote?: unknown;
  deductCredit: boolean;
}) {
  if (!isWorkoutType(input.workoutType)) throw new HttpError(400, "Antrenman tipi seçin.");
  const internalNote = optionalText(input.internalNote, "İç not", 1000);
  return transaction((db) => {
    const member = getMemberRow(db, input.memberId);
    if (member.role !== "member") throw new HttpError(400, "Randevu yalnızca üyeler için oluşturulabilir.");
    assertSlotBookable(db, input.date, input.timeSlot);
    const deduct = input.deductCredit && member.remaining_sessions > 0;
    const id = randomUUID();
    // Yöneticinin oluşturduğu randevu doğrudan onaylıdır.
    db.prepare(
      `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, internal_note, credit_deducted, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, 'admin', ?, ?)`
    ).run(id, input.memberId, input.date, input.timeSlot, input.workoutType, internalNote ?? null, deduct ? 1 : 0, nowIso(), nowIso());
    if (deduct) db.prepare("UPDATE members SET remaining_sessions = remaining_sessions - 1 WHERE id = ?").run(input.memberId);
    return { id, creditDeducted: deduct };
  });
}

export type AdminBookingAction =
  | { action: "confirm" }
  | { action: "cancel"; refund: boolean; reason?: string }
  | { action: "complete"; internalNote?: string }
  | { action: "reschedule"; date: string; timeSlot: string };

const cleanBookingAction = (raw: Record<string, unknown>): AdminBookingAction => {
  switch (raw.action) {
    case "confirm":
      return { action: "confirm" };
    case "cancel":
      return { action: "cancel", refund: raw.refund === true, reason: optionalText(raw.reason, "İptal nedeni", 500) };
    case "complete":
      return { action: "complete", internalNote: optionalText(raw.internalNote, "İç not", 1000) };
    case "reschedule":
      return { action: "reschedule", date: text(raw.date, "Tarih", 10, { required: true }), timeSlot: text(raw.timeSlot, "Saat", 13, { required: true }) };
    default:
      throw new HttpError(400, "Geçersiz işlem.");
  }
};

export function adminUpdateBooking(bookingId: string, raw: Record<string, unknown>) {
  const payload = cleanBookingAction(raw);
  transaction((db) => {
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId) as BookingRow | undefined;
    if (!booking) throw new HttpError(404, "Randevu bulunamadı.");
    switch (payload.action) {
      case "confirm":
        if (booking.status !== "PENDING") throw new HttpError(409, "Yalnızca onay bekleyen randevular onaylanabilir.");
        db.prepare("UPDATE bookings SET status = 'CONFIRMED', updated_at = ? WHERE id = ?").run(nowIso(), bookingId);
        break;
      case "cancel":
        cancelBookingTx(db, booking, payload.refund, payload.reason?.trim() || undefined);
        break;
      case "complete":
        if (!ACTIVE_BOOKING_STATUSES.includes(booking.status)) throw new HttpError(409, "Bu randevu tamamlanamaz.");
        db.prepare("UPDATE bookings SET status = 'COMPLETED', internal_note = COALESCE(?, internal_note), updated_at = ? WHERE id = ?").run(
          payload.internalNote?.trim() || null,
          nowIso(),
          bookingId
        );
        break;
      case "reschedule":
        if (!ACTIVE_BOOKING_STATUSES.includes(booking.status)) throw new HttpError(409, "Bu randevu ertelenemez.");
        assertSlotBookable(db, payload.date, payload.timeSlot, bookingId);
        db.prepare("UPDATE bookings SET date = ?, time_slot = ?, status = 'CONFIRMED', updated_at = ? WHERE id = ?").run(
          payload.date,
          payload.timeSlot,
          nowIso(),
          bookingId
        );
        break;
      default:
        throw new HttpError(400, "Geçersiz işlem.");
    }
  });
}

// Turnike girişi: bugünkü onaylı randevu varsa tamamlanır, yoksa 1 ders düşülüp tamamlanmış kayıt açılır.
// QR ile girişte yalnızca sunucunun imzaladığı, süresi dolmamış ve daha önce kullanılmamış kart kabul edilir.
// Manuel girişte admin üyeyi listeden seçer (üye id'si).
export function adminCheckIn(input: { passToken?: unknown; memberId?: unknown }) {
  return transaction((db) => {
    let member: MemberRow | undefined;
    if (typeof input.passToken === "string" && input.passToken) {
      const memberNo = verifyMemberPass(db, input.passToken.trim().slice(0, 80));
      member = db.prepare("SELECT * FROM members WHERE member_no = ? AND role = 'member'").get(memberNo) as MemberRow | undefined;
    } else if (typeof input.memberId === "string" && input.memberId) {
      member = db.prepare("SELECT * FROM members WHERE id = ? AND role = 'member'").get(input.memberId.slice(0, 64)) as MemberRow | undefined;
    }
    if (!member) throw new HttpError(404, "Üye bulunamadı.");
    if (member.status === "Pasif") throw new HttpError(409, `${member.full_name} hesabı pasif durumda.`);
    const today = todayIso();
    const booking = db
      .prepare("SELECT * FROM bookings WHERE member_id = ? AND date = ? AND status = 'CONFIRMED' ORDER BY time_slot LIMIT 1")
      .get(member.id, today) as BookingRow | undefined;
    if (booking) {
      db.prepare("UPDATE bookings SET status = 'COMPLETED', updated_at = ? WHERE id = ?").run(nowIso(), booking.id);
      return { memberName: member.full_name, remaining: member.remaining_sessions, usedBooking: true };
    }
    if (member.remaining_sessions <= 0) throw new HttpError(409, `${member.full_name} için kalan ders hakkı yok.`);
    const program = parseJson<ProgramDay[]>(member.program_json, []);
    const todayType = program.find((p) => p.dayKey === dayKeyFromDate(today))?.type ?? "FULL";
    const hour = istanbulTime();
    db.prepare(
      `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, credit_deducted, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'COMPLETED', 1, 'admin', ?, ?)`
    ).run(randomUUID(), member.id, today, hour, todayType, nowIso(), nowIso());
    db.prepare("UPDATE members SET remaining_sessions = remaining_sessions - 1 WHERE id = ?").run(member.id);
    return { memberName: member.full_name, remaining: member.remaining_sessions - 1, usedBooking: false };
  });
}

export async function adminCreateMember(input: {
  fullName: unknown;
  email: unknown;
  phone: unknown;
  initialSessions: unknown;
  injuryAlert?: unknown;
  targetGoal?: unknown;
  // Hoca, üyenin sağlık verisi için açık rızasını stüdyoda aldığını beyan eder (sakatlık notu için gerekli).
  healthConsentGiven?: unknown;
}) {
  // Tahmin edilemez geçici şifre (12 karakter, ~72 bit)
  const tempPassword = randomBytes(9).toString("base64url");
  const sessions = integer(input.initialSessions ?? 0, "Başlangıç ders sayısı", 0, 200);
  const injuryAlert = optionalText(input.injuryAlert, "Sakatlık notu", 500);
  const targetGoal = optionalText(input.targetGoal, "Hedef", 200);
  const consentGiven = input.healthConsentGiven === true;
  if (injuryAlert && !consentGiven) {
    throw new HttpError(409, "Sakatlık bilgisi için üyenin açık rızasını aldığınızı işaretleyin.");
  }
  const { id } = await registerMember({
    requireNotice: false,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    password: tempPassword,
  });
  getDb()
    .prepare(
      "UPDATE members SET remaining_sessions = ?, total_sessions = ?, injury_alert = ?, target_goal = ?, health_consent_at = ? WHERE id = ?"
    )
    .run(sessions, sessions, injuryAlert ?? null, targetGoal ?? null, consentGiven ? nowIso() : null, id);
  const row = getMemberRow(getDb(), id);
  // Geçici şifre yalnızca bu yanıtta döner; admin üyeye iletir, üye profilinden değiştirir.
  return { id, memberNo: row.member_no, tempPassword };
}

export function adminUpdateMember(memberId: string, raw: Record<string, unknown>) {
  const patch = {
    sessionsDelta: raw.sessionsDelta === undefined ? undefined : integer(raw.sessionsDelta, "Ders değişimi", -200, 200),
    status: raw.status as MemberStatus | undefined,
    injuryAlert: raw.injuryAlert === undefined ? undefined : text(raw.injuryAlert, "Sakatlık notu", 500),
    targetGoal: raw.targetGoal === undefined ? undefined : text(raw.targetGoal, "Hedef", 200),
    healthNotes: raw.healthNotes === undefined ? undefined : text(raw.healthNotes, "Sağlık notu", 1000),
    program: raw.program === undefined ? undefined : cleanProgram(raw.program),
    referralCodeDisabled: typeof raw.referralCodeDisabled === "boolean" ? raw.referralCodeDisabled : undefined,
    // Hoca, açık rızayı stüdyoda aldığını beyan ederek sağlık alanlarını açar (zaman damgası kaydedilir).
    healthConsentGiven: raw.healthConsentGiven === true,
  };
  let revoke = false;
  transaction((db) => {
    const row = getMemberRow(db, memberId);
    if (row.role !== "member") throw new HttpError(400, "Yönetici hesabı bu ekrandan düzenlenemez.");
    if (patch.healthConsentGiven && !row.health_consent_at) {
      db.prepare("UPDATE members SET health_consent_at = ? WHERE id = ?").run(nowIso(), memberId);
      row.health_consent_at = nowIso();
    }
    if (patch.injuryAlert || patch.healthNotes) assertHealthConsent(row);
    if (patch.sessionsDelta) {
      const delta = patch.sessionsDelta;
      db.prepare(
        "UPDATE members SET remaining_sessions = MAX(0, remaining_sessions + ?), total_sessions = total_sessions + ? WHERE id = ?"
      ).run(delta, delta > 0 ? delta : 0, memberId);
    }
    if (patch.status !== undefined) {
      if (!["Aktif", "Yenileme Bekliyor", "Pasif"].includes(patch.status)) throw new HttpError(400, "Geçersiz durum.");
      db.prepare("UPDATE members SET status = ? WHERE id = ?").run(patch.status, memberId);
      revoke = patch.status === "Pasif";
    }
    if (patch.injuryAlert !== undefined || patch.targetGoal !== undefined) {
      db.prepare("UPDATE members SET injury_alert = ?, target_goal = ? WHERE id = ?").run(
        patch.injuryAlert ?? row.injury_alert,
        patch.targetGoal ?? row.target_goal,
        memberId
      );
    }
    if (patch.healthNotes !== undefined) {
      const profile = parseJson<Record<string, unknown>>(row.profile_json, {});
      profile.healthNotes = patch.healthNotes;
      db.prepare("UPDATE members SET profile_json = ? WHERE id = ?").run(JSON.stringify(profile), memberId);
    }
    if (patch.program) {
      db.prepare("UPDATE members SET program_json = ? WHERE id = ?").run(JSON.stringify(patch.program), memberId);
    }
    if (patch.referralCodeDisabled !== undefined) {
      db.prepare("UPDATE members SET referral_code_disabled = ? WHERE id = ?").run(patch.referralCodeDisabled ? 1 : 0, memberId);
    }
  });
  // Pasife alınan üyenin açık oturumları hemen kapanır.
  if (revoke) revokeMemberSessions(memberId);
}

// Program: en fazla 7 gün, her gün bir kez, yalnızca üç antrenman tipi.
const cleanProgram = (value: unknown): ProgramDay[] => {
  if (!Array.isArray(value) || value.length > 7) throw new HttpError(400, "Program geçersiz.");
  const seen = new Set<string>();
  return value.map((item) => {
    const day = (item ?? {}) as Record<string, unknown>;
    if (!DAY_KEYS.some((d) => d.key === day.dayKey) || !isWorkoutType(String(day.type)) || seen.has(String(day.dayKey))) {
      throw new HttpError(400, "Program geçersiz.");
    }
    seen.add(String(day.dayKey));
    return { dayKey: day.dayKey as ProgramDay["dayKey"], type: day.type as WorkoutType };
  });
};

// Kasada anında tahsil edilen satış (yalnızca nakit veya havale).
export function adminQuickSale(input: {
  memberId: string;
  packageId: string;
  paymentMethod: unknown;
  extraDiscountPercent?: unknown;
}) {
  const extra = integer(input.extraDiscountPercent ?? 0, "Ek indirim", 0, 50) / 100;
  return transaction((db) =>
    createOfflineOrderTx(db, input.memberId, input.packageId, input.paymentMethod as PaymentMethod, {
      extraDiscountRate: extra,
      collectedNow: true,
    })
  );
}

// Nakit / havale tahsilatını onaylar. PayTR'da inceleme bekleyen sipariş, admin parayı mağaza panelinde
// gördükten sonra onaylarsa ders hakkı o an tanımlanır. Başarısız, iptal veya süren online ödemeler onaylanamaz.
export function adminApproveOrder(orderId: string) {
  transaction((db) => {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as OrderRow | undefined;
    if (!order) throw new HttpError(404, "Sipariş bulunamadı.");
    const now = nowIso();
    if (order.payment_status === "pending_cashier" || order.payment_status === "pending_transfer") {
      db.prepare("UPDATE orders SET payment_status = 'completed', paid_at = ?, updated_at = ? WHERE id = ?").run(now, now, orderId);
      return;
    }
    if (order.payment_status === "review" && order.payment_method === "online_card") {
      db.prepare("UPDATE orders SET payment_status = 'completed', paid_at = ?, updated_at = ? WHERE id = ?").run(now, now, orderId);
      grantPackageTx(db, order.member_id, order.package_id, order.package_name, order.session_count);
      return;
    }
    throw new HttpError(409, "Bu sipariş onaylanamaz.");
  });
}

export function adminSaveSettings(input: {
  studioSettings?: StudioSettings;
  coachSchedules?: CoachScheduleProfile[];
  blocked?: Record<string, string[]>;
}) {
  transaction((db) => {
    if (input.studioSettings) writeSetting(db, "studio_settings", input.studioSettings);
    if (input.coachSchedules) writeSetting(db, "coach_schedules", input.coachSchedules);
    if (input.blocked) writeSetting(db, "blocked_slots", input.blocked);
  });
}

export function adminCreateGift(input: { memberId: string | null; title: unknown; description: unknown }) {
  const title = text(input.title, "Hediye başlığı", 120, { required: true });
  const description = text(input.description, "Açıklama", 500);
  const db = getDb();
  if (input.memberId) getMemberRow(db, input.memberId);
  db.prepare("INSERT INTO gifts (id, member_id, title, description, status, created_at) VALUES (?, ?, ?, ?, 'available', ?)").run(
    randomUUID(),
    input.memberId,
    title,
    description,
    nowIso()
  );
}

export function adminUpdateGift(giftId: string, status: MemberGift["status"]) {
  if (!["available", "used", "expired"].includes(status)) throw new HttpError(400, "Geçersiz durum.");
  const result = getDb().prepare("UPDATE gifts SET status = ? WHERE id = ?").run(status, giftId);
  if (result.changes === 0) throw new HttpError(404, "Hediye bulunamadı.");
}
