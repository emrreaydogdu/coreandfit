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
    slug: "ilker-yuksel",
    name: "İlker Yüksel",
    title: "Kurucu & Baş Antrenör (Founder & Head Coach)",
    experience: "10+ Yıl Deneyim",
    bio: "Marmara Üniversitesi Beden Eğitimi ve Spor Yüksekokulu mezunu. 10 yılı aşkın süredir Nişantaşı bölgesinde profesyonel yöneticiler, sporcular ve özel danışanlarla birebir (1:1) performans, biyomekanik ve kuvvet çalışmaları yürütüyor. Core & Fit Studio'nun kurucusu ve tek yetkili baş antrenörüdür.",
    approach:
      "Antrenman şansa bırakılamaz. Biyomekanik prensiplere dayalı, doğru eklem açısını koruyan ve her tekrarın bilinçli yapıldığı bir sistemi savunuyorum.",
    specialties: [
      "Biyomekanik & Doğru Egzersiz Tekniği",
      "Kuvvet Gelişimi (Strength Training)",
      "Vücut Kompozisyonu & Yağ Kaybı",
      "Postüral Düzeltme & Omurga Sağlığı",
      "Fonksiyonel Mobilite & Esneklik",
    ],
    certifications: [
      "NSCA - Certified Strength & Conditioning Specialist (CSCS)",
      "NASM - Corrective Exercise Specialist (CES)",
      "FMS Level 1 & 2 Certified",
      "EXOS Performance Specialist (XPS)",
    ],
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
    quote: "Her tekrarın bir amacı olmalı. Doğru teknik olmadan ağırlık artırmayız.",
    isDemoData: false,
  },
];
