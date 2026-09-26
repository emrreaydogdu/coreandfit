import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./password";
import {
  DEFAULT_STUDIO_SETTINGS,
  DEFAULT_COACH_SCHEDULES,
  DEFAULT_AVATAR,
  DEMO_MEMBERS,
  DEMO_BOOKINGS,
  DEMO_MEASUREMENTS,
  DEMO_GIFTS,
} from "@/data/portal-mock";

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), ".data", "coreandfit.sqlite");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  member_no TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  phone TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT '',
  membership_tier TEXT NOT NULL DEFAULT '1:1 Personal Training',
  join_date TEXT NOT NULL,
  remaining_sessions INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  package_expiry TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Yenileme Bekliyor', 'Pasif')),
  profile_json TEXT NOT NULL DEFAULT '{}',
  injury_alert TEXT,
  target_goal TEXT,
  program_json TEXT NOT NULL DEFAULT '[]',
  referral_code TEXT UNIQUE,
  referred_by_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  referral_code_disabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_members_referred_by ON members(referred_by_id);

CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('UPPER', 'LOWER', 'FULL')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  member_note TEXT,
  internal_note TEXT,
  credit_deducted INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL DEFAULT 'member' CHECK (created_by IN ('member', 'admin')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_member ON bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);

CREATE TABLE IF NOT EXISTS measurements (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  weight_kg REAL,
  shoulder_cm REAL,
  chest_cm REAL,
  waist_cm REAL,
  abdomen_cm REAL,
  hip_cm REAL,
  arm_right_cm REAL,
  arm_left_cm REAL,
  leg_right_cm REAL,
  leg_left_cm REAL,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_measurements_member ON measurements(member_id, date);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  session_count INTEGER NOT NULL,
  base_price INTEGER NOT NULL,
  discount_rate REAL NOT NULL DEFAULT 0,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('online_card', 'cash_register', 'bank_transfer')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('completed', 'pending_cashier', 'pending_transfer', 'cancelled')),
  receipt_code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  paid_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_member ON orders(member_id);

CREATE TABLE IF NOT EXISTS gifts (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL
);
`;

const nowIso = () => new Date().toISOString();

const isoDateOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

function seed(db: DatabaseSync) {
  const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value_json) VALUES (?, ?)");
  insertSetting.run("studio_settings", JSON.stringify(DEFAULT_STUDIO_SETTINGS));
  insertSetting.run("coach_schedules", JSON.stringify(DEFAULT_COACH_SCHEDULES));
  insertSetting.run("blocked_slots", "{}");

  // Yönetici hesabı: e-posta ve şifre ortam değişkenlerinden gelir, koda yazılmaz.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminExists = db.prepare("SELECT 1 FROM members WHERE role = 'admin' LIMIT 1").get();
  if (!adminExists && adminEmail && adminPassword) {
    db.prepare(
      `INSERT INTO members (id, member_no, role, full_name, email, password_hash, avatar_url, membership_tier, join_date, created_at)
       VALUES (?, 'CF-00001', 'admin', 'İlker Yüksel', ?, ?, ?, 'Yönetici', ?, ?)`
    ).run(randomUUID(), adminEmail, hashPassword(adminPassword), DEFAULT_AVATAR, nowIso().slice(0, 10), nowIso());
  }

  const demoPassword = process.env.DEMO_MEMBER_PASSWORD;
  const hasMembers = db.prepare("SELECT 1 FROM members WHERE role = 'member' LIMIT 1").get();
  if (process.env.SEED_DEMO !== "1" || !demoPassword || hasMembers) return;

  const ids = new Map<string, string>();
  const passwordHash = hashPassword(demoPassword);
  const insertMember = db.prepare(
    `INSERT INTO members (id, member_no, full_name, email, phone, password_hash, avatar_url, membership_tier, join_date,
       remaining_sessions, total_sessions, package_expiry, status, injury_alert, target_goal, program_json,
       referral_code, referred_by_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, '1:1 Personal Training', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const m of DEMO_MEMBERS) {
    const id = randomUUID();
    ids.set(m.key, id);
    insertMember.run(
      id,
      m.memberNo,
      m.fullName,
      m.email,
      m.phone,
      passwordHash,
      DEFAULT_AVATAR,
      m.joinDate,
      m.remaining,
      m.total,
      isoDateOffset(45),
      m.status,
      m.injuryAlert ?? null,
      m.targetGoal ?? null,
      JSON.stringify(m.program),
      m.referralCode,
      m.referredByKey ? ids.get(m.referredByKey) ?? null : null,
      nowIso()
    );
  }

  const insertBooking = db.prepare(
    `INSERT INTO bookings (id, member_id, date, time_slot, workout_type, status, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'member', ?, ?)`
  );
  for (const b of DEMO_BOOKINGS) {
    insertBooking.run(randomUUID(), ids.get(b.memberKey)!, isoDateOffset(b.offsetDays), b.timeSlot, b.workoutType, b.status, nowIso(), nowIso());
  }

  const insertMeasurement = db.prepare(
    `INSERT INTO measurements (id, member_id, date, weight_kg, shoulder_cm, chest_cm, waist_cm, abdomen_cm, hip_cm,
       arm_right_cm, arm_left_cm, leg_right_cm, leg_left_cm, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const m of DEMO_MEASUREMENTS) {
    insertMeasurement.run(
      randomUUID(), ids.get(m.memberKey)!, m.date, m.weightKg, m.shoulderCm, m.chestCm, m.waistCm, m.abdomenCm,
      m.hipCm, m.armRightCm, m.armLeftCm, m.legRightCm, m.legLeftCm, nowIso()
    );
  }

  const insertGift = db.prepare(
    "INSERT INTO gifts (id, member_id, title, description, status, created_at) VALUES (?, ?, ?, ?, 'available', ?)"
  );
  for (const g of DEMO_GIFTS) {
    insertGift.run(randomUUID(), g.memberKey ? ids.get(g.memberKey)! : null, g.title, g.description, nowIso());
  }
}

// Geliştirme ortamında modül yeniden yüklenince bağlantı çoğalmasın diye tek örnek globalde tutulur.
const globalForDb = globalThis as unknown as { __cfDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (!globalForDb.__cfDb) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
    db.exec(SCHEMA);
    seed(db);
    globalForDb.__cfDb = db;
  }
  return globalForDb.__cfDb;
}

// Birden fazla yazma işlemini tek atomik işlemde çalıştırır.
export function transaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn(db);
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
