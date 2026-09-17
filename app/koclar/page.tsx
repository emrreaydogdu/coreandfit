import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { COACHES_DATA } from "@/data/coaches";
import { ArrowRight, Check, Award, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Eğitmen Kadromuz & Kişisel Antrenörler",
  description:
    "Nişantaşı Core & Fit Private Sport Studio uzman antrenör kadrosu: Mert Aksoy, Selin Yılmaz, Can Demir ve 1:1 koçluk yaklaşımları.",
};

export default function KoclarPage() {
  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
            [ UZMANLIK & BİYOMEKANİK ]
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
            Eğitmen Kadromuz
          </h1>
          <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
            Core & Fit koçları yalnızca egzersiz gösteren kişiler değil; hareket anatomisini, sinir sistemini ve antrenman periyotlamasını derinlemesine yöneten spor bilimcilerdir.
          </p>
        </div>
      </section>

      {/* Coaches List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {COACHES_DATA.map((coach) => (
            <div
              key={coach.id}
              className="bg-[#0D0F12] border border-[#23272F] flex flex-col justify-between overflow-hidden group hover:border-[#343A46] transition-colors"
            >
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-[#0D0F12] via-transparent to-transparent opacity-70 dark:opacity-90" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider bg-black/80 dark:bg-[#08090B]/80 px-2 py-0.5 border border-white/20 dark:border-[#23272F]">
                      {coach.experience}
                    </span>
                    <h2 className="text-2xl font-bold text-white uppercase font-display mt-2 drop-shadow-md">
                      {coach.name}
                    </h2>
                    <p className="text-xs text-[#A5A7AD] mt-0.5">{coach.title}</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-[#A5A7AD] leading-relaxed italic mb-6">
                    &ldquo;{coach.quote}&rdquo;
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-[10px] font-mono text-white uppercase tracking-wider block mb-2 font-semibold">
                        UZMANLIK ALANLARI:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#A5A7AD]">
                        {coach.specialties.map((sp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#E8FF36] shrink-0 mt-0.5" />
                            <span>{sp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-[#191B20]">
                      <span className="text-[10px] font-mono text-white uppercase tracking-wider block mb-2 font-semibold">
                        SERTİFİKALAR:
                      </span>
                      <ul className="space-y-1 text-[11px] font-mono text-[#72757C]">
                        {coach.certifications.slice(0, 2).map((cert, idx) => (
                          <li key={idx}>• {cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#191B20] mt-auto">
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link
                    href={`/koclar/${coach.slug}`}
                    className="text-center py-2.5 bg-[#131519] border border-[#23272F] text-xs font-semibold text-white uppercase tracking-wider hover:border-[#343A46] transition-colors"
                  >
                    Detaylı Profil
                  </Link>
                  <Link
                    href={`/on-gorusme?koc=${coach.slug}`}
                    className="text-center py-2.5 bg-[#E8FF36] text-[#08090B] text-xs font-bold uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
                  >
                    Bu Koçla Görüş
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
