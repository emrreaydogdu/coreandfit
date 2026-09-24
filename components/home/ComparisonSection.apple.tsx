"use client";

import React from "react";
import Link from "next/link";
import { X, Check, ArrowRight } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";

const COMPARISONS = [
  {
    category: "Programlama",
    gym: "Karton şablonlar, herkese verilen standart egzersiz listeleri.",
    coreAndFit: "Postürünüze, eklem sınırlarınıza ve hedefinize göre özel kurgulanan periyotlama.",
  },
  {
    category: "Ortam & alan",
    gym: "Aynı anda onlarca kişi, alet sırası bekleme, gürültü ve dikkat dağınıklığı.",
    coreAndFit: "Randevu saatinizde yalnızca siz ve kurucu antrenör. Sıfır sıra, tam mahremiyet.",
  },
  {
    category: "Teknik & güvenlik",
    gym: "Kendi başınızasınız. Hatalı form ve eklem zorlanmaları fark edilmez.",
    coreAndFit: "Her tekrarda açı, tempo ve postür düzeltmesi. Sakatlık riski sıfıra indirilir.",
  },
  {
    category: "Takip & veri",
    gym: "Hangi kiloyu ne zaman kaldırdığınız unutulur; gelişim tesadüfe kalır.",
    coreAndFit: "Seans bazlı ağırlık, nabız ve hacim kaydı. Dijital üye portalında net ilerleme.",
  },
  {
    category: "Süreklilik",
    gym: "Gitmeyi bıraktığınızda kimse aramaz; aidatınız boşa gider.",
    coreAndFit: "Randevulu ortak takvim. Kararlı, sürdürülebilir ve kesintisiz sorumluluk.",
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Stüdyo farkı</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] font-semibold">
                Klasik spor salonları ile{" "}
                <span className="cg-serif cg-ink-3">farkımız.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <p className="cg-ink-2 cg-pretty text-base sm:text-lg leading-relaxed max-w-md lg:ml-auto">
                Vaktiniz ve sağlığınız değerli. Büyük salonların verimsizliğini private studio yaklaşımıyla sonlandırıyoruz.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="cg-shell cg-shell-lg">
            <div className="cg-core p-2 sm:p-3">
              {/* Sütun başlıkları (masaüstü) */}
              <div className="hidden md:grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-3 px-3 pt-3 pb-2">
                <span className="cg-label px-3">Kriter</span>
                <span className="cg-label px-3">Klasik spor salonu</span>
                <span className="cg-label cg-accent px-3">Core & Fit private studio</span>
              </div>

              <div className="relative md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-3">
                {/* Core & Fit sütunu için sürekli cam şerit (masaüstü) */}
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-0 bottom-0 right-0 w-[calc((100%-1.5rem)*1.15/2.95)] rounded-[1.5rem] cg-core-tint border border-[var(--cg-edge)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
                />

                {COMPARISONS.map((row, i) => (
                  <div
                    key={row.category}
                    className={cn(
                      "md:contents max-md:rounded-[1.5rem] max-md:border max-md:border-[var(--cg-edge)] max-md:bg-[var(--cg-glass)] max-md:p-2",
                      i > 0 && "max-md:mt-2"
                    )}
                  >
                      <div className={cn("px-4 md:px-6 pt-5 pb-2 md:py-6 flex items-start", i > 0 && "md:border-t cg-hairline")}>
                        <span className="cg-ink text-[15px] font-semibold tracking-tight">{row.category}</span>
                      </div>
                      <div className={cn("px-4 md:px-6 py-3 md:py-6 flex items-start gap-3", i > 0 && "md:border-t cg-hairline")}>
                        <span className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-500">
                          <X className="w-3 h-3" strokeWidth={2} />
                        </span>
                        <span className="cg-ink-3 cg-pretty text-[14px] leading-relaxed">{row.gym}</span>
                      </div>
                      <div
                        className={cn(
                          "relative px-4 md:px-6 py-4 md:py-6 flex items-start gap-3 max-md:rounded-[1.1rem] max-md:bg-[var(--cg-accent-soft)]",
                          i > 0 && "md:border-t md:border-[var(--cg-hair)]"
                        )}
                      >
                        <span className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0 bg-[var(--cg-accent)] cg-on-media">
                          <Check className="w-3 h-3" strokeWidth={2.25} />
                        </span>
                        <span className="cg-ink cg-pretty text-[14px] leading-relaxed font-medium">{row.coreAndFit}</span>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-start lg:justify-end">
            <Link href="/on-gorusme" className="cg-link">
              Nişantaşı stüdyomuzu ziyaret ederek farkı kendiniz hissedin
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
