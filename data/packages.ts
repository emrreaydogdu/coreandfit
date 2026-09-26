// Tek paket kataloğu: genel paketler sayfası, müşteri paneli, admin kasası ve sunucu fiyat hesabı buradan okur.
// Fiyatlar yalnızca basePrice olarak tutulur; indirimli fiyat lib/pricing.ts içinde hesaplanır.

export type PackageKind = "individual" | "duet";

export interface PackageItem {
  id: string;
  slug: string;
  kind: PackageKind;
  name: string;
  subtitle: string;
  sessionCount: number;
  validityDays: number;
  basePrice: number;
  isPopular?: boolean;
  // Referans indirimi yalnızca ana üyelik paketlerinde uygulanır
  referralEligible: boolean;
  // "Esnek İptal / Değiştirme Hakkı (24 Saat)" yalnızca açıkça işaretli paketlerde gösterilir
  flexibleCancel: boolean;
  idealFor: string;
}

const COMMON_FEATURES = [
  "Kişiye özel antrenman planı",
  "Profesyonel antrenör desteği",
  "Gelişim ve vücut ölçüm takibi",
  "Online randevu planlama",
  "Premium stüdyo deneyimi",
];

export const FLEXIBLE_CANCEL_FEATURE = "Esnek İptal / Değiştirme Hakkı (24 Saat)";

export const INDIVIDUAL_PACKAGES: PackageItem[] = [
  {
    id: "pt-1",
    slug: "tek-ders",
    kind: "individual",
    name: "Tek Ders",
    subtitle: "Stüdyoyu ve çalışma sistemini tanıyın",
    sessionCount: 1,
    validityDays: 30,
    basePrice: 3000,
    referralEligible: false,
    flexibleCancel: false,
    idealFor: "Core & Fit deneyimini tek bir birebir dersle denemek isteyenler için.",
  },
  {
    id: "pt-10",
    slug: "10-ders",
    kind: "individual",
    name: "10 Ders",
    subtitle: "Düzenli antrenman ritmi",
    sessionCount: 10,
    validityDays: 60,
    basePrice: 15000,
    referralEligible: true,
    flexibleCancel: false,
    idealFor: "Haftada 2 gün düzenli gelerek ilk belirgin değişimi görmek isteyenler için.",
  },
  {
    id: "pt-20",
    slug: "20-ders",
    kind: "individual",
    name: "20 Ders",
    subtitle: "En çok tercih edilen dönüşüm periyodu",
    sessionCount: 20,
    validityDays: 90,
    basePrice: 28000,
    isPopular: true,
    referralEligible: true,
    flexibleCancel: true,
    idealFor: "Haftada 2-3 dersle vücut ölçülerinde kalıcı değişim hedefleyenler için.",
  },
  {
    id: "pt-30",
    slug: "30-ders",
    kind: "individual",
    name: "30 Ders",
    subtitle: "Uzun soluklu ve en avantajlı plan",
    sessionCount: 30,
    validityDays: 120,
    basePrice: 36000,
    referralEligible: true,
    flexibleCancel: true,
    idealFor: "Antrenmanı yaşam tarzına dönüştürmek isteyen, istikrarlı çalışanlar için.",
  },
];

export const DUET_DESCRIPTION =
  "Düet dersler; arkadaşınız, eşiniz, partneriniz veya birlikte antrenman yapmak istediğiniz herhangi bir kişiyle katılabileceğiniz 2 kişilik özel antrenman paketidir.";

export const DUET_PACKAGES: PackageItem[] = [
  {
    id: "duet-10",
    slug: "duet-10-ders",
    kind: "duet",
    name: "Düet 10 Ders",
    subtitle: "2 kişi için",
    sessionCount: 10,
    validityDays: 60,
    basePrice: 20000,
    referralEligible: false,
    flexibleCancel: false,
    idealFor: DUET_DESCRIPTION,
  },
  {
    id: "duet-20",
    slug: "duet-20-ders",
    kind: "duet",
    name: "Düet 20 Ders",
    subtitle: "2 kişi için",
    sessionCount: 20,
    validityDays: 90,
    basePrice: 38000,
    referralEligible: false,
    flexibleCancel: false,
    idealFor: DUET_DESCRIPTION,
  },
  {
    id: "duet-30",
    slug: "duet-30-ders",
    kind: "duet",
    name: "Düet 30 Ders",
    subtitle: "2 kişi için",
    sessionCount: 30,
    validityDays: 120,
    basePrice: 56000,
    referralEligible: false,
    flexibleCancel: false,
    idealFor: DUET_DESCRIPTION,
  },
];

export const ALL_PACKAGES: PackageItem[] = [...INDIVIDUAL_PACKAGES, ...DUET_PACKAGES];

export const findPackage = (id: string) => ALL_PACKAGES.find((p) => p.id === id);

export const packageFeatures = (pkg: PackageItem): string[] => [
  pkg.kind === "duet" ? `${pkg.sessionCount} ders, 2 kişi birlikte` : `${pkg.sessionCount} ders birebir (1:1)`,
  ...COMMON_FEATURES,
  ...(pkg.flexibleCancel ? [FLEXIBLE_CANCEL_FEATURE] : []),
];
