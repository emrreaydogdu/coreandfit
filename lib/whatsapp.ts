import { BUSINESS_CONFIG } from "@/config/business";

export interface ConsultationFormData {
  name: string;
  goal: string;
  experience: string;
  frequency: string;
  time: string;
}

export interface PackageFormData {
  name: string;
  phone: string;
  packageName: string;
  goal: string;
  frequency?: string;
  time?: string;
  note?: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  bookingType: string;
  date: string;
  timeSlot: string;
}

/**
 * 17. WHATSAPP FORM AKIŞI
 * Standard prompt message template
 */
export function buildConsultationWhatsAppUrl(data: ConsultationFormData): string {
  const text = `Merhaba Core & Fit,

1:1 kişisel antrenman hakkında bilgi almak istiyorum.

Ad Soyad: ${data.name || "-"}
Hedefim: ${data.goal || "-"}
Antrenman Geçmişim: ${data.experience || "-"}
Haftalık Planım: ${data.frequency || "-"}
Tercih Ettiğim Saat: ${data.time || "-"}

Uygunluk ve paketler hakkında bilgi alabilir miyim?`;

  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Paket Teklif Formu WhatsApp Akışı
 */
export function buildPackageWhatsAppUrl(data: PackageFormData): string {
  const text = `Merhaba Core & Fit,

"${data.packageName}" paketi ve üyelik şartları hakkında bilgi/teklif almak istiyorum.

Ad Soyad: ${data.name || "-"}
Telefon: ${data.phone || "-"}
Hedefim: ${data.goal || "-"}
${data.frequency ? `Haftalık Hedefim: ${data.frequency}\n` : ""}${data.time ? `Tercih Ettiğim Saat: ${data.time}\n` : ""}${data.note ? `Ek Not: ${data.note}\n` : ""}
Detaylı bilgi ve uygunluk takvimini paylaşabilir misiniz?`;

  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Randevu Onay WhatsApp Akışı
 */
export function buildBookingWhatsAppUrl(data: BookingFormData): string {
  const text = `Merhaba Core & Fit,

Web siteniz üzerinden randevu talebi oluşturdum:

Görüşme Türü: ${data.bookingType}
Tarih: ${data.date}
Saat: ${data.timeSlot}
Ad Soyad: ${data.name}
Telefon: ${data.phone}

Randevu teyidini rica edebilir miyim?`;

  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Hızlı İletişim WhatsApp Butonu
 */
export function buildQuickChatWhatsAppUrl(customMessage?: string): string {
  const text =
    customMessage ||
    `Merhaba Core & Fit, Nişantaşı stüdyonuzdaki 1:1 Personal Training seansları ve müsaitlik hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
