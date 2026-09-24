"use client";

import React from "react";
import { Eyebrow, Reveal } from "@/components/glass/GlassPrimitives";

const STATS = [
  { value: "1:1", label: "Birebir seans" },
  { value: "50", unit: "dk", label: "Bölünmeyen odak" },
  { value: "%100", label: "Kişisel takip" },
];

export const EditorialStatement: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          {/* Görsel: dikey video, çift çerçeve */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal>
              <div className="cg-shell cg-shell-lg lg:-rotate-[1.5deg] transition-transform duration-1000 hover:rotate-0">
                <div className="cg-core cg-core-media relative aspect-[4/5] group">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover cg-zoom"
                  >
                    <source src="/15079453_1080_1920_30fps.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 cg-on-media">
                    <div className="cg-glass-dark rounded-[1.25rem] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="cg-label cg-muted">Özel randevulu alan</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-[13px] leading-relaxed mt-2">
                        Aynı saat diliminde yalnızca tek bir üyenin ağırlandığı butik stüdyo deneyimi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Metin */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-8">
            <Reveal>
              <Eyebrow>Nişantaşı stüdyo anlayışı</Eyebrow>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] font-semibold">
                Gelişigüzel antrenman yok.{" "}
                <span className="cg-serif cg-ink-3">Her hareketin bir gerekçesi var.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 space-y-4 max-w-[36rem]">
                <p className="cg-ink-2 cg-pretty text-base sm:text-lg leading-relaxed">
                  Standart spor salonlarında makineler arasında vakit kaybetmek yerine; vücut anatominizi tanıyan, eklem sınırlarınızı bilen ve her hareketin amacını size aktaran bir sistemle çalışırsınız.
                </p>
                <p className="cg-ink-3 cg-pretty text-sm sm:text-base leading-relaxed">
                  Kurucu antrenör İlker Yüksel, antrenman planınızı genel internet şablonlarıyla değil; postür analiziniz, eklem mobiliteniz ve günlük yaşam temponuza göre kurgular.
                </p>
              </div>
            </Reveal>

            {/* Tek parça cam enstrüman şeridi */}
            <Reveal delay={0.3}>
              <div className="cg-shell mt-12">
                <div className="cg-core grid grid-cols-3">
                  {STATS.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`px-4 py-6 sm:px-7 sm:py-7 ${i > 0 ? "border-l cg-hairline" : ""}`}
                    >
                      <div className="flex items-end gap-1">
                        <span className={`cg-num text-3xl sm:text-5xl font-semibold tracking-tight ${i === 1 ? "cg-accent" : "cg-ink"}`}>
                          {stat.value}
                        </span>
                        {stat.unit && <span className="cg-ink-3 text-sm font-medium pb-1.5">{stat.unit}</span>}
                      </div>
                      <span className="cg-ink-3 text-[12px] sm:text-[13px] font-medium mt-2 block">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
