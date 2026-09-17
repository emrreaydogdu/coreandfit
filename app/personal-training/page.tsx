import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { FAQ_DATA } from "@/data/faq";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { ArrowRight, Check, ShieldAlert, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "1:1 Personal Training Nişantaşı",
  description:
    "Nişantaşı Core & Fit'te hedefinize, biyomekaniğinize ve seviyenize özel 1:1 Personal Training. Kusursuz teknik takip ve ölçülebilir ilerleme.",
};

const PHASES = [
  {
    week: "1 - 4. Hafta",
    title: "Nöromüsküler Adaptasyon & Form Restorasyonu",
    desc: "Vücudun doğru hareket kalıplarını yeniden öğrenmesi, postüral asimetrilerin giderilmesi ve temel eklem mobilitesinin açılması sağlanır.",
  },
  {
    week: "5 - 8. Hafta",
    title: "Progresif Yükleme & Kuvvet Artışı",
    desc: "Kas dokusu mekanik gerilime uyum sağlar, kaldırılan kilolar düzenli artar, metabolik hız ve günlük enerji seviyesinde belirgin yükseliş görülür.",
  },
  {
    week: "9 - 12. Hafta",
    title: "Vücut Kompozisyonu Dönüşümü & Zirve Form",
    desc: "Yağ dokusunda kalıcı azalma, kas hatlarında netleşme, kondisyon zonlarında yükselme ve kalıcı atletik alışkanlığın oturması gerçekleşir.",
  },
];

export default function PersonalTrainingPage() {
  const ptFaqs = FAQ_DATA.filter((f) =>
    ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6"].includes(f.id)
  );

  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 border-b border-[#191B20] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=2000&q=80"
            alt="Core & Fit 1:1 Personal Training Nişantaşı"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70 dark:opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/90 via-[#F8F9FA]/65 to-transparent dark:from-[#08090B] dark:via-[#08090B]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA]/40 dark:from-[#08090B]/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <ScrollReveal variant="fade-up">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
                [ SATIŞ ODAKLI 1:1 SEANS PROTOKOLÜ ]
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase font-display leading-[1.05] mb-4">
                1:1 Personal Training
              </h1>
              <p className="text-xl sm:text-2xl text-[#E8FF36] font-display uppercase tracking-wide mb-6">
                Antrenman boyunca tek odağımız sensin.
              </p>
              <p className="text-sm sm:text-base text-[#A5A7AD] leading-relaxed mb-8 max-w-2xl">
                Hazır şablon programları unutun. Core & Fit&apos;te her antrenman biyomekaniğinize, eklem hareket derinliğinize, güncel toparlanma durumunuza ve hedeflerinize göre özel olarak kurgulanır.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/on-gorusme?hizmet=personal-training"
                  className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all"
                >
                  <span>Ücretsiz Ön Görüşme</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={buildQuickChatWhatsAppUrl(
                    "Merhaba, 1:1 Personal Training seansları ve müsaitlik durumu hakkında bilgi almak istiyorum."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 bg-[#131519] border border-[#23272F] text-white hover:border-[#25D366] font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp&apos;tan Sor</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Deep Dive Breakdown */}
      <section className="py-20 bg-[#0D0F12] border-b border-[#191B20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="p-8 bg-[#08090B] border border-[#23272F] h-full hover:border-[#343A46] transition-colors">
                <span className="text-2xl font-bold font-mono text-[#E8FF36] block mb-3">01</span>
                <h3 className="text-lg font-bold text-white uppercase font-display mb-3">
                  Kapsamlı İlk Değerlendirme
                </h3>
                <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                  Antrenmana başlamadan önce postür, omuz-kalça mobilitesi, core stabilitesi ve varsa geçmiş sakatlıklar analiz edilir. Hangi hareketlerin güvenli, hangilerinin modifiye edilmesi gerektiği belirlenir.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-8 bg-[#08090B] border border-[#23272F] h-full hover:border-[#343A46] transition-colors">
                <span className="text-2xl font-bold font-mono text-[#E8FF36] block mb-3">02</span>
                <h3 className="text-lg font-bold text-white uppercase font-display mb-3">
                  Doğru Teknik & Tempo Kontrolü
                </h3>
                <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                  Ağırlığı kaldırmak yetmez; kas lifinin gerilim altında kaldığı süre (Time Under Tension) ve eksantrik faz koçunuz tarafından saniye saniye yönetilir. Sıfır sakatlık, maksimum adaptasyon.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-8 bg-[#08090B] border border-[#23272F] h-full hover:border-[#343A46] transition-colors">
                <span className="text-2xl font-bold font-mono text-[#E8FF36] block mb-3">03</span>
                <h3 className="text-lg font-bold text-white uppercase font-display mb-3">
                  Periyodik Veri & İlerleme Takibi
                </h3>
                <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                  Her seans tamamlandığında setler, tekrarlar ve yükler kayıt altına alınır. Vücut alıştıkça periyotlama güncellenerek platoya girmeden sürekli gelişim sağlanır.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Who is it for? */}
      <section className="py-20 bg-[#08090B] border-b border-[#191B20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Suitable */}
            <ScrollReveal variant="fade-up" delay={0.1}>
              <div className="p-8 bg-[#0D0F12] border border-[#23272F] h-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#E8FF36]" />
                  <h3 className="text-xl font-bold text-white uppercase font-display">
                    1:1 Personal Training Kimler İçin İdeal?
                  </h3>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-[#A5A7AD]">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>Kalabalık spor salonlarında sıra beklemekten ve dikkat dağınıklığından sıkılanlar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>Daha önce tek başına çalışıp istediği yağ kaybı veya kas artışını yakalayamamış olanlar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>Bel, boyun ve omuz ağrısı çeken, masa başı çalışma düzeninden kaynaklı postür bozukluğu yaşayanlar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>Yoğun iş temposunda zamanını en verimli şekilde 50 dakikada yönetmek isteyen yöneticiler</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Not Suitable */}
            <ScrollReveal variant="fade-up" delay={0.2}>
              <div className="p-8 bg-[#0D0F12] border border-[#23272F] h-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <h3 className="text-xl font-bold text-white uppercase font-display">
                    Kimler İçin Uygun Değil?
                  </h3>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-[#72757C]">
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Teknik ve disipline önem vermeden sadece &ldquo;aşırı yorulmak&rdquo; isteyenler</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Randevu saatlerine ve ortak takvim sorumluluğuna uymakta zorlananlar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>1 gecede gerçek dışı mucizevi sonuçlar bekleyen, sabırsız yaklaşımlar</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Timeline of Results */}
      <section className="py-20 bg-[#0D0F12] border-b border-[#191B20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                [ ADAPTASYON & DÖNÜŞÜM ]
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display">
                Sonuç Beklentisi: 12 Haftalık Yol Haritası
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PHASES.map((p, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-[#08090B] border border-[#23272F] p-6 sm:p-8 h-full hover:border-[#343A46] transition-colors">
                  <span className="text-xs font-mono text-[#E8FF36] uppercase tracking-wider block mb-2 font-bold">
                    {p.week}
                  </span>
                  <h4 className="text-base font-bold text-white uppercase font-display mb-3">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[#A5A7AD] leading-relaxed">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dedicated FAQ */}
      <FaqAccordion items={ptFaqs} title="1:1 Kişisel Koçluk Hakkında Sorular" />

      {/* Action Footer */}
      <section className="py-16 bg-[#08090B] text-center">
        <ScrollReveal variant="fade-up">
          <div className="max-w-3xl mx-auto px-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-display mb-4">
              Birebir Antrenman Yolculuğunu Başlat
            </h3>
            <p className="text-sm text-[#A5A7AD] mb-8">
              Nişantaşı stüdyomuzda ücretsiz ön görüşme için takviminizi netleştirin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/on-gorusme?hizmet=personal-training"
                className="px-8 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all"
              >
                Ücretsiz Ön Görüşme Talep Et
              </Link>
              <Link
                href="/paketler"
                className="px-8 py-3.5 bg-[#131519] border border-[#23272F] text-white hover:border-[#343A46] text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Paketleri İncele
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
