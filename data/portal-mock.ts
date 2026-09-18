import {
  MemberUser,
  BookedSession,
  CheckInLog,
  PortalPackage,
  OrderItem,
  StudioSettings,
  StudioBankAccount,
  CoachScheduleProfile,
} from "@/types/portal";

export const DEMO_USER: MemberUser = {
  id: "user-demo-1",
  memberNo: "CF-89210",
  fullName: "Ege Mert",
  email: "egemert@example.com",
  phone: "+90 532 555 0124",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  membershipTier: "VIP 1:1 Personal Training",
  joinDate: "12 Temmuz 2026",
  birthDate: "14 Mayıs 1994 (32 Yaş)",
  emergencyContact: "+90 532 111 2233 (Ayla Mert - Eşi)",
  healthNotes: "Sol diz menisküs eski operasyon, squat derinlik kontrollü",
  address: {
    title: "Ev Adresi",
    street: "Abdi İpekçi Cad. No: 42/8",
    district: "Nişantaşı, Şişli",
    city: "İstanbul",
    postalCode: "34367",
  },
  savedCards: [
    {
      id: "card-1",
      last4: "5432",
      cardHolder: "EGE MERT",
      expiry: "12/28",
      brand: "mastercard",
      isDefault: true,
    },
    {
      id: "card-2",
      last4: "8910",
      cardHolder: "EGE MERT",
      expiry: "09/27",
      brand: "visa",
      isDefault: false,
    },
  ],
};

export const INITIAL_BOOKED_SESSIONS: BookedSession[] = [
  {
    id: "sess-101",
    coachId: "coach-1",
    coachName: "İlker Yüksel",
    coachTitle: "Kurucu & Baş Antrenör (Founder & Head Coach)",
    coachAvatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
    date: "2026-09-19",
    timeSlot: "18:30",
    focusArea: "Kuvvet & Biyomekanik (Deadlift & Core)",
    station: "Özel İstasyon A (Kuvvet Alanı)",
    status: "confirmed",
    notes: "Ağır çekiş bloğu ve core stabilizasyonu çalışılacak.",
    createdAt: "2026-09-17 14:20",
  },
  {
    id: "sess-102",
    coachId: "coach-1",
    coachName: "İlker Yüksel",
    coachTitle: "Kurucu & Baş Antrenör (Founder & Head Coach)",
    coachAvatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
    date: "2026-09-22",
    timeSlot: "11:00",
    focusArea: "Mobilite & Metabolik Dayanıklılık",
    station: "Fonksiyonel Alan (Kettlebell Parkuru)",
    status: "confirmed",
    notes: "Omuz mobilitesi ve laktat eşiği kondisyon protokolü.",
    createdAt: "2026-09-17 15:45",
  },
];

export const INITIAL_CHECKIN_LOGS: CheckInLog[] = [
  {
    id: "log-1",
    date: "16 Eylül 2026",
    time: "18:25",
    coachName: "İlker Yüksel",
    sessionType: "1:1 Kuvvet & Postür",
    performanceNote: "Deadlift'te 140 kg ile yeni kişisel rekor (PR) kırıldı. Sırt açısı ve nötr omurga pozisyonu mükemmel korundu.",
    keyMetric: "140 kg PR • RPE 8.5",
  },
  {
    id: "log-2",
    date: "13 Eylül 2026",
    time: "19:00",
    coachName: "İlker Yüksel",
    sessionType: "Metabolik Kondisyon & HIIT",
    performanceNote: "VO2 max eşiğinde 24 dakikalık interval turu tamamlandı. Dinlenme nabzı toparlanması önceki haftaya göre %12 daha hızlı.",
    keyMetric: "680 kcal • Ort. Nabız 156 bpm",
  },
  {
    id: "log-3",
    date: "10 Eylül 2026",
    time: "18:30",
    coachName: "İlker Yüksel",
    sessionType: "Bacak & Stabilizasyon",
    performanceNote: "Ön bacak ve kalça aktivasyonu; sol diz unilateral lungelar kontrollü tamamlandı, eklemde hiçbir ağrı bildirilmedi.",
    keyMetric: "4 Set x 12 Tekrar Bulgarian Split",
  },
  {
    id: "log-4",
    date: "06 Eylül 2026",
    time: "11:15",
    coachName: "İlker Yüksel",
    sessionType: "Torasik Mobilite & Fonksiyonel Güç",
    performanceNote: "Masa başı çalışma kaynaklı üst sırt gerginliği giderildi. Göğüs kafesi rotasyon açısında 15 derece artış kaydedildi.",
    keyMetric: "FMS Mobilite Skoru 3/3",
  },
];

export const PORTAL_PACKAGES: PortalPackage[] = [
  {
    id: "pkg-12",
    name: "12 Ders Dönüşüm Paketi",
    subtitle: "En çok tercih edilen 1:1 özel koçluk programı",
    sessionCount: 12,
    validityDays: 60,
    price: 36000,
    formattedPrice: "₺36.000",
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "12 Seans Birebir (1:1) Özel Seans",
      "Kapsamlı Vücut Kompozisyonu ve Biyomekanik Analiz",
      "Öncelikli Seans ve Saat Seçim Hakkı",
      "Kişiselleştirilmiş Beslenme & Makro Rehberi",
      "Özel Soyunma Odası & Havlu / Su Servisi",
      "Mobil Uygulama Üzerinden Seans & Rapor Takibi",
    ],
  },
  {
    id: "pkg-24",
    name: "24 Ders Performans & Atletizm",
    subtitle: "Kalıcı yaşam tarzı ve radikal güç artışı",
    sessionCount: 24,
    validityDays: 90,
    price: 64000,
    formattedPrice: "₺64.000",
    badge: "MAKSİMUM AVANTAJ",
    features: [
      "24 Seans Birebir (1:1) Yoğun Koçluk",
      "Kurucu & Baş Antrenör İlker Yüksel ile Birebir",
      "Haftalık Dinamik Antrenman & Yük Güncellemesi",
      "Laktat Eşiği ve Kardiyovasküler VO2 Testi",
      "Esnek İptal / Değiştirme Hakkı (12 Saat)",
      "Misafir Antrenman Daveti (2 Adet)",
    ],
  },
  {
    id: "pkg-8",
    name: "8 Ders Ritim Paketi",
    subtitle: "Haftada 2 gün düzenli stüdyo ritmi",
    sessionCount: 8,
    validityDays: 45,
    price: 26000,
    formattedPrice: "₺26.000",
    features: [
      "8 Seans 1:1 Personal Training",
      "Postür ve Eklem Hareketlilik Taraması",
      "Hedefe Yönelik Kuvvet Gelişim Planı",
      "Stüdyo İçi Bireysel Koç İlgisi",
      "Her Seans Sonrası Performans Kaydı",
    ],
  },
  {
    id: "pkg-4",
    name: "4 Ders Başlangıç & Analiz",
    subtitle: "Sisteme giriş ve postüral değerlendirme",
    sessionCount: 4,
    validityDays: 30,
    price: 14500,
    formattedPrice: "₺14.500",
    features: [
      "4 Seans 1:1 Kişisel Antrenman",
      "Kapsamlı FMS (Functional Movement Screen)",
      "Doğru Egzersiz Formu & Biyomekanik Düzeltme",
      "Stüdyo Deneyim Seansı",
    ],
  },
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-8812",
    orderNumber: "CF-ORD-2026-8812",
    packageId: "pkg-12",
    packageName: "12 Ders Dönüşüm Paketi",
    sessionCount: 12,
    amount: 36000,
    formattedAmount: "₺36.000",
    paymentMethod: "online_card",
    paymentStatus: "completed",
    createdAt: "10 Ağustos 2026 14:15",
    receiptCode: "REC-8812-ONLINE",
    paidAt: "10 Ağustos 2026 14:16",
  },
];

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
  whatsapp: "+90 532 555 0124",
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
    coachTitle: "Kurucu & Baş Antrenör (Founder & Head Coach)",
    sessionDurationMin: 60,
    weeklySchedule: BASE_WEEKLY_DAYS.map((d) => ({
      dayKey: d.dayKey,
      dayName: d.dayName,
      isWorkingDay: d.dayKey !== "paz",
      slots: DEFAULT_DAY_SLOTS.map((s) => ({ ...s, id: `${d.dayKey}-${s.id}` })),
    })),
  },
];

