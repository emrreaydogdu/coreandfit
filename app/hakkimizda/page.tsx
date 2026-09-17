import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda & Felsefemiz | Nişantaşı Core & Fit",
  description:
    "İyi antrenman tesadüf değildir. Core & Fit Private Sport Studio'nun Nişantaşı'ndaki butik koçluk vizyonu ve biyomekanik standartları.",
};

export default function HakkimizdaPage() {
  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Editorial Manifesto Hero */}
      <section className="py-20 lg:py-28 border-b border-[#191B20] bg-[#0D0F12] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
              [ MANİFESTO • NİŞANTAŞI ]
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase font-display leading-[1.02] mb-6">
              İyi antrenman <br />
              <span className="text-[#A5A7AD]">tesadüf değildir.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#A5A7AD] leading-relaxed max-w-2xl">
              Core & Fit; kalabalık, gürültülü ve standartlaştırılmış ticari spor salonu konseptine bir tepki olarak Nişantaşı&apos;nda kuruldu. Hedefimiz, spor yapan herkesin bedenine saygı duyan, bilimsel ve tamamen birebir bir performans ortamı yaratmaktır.
            </p>
          </div>
        </div>
      </section>

      {/* Large Photography Banner */}
      <section className="border-b border-[#191B20]">
        <div className="relative aspect-[21/9] w-full max-h-[550px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
            alt="Core & Fit Private Studio Nişantaşı Atmosferi"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] dark:from-[#08090B] via-transparent to-transparent" />
        </div>
      </section>

      {/* Editorial Content Blocks */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E8FF36]">
                YAKLAŞIMIN TEMELLERİ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase font-display text-white">
                Neden Farklıyız?
              </h2>
              <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                Her seans bir sözleşmedir; koçunuzun tüm dikkati, bilgisi ve enerjisi yalnızca sizin gelişiminiz için ayrılmıştır.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {/* 1. Private Studio Modeli */}
            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <span className="text-xs font-mono text-[#E8FF36] uppercase tracking-widest block mb-2 font-bold">
                01 • PRIVATE STUDIO MODELİ
              </span>
              <h3 className="text-xl font-bold text-white uppercase font-display mb-3">
                Kalabalıktan Arındırılmış Odaklanma Alanı
              </h3>
              <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                Klasik salonlarda antrenmanın yarısı boş makine beklemekle geçer. Core & Fit&apos;te stüdyo kapısından içeri girdiğiniz andan itibaren antrenman alanınız, serbest ağırlıklarınız ve koçunuz hazırdır. Sıra beklemezsiniz, dikkatiniz bölünmez.
              </p>
            </div>

            {/* 2. Biyomekanik Koçluk */}
            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <span className="text-xs font-mono text-[#E8FF36] uppercase tracking-widest block mb-2 font-bold">
                02 • BİYOMEKANİK KOÇLUK SİSTEMİ
              </span>
              <h3 className="text-xl font-bold text-white uppercase font-display mb-3">
                Körlemesine Ağırlık Değil, Doğru Açı
              </h3>
              <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                Eklemlerinizin kaldıramayacağı veya anatomik sınırlarınıza uymayan hiçbir egzersiz programınıza dahil edilmez. Her hareketin eklem eksenine uygunluğu koçunuz tarafından denetlenir; böylece 40 yıl sonra da ağrısız hareket edebilecek bir omurga ve eklem sağlığı korunur.
              </p>
            </div>

            {/* 3. Ölçülebilir Takip */}
            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <span className="text-xs font-mono text-[#E8FF36] uppercase tracking-widest block mb-2 font-bold">
                03 • DİSİPLİNLİ TAKİP & PERİYOTLAMA
              </span>
              <h3 className="text-xl font-bold text-white uppercase font-display mb-3">
                Verilerle Yönetilen Gelişim
              </h3>
              <p className="text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
                İlerlemeniz soyut hislere değil, rakamlara dayanır. Seans seans kaydedilen çalışma hacmi, nabız toparlanma hızı ve biyometrik ölçümler sayesinde bir sonraki adımınız her zaman öngörülebilir ve kontrol altındadır.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-[#191B20] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-white uppercase font-display">
              Nişantaşı Stüdyomuzda Bize Katılın
            </h4>
            <p className="text-xs text-[#A5A7AD] mt-1">
              Felsefemizi ve stüdyo ortamımızı yerinde deneyimlemek için ön görüşme oluşturun.
            </p>
          </div>
          <Link
            href="/on-gorusme"
            className="px-6 py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors shrink-0"
          >
            Ön Görüşme Talep Et
          </Link>
        </div>
      </section>
    </div>
  );
}
