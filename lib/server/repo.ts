import { randomUUID, randomInt } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { getDb, transaction } from "./db";
import { HttpError } from "./auth";
import { hashPassword, verifyPassword } from "./password";
import { findPackage } from "@/data/packages";
import { discountRateFor, REFERRAL_DISCOUNT_RATE } from "@/lib/pricing";
import { slotStatus, SLOT_REASON_TEXT, todayIso, type SlotContext } from "@/lib/slots";
import {
  ACTIVE_BOOKING_STATUSES,
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
  MemberSnapshot,
  MemberStatus,
  MemberUser,
  OrderItem,
  PaymentMethod,
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
  };
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

// Başarılı referans: bu kodla kayıt olmuş ve hesabı pasife alınmamış üye.
const referralStats = (db: DatabaseSync, memberId: string) => {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS uses, SUM(CASE WHEN status != 'Pasif' THEN 1 ELSE 0 END) AS successful
       FROM members WHERE referred_by_id = ?`
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

export function registerMember(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  if (fullName.length < 3) throw new HttpError(400, "Lütfen adınızı ve soyadınızı girin.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Geçerli bir e-posta adresi girin.");
  if (input.password.length < 8) throw new HttpError(400, "Şifre en az 8 karakter olmalı.");

  return transaction((db) => {
    if (db.prepare("SELECT 1 FROM members WHERE email = ?").get(email)) {
      throw new HttpError(409, "Bu e-posta adresiyle kayıtlı bir hesap zaten var.");
    }
    let referredById: string | null = null;
    if (input.referralCode?.trim()) {
      checkReferralCode(input.referralCode, email);
      const owner = db
        .prepare("SELECT id FROM members WHERE referral_code = ?")
        .get(normalizeCode(input.referralCode)) as { id: string };
      referredById = owner.id;
    }
    const id = randomUUID();
    db.prepare(
      `INSERT INTO members (id, member_no, full_name, email, phone, password_hash, avatar_url, join_date,
         referral_code, referred_by_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      generateMemberNo(db),
      fullName,
      email,
      input.phone.trim(),
      hashPassword(input.password),
      DEFAULT_AVATAR,
      todayIso(),
      generateReferralCode(db, fullName),
      referredById,
      nowIso()
    );
    return { id, referralApplied: referredById !== null };
  });
}

export function authenticate(email: string, password: string) {
  const row = getDb()
    .prepare("SELECT id, role, password_hash, status FROM members WHERE email = ?")
    .get(email.trim().toLowerCase()) as
    | { id: string; role: string; password_hash: string; status: MemberStatus }
    | undefined;
  if (!row || !verifyPassword(password, row.password_hash)) {
    throw new HttpError(401, "E-posta veya şifre hatalı.");
  }
  if (row.status === "Pasif") throw new HttpError(403, "Hesabınız pasif durumda. Lütfen stüdyo ile iletişime geçin.");
  return { id: row.id, role: row.role };
}

export function changePassword(memberId: string, currentPassword: string, nextPassword: string) {
  const db = getDb();
  const row = getMemberRow(db, memberId);
  if (!verifyPassword(currentPassword, row.password_hash)) throw new HttpError(400, "Mevcut şifre hatalı.");
  if (nextPassword.length < 8) throw new HttpError(400, "Yeni şifre en az 8 karakter olmalı.");
  db.prepare("UPDATE members SET password_hash = ? WHERE id = ?").run(hashPassword(nextPassword), memberId);
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

const assertSlotBookable = (db: DatabaseSync, date: string, timeSlot: string, ignoreBookingId?: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new HttpError(400, "Geçersiz tarih.");
  if (date < todayIso()) throw new HttpError(400, SLOT_REASON_TEXT.past);
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
  };
}

type ProfilePatch = Partial<Pick<MemberUser, "fullName" | "phone" | "birthDate" | "emergencyContact" | "healthNotes" | "address" | "savedCards">>;

export function updateProfile(memberId: string, patch: ProfilePatch) {
  transaction((db) => {
    const row = getMemberRow(db, memberId);
    const profile = parseJson<Record<string, unknown>>(row.profile_json, {});
    for (const key of ["birthDate", "emergencyContact", "healthNotes", "address", "savedCards"] as const) {
      if (patch[key] !== undefined) profile[key] = patch[key];
    }
    db.prepare("UPDATE members SET full_name = ?, phone = ?, profile_json = ? WHERE id = ?").run(
      patch.fullName?.trim() || row.full_name,
      patch.phone?.trim() ?? row.phone,
      JSON.stringify(profile),
      memberId
    );
  });
}

export function createMemberBooking(
  memberId: string,
  input: { date: string; timeSlot: string; workoutType: string; memberNote?: string }
) {
  if (!isWorkoutType(input.workoutType)) throw new HttpError(400, "Antrenman tipi seçin.");
  return transaction((db) => {
    const row = getMemberRow(db, memberId);
    if (row.remaining_sessions <= 0) {
      throw new HttpError(409, "Ders hakkınız kalmadı. Yeni paket alarak randevu oluşturabilirsiniz.");
    }
    assertSlotBookable(db, input.date, input.timeSlot);
    const id = randomUUID();
    // Yeni randevu her zaman onay bekler; ders hakkı rezerve edilir, iptalde iade edilir.
    db.prepare(
      `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, member_note, credit_deducted, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'PENDING', ?, 1, 'member', ?, ?)`
    ).run(id, memberId, input.date, input.timeSlot, input.workoutType, input.memberNote?.trim() || null, nowIso(), nowIso());
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

const PAYMENT_METHODS: PaymentMethod[] = ["online_card", "cash_register", "bank_transfer"];

const createOrderTx = (
  db: DatabaseSync,
  memberId: string,
  packageId: string,
  paymentMethod: PaymentMethod,
  options: { extraDiscountRate?: number; paidImmediately: boolean }
) => {
  const pkg = findPackage(packageId);
  if (!pkg) throw new HttpError(400, "Paket bulunamadı.");
  if (!PAYMENT_METHODS.includes(paymentMethod)) throw new HttpError(400, "Geçersiz ödeme yöntemi.");

  const member = getMemberRow(db, memberId);
  const referral = buildReferral(db, member);
  // Fiyat istemciden alınmaz; paket kataloğu ve referans durumundan sunucuda hesaplanır.
  const rate = Math.max(discountRateFor(pkg, referral.discountActive), options.extraDiscountRate ?? 0);
  const amount = Math.round(pkg.basePrice * (1 - rate));
  const status: OrderItem["paymentStatus"] = options.paidImmediately
    ? "completed"
    : paymentMethod === "bank_transfer"
    ? "pending_transfer"
    : "pending_cashier";
  const orderNo = `CF-ORD-${new Date().getFullYear()}-${randomInt(100000, 1000000)}`;
  const id = randomUUID();
  const created = nowIso();

  db.prepare(
    `INSERT INTO orders (id, order_number, member_id, package_id, package_name, session_count, base_price, discount_rate,
       amount, payment_method, payment_status, receipt_code, created_at, paid_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    orderNo,
    memberId,
    pkg.id,
    pkg.name,
    pkg.sessionCount,
    pkg.basePrice,
    rate,
    amount,
    paymentMethod,
    status,
    `REC-${orderNo.slice(-6)}`,
    created,
    status === "completed" ? created : null
  );

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + pkg.validityDays);
  db.prepare(
    `UPDATE members SET remaining_sessions = remaining_sessions + ?, total_sessions = total_sessions + ?,
       package_expiry = ?, membership_tier = ?, status = CASE WHEN status = 'Pasif' THEN status ELSE 'Aktif' END
     WHERE id = ?`
  ).run(pkg.sessionCount, pkg.sessionCount, expiry.toISOString().slice(0, 10), pkg.name, memberId);

  return toOrder(db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as unknown as OrderRow);
};

// Online kart için ödeme sağlayıcısı entegre edilene kadar sipariş alınmaz; aksi halde tahsilat olmadan
// "ödendi" kaydı oluşurdu. Nakit ve havale siparişleri admin onayına kadar bekleyen ödeme olarak kalır.
const ONLINE_CARD_ENABLED = false;

export function purchasePackage(memberId: string, packageId: string, paymentMethod: PaymentMethod) {
  if (paymentMethod === "online_card" && !ONLINE_CARD_ENABLED) {
    throw new HttpError(400, "Online kart ödemesi henüz aktif değil. Stüdyoda nakit veya havale ile ödeyebilirsiniz.");
  }
  return transaction((db) => createOrderTx(db, memberId, packageId, paymentMethod, { paidImmediately: false }));
}

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

export function addMeasurement(memberId: string, input: MeasurementInput) {
  const date = input.date && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : todayIso();
  const values = MEASUREMENT_FIELDS.map(([key]) => {
    const raw = input[key];
    const num = typeof raw === "number" ? raw : raw === undefined || raw === "" ? NaN : Number(raw);
    return Number.isFinite(num) && num > 0 ? num : null;
  });
  if (values.every((v) => v === null)) throw new HttpError(400, "En az bir ölçüm değeri girin.");
  const db = getDb();
  getMemberRow(db, memberId);
  db.prepare(
    `INSERT INTO measurements (id, member_id, date, ${MEASUREMENT_FIELDS.map(([, col]) => col).join(", ")}, note, created_at)
     VALUES (?, ?, ?, ${MEASUREMENT_FIELDS.map(() => "?").join(", ")}, ?, ?)`
  ).run(randomUUID(), memberId, date, ...values, input.note?.trim() || null, nowIso());
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
  internalNote?: string;
  deductCredit: boolean;
}) {
  if (!isWorkoutType(input.workoutType)) throw new HttpError(400, "Antrenman tipi seçin.");
  return transaction((db) => {
    const member = getMemberRow(db, input.memberId);
    assertSlotBookable(db, input.date, input.timeSlot);
    const deduct = input.deductCredit && member.remaining_sessions > 0;
    const id = randomUUID();
    // Yöneticinin oluşturduğu randevu doğrudan onaylıdır.
    db.prepare(
      `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, internal_note, credit_deducted, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, 'admin', ?, ?)`
    ).run(id, input.memberId, input.date, input.timeSlot, input.workoutType, input.internalNote?.trim() || null, deduct ? 1 : 0, nowIso(), nowIso());
    if (deduct) db.prepare("UPDATE members SET remaining_sessions = remaining_sessions - 1 WHERE id = ?").run(input.memberId);
    return { id, creditDeducted: deduct };
  });
}

export type AdminBookingAction =
  | { action: "confirm" }
  | { action: "cancel"; refund: boolean; reason?: string }
  | { action: "complete"; internalNote?: string }
  | { action: "reschedule"; date: string; timeSlot: string };

export function adminUpdateBooking(bookingId: string, payload: AdminBookingAction) {
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
export function adminCheckIn(memberRef: string) {
  return transaction((db) => {
    const member = db
      .prepare("SELECT * FROM members WHERE (id = ? OR member_no = ?) AND role = 'member'")
      .get(memberRef, memberRef) as MemberRow | undefined;
    if (!member) throw new HttpError(404, "Üye bulunamadı.");
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
    const now = new Date();
    const hour = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    db.prepare(
      `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, credit_deducted, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'COMPLETED', 1, 'admin', ?, ?)`
    ).run(randomUUID(), member.id, today, hour, todayType, nowIso(), nowIso());
    db.prepare("UPDATE members SET remaining_sessions = remaining_sessions - 1 WHERE id = ?").run(member.id);
    return { memberName: member.full_name, remaining: member.remaining_sessions - 1, usedBooking: false };
  });
}

export function adminCreateMember(input: {
  fullName: string;
  email: string;
  phone: string;
  initialSessions: number;
  injuryAlert?: string;
  targetGoal?: string;
}) {
  const tempPassword = `CF-${randomInt(100000, 1000000)}`;
  const { id } = registerMember({
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    password: tempPassword,
  });
  const sessions = Math.max(0, Math.floor(input.initialSessions || 0));
  getDb()
    .prepare(
      "UPDATE members SET remaining_sessions = ?, total_sessions = ?, injury_alert = ?, target_goal = ? WHERE id = ?"
    )
    .run(sessions, sessions, input.injuryAlert?.trim() || null, input.targetGoal?.trim() || null, id);
  const row = getMemberRow(getDb(), id);
  // Geçici şifre yalnızca bu yanıtta döner; admin üyeye iletir, üye profilinden değiştirir.
  return { id, memberNo: row.member_no, tempPassword };
}

export function adminUpdateMember(
  memberId: string,
  patch: {
    sessionsDelta?: number;
    status?: MemberStatus;
    injuryAlert?: string;
    targetGoal?: string;
    healthNotes?: string;
    program?: ProgramDay[];
    referralCodeDisabled?: boolean;
  }
) {
  transaction((db) => {
    const row = getMemberRow(db, memberId);
    if (patch.sessionsDelta) {
      const delta = Math.trunc(patch.sessionsDelta);
      db.prepare(
        "UPDATE members SET remaining_sessions = MAX(0, remaining_sessions + ?), total_sessions = total_sessions + ? WHERE id = ?"
      ).run(delta, delta > 0 ? delta : 0, memberId);
    }
    if (patch.status && ["Aktif", "Yenileme Bekliyor", "Pasif"].includes(patch.status)) {
      db.prepare("UPDATE members SET status = ? WHERE id = ?").run(patch.status, memberId);
    }
    if (patch.injuryAlert !== undefined || patch.targetGoal !== undefined) {
      db.prepare("UPDATE members SET injury_alert = ?, target_goal = ? WHERE id = ?").run(
        patch.injuryAlert?.trim() ?? row.injury_alert,
        patch.targetGoal?.trim() ?? row.target_goal,
        memberId
      );
    }
    if (patch.healthNotes !== undefined) {
      const profile = parseJson<Record<string, unknown>>(row.profile_json, {});
      profile.healthNotes = patch.healthNotes.trim();
      db.prepare("UPDATE members SET profile_json = ? WHERE id = ?").run(JSON.stringify(profile), memberId);
    }
    if (patch.program) {
      const clean = patch.program.filter((p) => isWorkoutType(p.type));
      db.prepare("UPDATE members SET program_json = ? WHERE id = ?").run(JSON.stringify(clean), memberId);
    }
    if (patch.referralCodeDisabled !== undefined) {
      db.prepare("UPDATE members SET referral_code_disabled = ? WHERE id = ?").run(patch.referralCodeDisabled ? 1 : 0, memberId);
    }
  });
}

export function adminQuickSale(input: {
  memberId: string;
  packageId: string;
  paymentMethod: PaymentMethod;
  extraDiscountPercent?: number;
}) {
  const extra = Math.min(Math.max(input.extraDiscountPercent ?? 0, 0), 50) / 100;
  return transaction((db) =>
    createOrderTx(db, input.memberId, input.packageId, input.paymentMethod, {
      extraDiscountRate: extra,
      paidImmediately: true,
    })
  );
}

export function adminApproveOrder(orderId: string) {
  const result = getDb()
    .prepare("UPDATE orders SET payment_status = 'completed', paid_at = ? WHERE id = ? AND payment_status != 'completed'")
    .run(nowIso(), orderId);
  if (result.changes === 0) throw new HttpError(404, "Onay bekleyen sipariş bulunamadı.");
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

export function adminCreateGift(input: { memberId: string | null; title: string; description: string }) {
  if (!input.title.trim()) throw new HttpError(400, "Hediye başlığı gerekli.");
  const db = getDb();
  if (input.memberId) getMemberRow(db, input.memberId);
  db.prepare("INSERT INTO gifts (id, member_id, title, description, status, created_at) VALUES (?, ?, ?, ?, 'available', ?)").run(
    randomUUID(),
    input.memberId,
    input.title.trim(),
    input.description.trim(),
    nowIso()
  );
}

export function adminUpdateGift(giftId: string, status: MemberGift["status"]) {
  if (!["available", "used", "expired"].includes(status)) throw new HttpError(400, "Geçersiz durum.");
  const result = getDb().prepare("UPDATE gifts SET status = ? WHERE id = ?").run(status, giftId);
  if (result.changes === 0) throw new HttpError(404, "Hediye bulunamadı.");
}
