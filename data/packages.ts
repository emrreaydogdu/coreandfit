export interface PackageItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  sessionCount: string;
  validity: string;
  isPopular?: boolean;
  idealFor: string;
  features: string[];
  ctaText: string;
}

export const PACKAGES_DATA: PackageItem[] = [
  {
    id: "starter",
    slug: "baslangic",
    name: "Başlangıç Paketi",
    subtitle: "Sisteme giriş ve temel değerlendirme",
    sessionCount: "4 Seans / 1 Ay",
    validity: "30 Gün Geçerlilik",
    idealFor: "Core & Fit sistemini denemek ve postüral analizini yaptırmak isteyenler için.",
    features: [
      "1:1 Birebir Kişisel Koçluk",
      "Kapsamlı Postür & Biyomekanik Değerlendirme",
      "Kişiye Özel İlk Ay Antrenman Planı",
      "Temel Egzersiz Form Eğitimi",
      "Mobil Uygulama / WhatsApp İlerleme Takibi",
    ],
    ctaText: "Paket Teklifi Al",
  },
  {
    id: "session-8",
    slug: "8-ders",
    name: "8 Ders Paketi",
    subtitle: "Düzenli antrenman ritmi",
    sessionCount: "8 Seans / 1-2 Ay",
    validity: "45 Gün Geçerlilik",
    idealFor: "Haftada 2 gün düzenli gelerek ilk gözle görülür kuvvet ve kondisyon artışını hedefleyenler.",
    features: [
      "8 Seans Birebir (1:1) Personal Training",
      "Postür, Kuvvet & Hareketlilik Testi",
      "Haftalık Dinamik Program Güncellemesi",
      "Bireysel Beslenme & Makro Tavsiyesi",
      "Seans Bazlı Nabız ve Yük Takibi",
      "Koç ile Kesintisiz İletişim",
    ],
    ctaText: "Paket Teklifi Al",
  },
  {
    id: "session-12",
    slug: "12-ders",
    name: "12 Ders Paketi",
    subtitle: "En çok tercih edilen dönüşüm periyodu",
    sessionCount: "12 Seans / 1-2 Ay",
    validity: "60 Gün Geçerlilik",
    isPopular: true,
    idealFor: "Haftada 2-3 seans ile vücut kompozisyonunu değiştirmek, yağ yakıp kas inşa etmek isteyenler.",
    features: [
      "12 Seans Birebir (1:1) Özel Seans",
      "Detaylı Çevre ve Biyometrik Ölçümler",
      "Periodize Edilmiş Progresif Yükleme Planı",
      "Öncelikli Seans Saat Rezervasyonu",
      "Stüdyo İçi Özel Soyunma ve Duş Konforu",
      "Aylık Gelişim & Kuvvet Raporu",
    ],
    ctaText: "Paket Teklifi Al",
  },
  {
    id: "performance",
    slug: "performans",
    name: "Performans Paketi",
    subtitle: "24 Seanslık tam disiplin ve atletizm",
    sessionCount: "24 Seans / 2-3 Ay",
    validity: "90 Gün Geçerlilik",
    idealFor: "Kalıcı yaşam tarzı ve radikal performans artışı hedefleyen, istikrarlı sporcular.",
    features: [
      "24 Seans 1:1 Yoğun Koçluk",
      "Kapsamlı Fonksiyonel Hareket Taraması (FMS)",
      "Branşa ve Hedefe Özel İleri Seviye Periyotlama",
      "Kondisyon ve Laktat Eşiği Protokolü",
      "Tam Esnek Saat Yönetimi",
      "Özel İlerleme Portfolyosu",
    ],
    ctaText: "Paket Teklifi Al",
  },
  {
    id: "custom",
    slug: "ozel-program",
    name: "Özel Program",
    subtitle: "Hedefinize ve takviminize göre sıfırdan kurgulanan paket",
    sessionCount: "Esnek Seans Sayısı",
    validity: "Kişiye Özel Takvim",
    idealFor: "Sık seyahat eden yöneticiler, çift seans çalışanlar veya özel rehabilitasyon ihtiyacı olanlar.",
    features: [
      "Kişiselleştirilmiş Seans Sayısı ve Süresi",
      "Esnek Rezervasyon ve İptal Esnekliği",
      "Rehabilitasyon / Postür Odaklı Hibrit Plan",
      "Seyahatlerde Uygulanabilir Mobil Antrenman Listesi",
      "Birebir Baş Koç Danışmanlığı",
    ],
    ctaText: "Özel Teklif Al",
  },
];
