import type { BodyMeasurementRecord } from "@/types/portal";

export type BodyFieldKey = Exclude<keyof BodyMeasurementRecord, "id" | "memberId" | "date" | "note" | "weightKg">;

export const BODY_FIELDS: { key: BodyFieldKey; label: string }[] = [
  { key: "shoulderCm", label: "Omuz" },
  { key: "chestCm", label: "Göğüs" },
  { key: "waistCm", label: "Bel" },
  { key: "abdomenCm", label: "Karın" },
  { key: "hipCm", label: "Kalça" },
  { key: "armRightCm", label: "Sağ Kol" },
  { key: "armLeftCm", label: "Sol Kol" },
  { key: "legRightCm", label: "Sağ Bacak" },
  { key: "legLeftCm", label: "Sol Bacak" },
];

type NumericKey = BodyFieldKey | "weightKg";

const byDate = (records: BodyMeasurementRecord[]) => [...records].sort((a, b) => a.date.localeCompare(b.date));

// İlk ve son ölçüm arasındaki fark. Değer hiç girilmemişse null.
export function firstVsLatest(records: BodyMeasurementRecord[], key: NumericKey) {
  const withValue = byDate(records).filter((r) => typeof r[key] === "number");
  if (withValue.length === 0) return null;
  const first = withValue[0];
  const latest = withValue[withValue.length - 1];
  const firstValue = first[key] as number;
  const latestValue = latest[key] as number;
  return {
    first: firstValue,
    latest: latestValue,
    diff: Math.round((latestValue - firstValue) * 10) / 10,
    firstDate: first.date,
    latestDate: latest.date,
  };
}

export interface HistoryChange {
  label: string;
  unit: "kg" | "cm";
  from: number;
  to: number;
}

// Tarih bazlı geçmiş: her kayıtta bir önceki değere göre değişen alanlar.
export function measurementHistory(records: BodyMeasurementRecord[]) {
  const sorted = byDate(records);
  const fields: { key: NumericKey; label: string; unit: "kg" | "cm" }[] = [
    { key: "weightKg", label: "Vücut Ağırlığı", unit: "kg" },
    ...BODY_FIELDS.map((f) => ({ ...f, unit: "cm" as const })),
  ];
  const last: Partial<Record<NumericKey, number>> = {};
  const entries = sorted.map((record) => {
    const changes: HistoryChange[] = [];
    const initial: HistoryChange[] = [];
    for (const f of fields) {
      const value = record[f.key];
      if (typeof value !== "number") continue;
      const prev = last[f.key];
      if (prev === undefined) initial.push({ label: f.label, unit: f.unit, from: value, to: value });
      else if (prev !== value) changes.push({ label: f.label, unit: f.unit, from: prev, to: value });
      last[f.key] = value;
    }
    return { id: record.id, date: record.date, changes, initial, note: record.note };
  });
  return entries.reverse();
}

// -4.6 → "-4,6", 2 → "+2"
export const signed = (value: number) => `${value > 0 ? "+" : ""}${value.toLocaleString("tr-TR")}`;

export const formatNumber = (value: number) => value.toLocaleString("tr-TR");
