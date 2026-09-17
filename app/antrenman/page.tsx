import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES_DATA } from "@/data/services";
import { ArrowRight, ArrowUpRight, Clock, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Antrenman Hizmetleri & Program Protokolleri",
  description:
    "Nişantaşı Core & Fit bünyesindeki 8 özel antrenman programı: Personal Training, Functional, Strength, Fat Loss, Hipertrofi, Kondisyon, Mobilite ve Performans.",
};

export default function AntrenmanIndexPage() {
  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Page Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
            [ EĞİTİM & PROGRAM PROTOKOLLERİ ]
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase font-display leading-[1.05] mb-4">
            Antrenman Hizmetleri
          </h1>
          <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
            Core & Fit&apos;te her seans rastgele hareketler bütünü değil; hedefinize, biyomekaniğinize ve seviyenize göre bilimsel olarak dizayn edilmiş özel bir antrenman protokolüdür.
          </p>
        </div>
      </section>

      {/* Services List - Editorial Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_DATA.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-[#0D0F12] border border-[#23272F] p-8 flex flex-col justify-between hover:border-[#E8FF36]/60 transition-all duration-200 group"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#191B20] mb-6">
                  <Image
                    src={srv.image}
                    alt={srv.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#08090B]/90 text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider border border-[#23272F]">
                      {srv.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold uppercase font-display group-hover:text-[#E8FF36] transition-colors">
                    {srv.title}
                  </h2>
                  <span className="text-xs font-mono text-[#72757C]">
                    [ 0{idx + 1} ]
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#E8FF36] font-display uppercase tracking-wide mb-3">
                  {srv.headline}
                </p>

                <p className="text-xs text-[#A5A7AD] leading-relaxed mb-6">
                  {srv.summary}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#191B20] text-xs">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#72757C] uppercase font-mono block text-[10px]">
                        ANA HEDEF
                      </span>
                      <span className="text-white font-medium">{srv.mainGoal}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#72757C] uppercase font-mono block text-[10px]">
                        SEANS SÜRESİ & SIKLIK
                      </span>
                      <span className="text-white font-medium">
                        {srv.duration} • {srv.frequencyRecommendation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#191B20] flex items-center justify-between gap-4">
                <Link
                  href={`/antrenman/${srv.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#E8FF36] transition-colors"
                >
                  <span>Programı İncele</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/on-gorusme?hizmet=${srv.slug}`}
                  className="px-4 py-2 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
                >
                  Ön Görüşme Al
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
