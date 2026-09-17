export interface CoachItem {
  id: string;
  slug: string;
  name: string;
  title: string;
  experience: string;
  bio: string;
  approach: string;
  specialties: string[];
  certifications: string[];
  image: string;
  quote: string;
  isDemoData?: boolean;
}

export const COACHES_DATA: CoachItem[] = [
  {
    id: "coach-1",
    slug: "mert-aksoy",
    name: "Mert Aksoy",
    title: "Kurucu & Baş Antrenör (Head Coach)",
    experience: "10+ Yıl Deneyim",
    bio: "Marmara Üniversitesi Beden Eğitimi ve Spor Yüksekokulu mezunu. 10 yılı aşkın süredir Nişantaşı bölgesinde profesyonel yöneticiler, sporcular ve özel danışanlarla 1:1 performans ve kuvvet çalışmaları yürütüyor.",
    approach:
      "Antrenman şansa bırakılamaz. Biyomekanik prensiplere dayalı, doğru eklem açısını koruyan ve her tekrarın bilinçli yapıldığı bir sistemi savunuyorum.",
    specialties: [
      "Biyomekanik & Doğru Egzersiz Tekniği",
      "Kuvvet Gelişimi (Strength Training)",
      "Vücut Kompozisyonu & Yağ Kaybı",
      "Postüral Düzeltme & Omurga Sağlığı",
    ],
    certifications: [
      "NSCA - Certified Strength & Conditioning Specialist (CSCS)",
      "NASM - Corrective Exercise Specialist (CES)",
      "FMS Level 1 & 2 Certified",
    ],
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
    quote: "Her tekrarın bir amacı olmalı. Doğru teknik olmadan ağırlık artırmayız.",
    isDemoData: true,
  },
  {
    id: "coach-2",
    slug: "selin-yilmaz",
    name: "Selin Yılmaz",
    title: "Kıdemli Performans & Fonksiyonel Koç",
    experience: "7+ Yıl Deneyim",
    bio: "Spor bilimleri kökenli olan Selin, fonksiyonel hareket zincirleri, kadın atletik gelişimi ve mobilite alanlarında uzmanlaşmıştır. Core & Fit bünyesinde yüksek enerjili ve disiplinli seanslar yönetmektedir.",
    approach:
      "Kadınların ağırlık çalışmasından çekinmediği, kas tonusunun ve postürün güçlendiği, günlük hayata yansıyan fonksiyonel bir kuvvet felsefesini benimsiyorum.",
    specialties: [
      "Fonksiyonel Antrenman & Kondisyon",
      "Kadın Atletik Gelişimi & Sıkılaşma",
      "Mobilite & Eklem Açıklığı",
      "Metabolik Dayanıklılık (HIIT)",
    ],
    certifications: [
      "ACE - Certified Personal Trainer",
      "EXOS Performance Specialist (XPS)",
      "Kettlebell Athletics Level 1",
    ],
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80",
    quote: "Kuvvetli olmak yalnızca salonda değil, günün her anında duruşunuzu değiştirir.",
    isDemoData: true,
  },
  {
    id: "coach-3",
    slug: "can-demir",
    name: "Can Demir",
    title: "Kuvvet & Kondisyon Uzmanı",
    experience: "8+ Yıl Deneyim",
    bio: "Eski profesyonel atlet olan Can, laktat eşiği, patlayıcı güç ve hipertrofi (kas inşası) periyotlaması konularında geniş bir saha tecrübesine sahiptir.",
    approach:
      "Progresif aşırı yükleme ve ölçülebilir performans takibi olmadan gelişim tesadüfidir. Verilerle çalışır, sonucu kayıt altına alırız.",
    specialties: [
      "Hipertrofi & Kas Kütlesi Kazanımı",
      "Kuvvet Periyotlaması (Periodization)",
      "Kardiyovasküler Kondisyon & VO2 Max",
      "Sporcu Performans Hazırlığı",
    ],
    certifications: [
      "ISSA Master Trainer",
      "Poliquin Group - Performance Specialist",
      "TRX Suspension & Rip Trainer Certified",
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    quote: "Ölçemediğin hiçbir şeyi yönetemezsin. Gelişimini her hafta rakamlarla kanıtlarız.",
    isDemoData: true,
  },
];
