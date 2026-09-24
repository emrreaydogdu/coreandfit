"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, Reveal } from "@/components/glass/GlassPrimitives";

const EASE = [0.32, 0.72, 0, 1] as const;

const TRUST_POINTS = ["Aynı anda tek üye", "Biyomekanik & postür odaklı", "Teşvikiye, Nişantaşı"];

export const HeroSection: React.FC = () => {
  const reduce = useReducedMotion();

  const floatIn = (delay: number, x = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 40, x, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, x: 0, filter: "blur(0px)" },
          transition: { duration: 1.1, delay, ease: EASE },
        };

  return (
    <section className="relative min-h-[100dvh] flex items-center pt-36 sm:pt-40 lg:pt-44 pb-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Sol: editoryal başlık */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <Reveal delay={0.05}>
              <Eyebrow>Nişantaşı · 1:1 özel stüdyo</Eyebrow>
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className="cg-display cg-ink mt-7 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[5.25rem] font-semibold">
                Sadece sizin için ayrılmış bir stüdyo.{" "}
                <span className="cg-serif cg-accent block mt-1 text-[1.08em] leading-[0.95]">
                  Birebir antrenman.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="cg-ink-2 cg-pretty mt-8 text-base sm:text-lg leading-relaxed max-w-[34rem]">
                Nişantaşı&apos;nda randevu saatinizde stüdyonun kapısı yalnızca size açılır. Sıra bekleme yok, kalabalık yok; sadece doğru biyomekanik ve kurucu antrenör İlker Yüksel ile kesintisiz odak.
              </p>
            </Reveal>

            <Reveal delay={0.35} className="w-full sm:w-auto">
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/on-gorusme" className="cg-btn cg-btn-ink">
                  <span>Ön görüşme randevusu al</span>
                  <span className="cg-btn-icon">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                </Link>
                <Link href="/personal-training" className="cg-btn cg-btn-ghost">
                  Stüdyoyu ve metodolojiyi gör
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.45} className="w-full">
              <ul className="mt-14 pt-8 border-t cg-hairline flex flex-wrap gap-x-8 gap-y-3">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13px] font-medium cg-ink-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--cg-accent-soft)] cg-accent">
                      <Check className="w-3 h-3" strokeWidth={2} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Sağ: çift çerçeveli görsel + katmanlı cam enstrümanlar */}
          <div className="lg:col-span-6 relative lg:pl-6">
            <motion.div {...floatIn(0.2)} className="cg-shell cg-shell-lg">
              <div className="cg-core cg-core-media relative aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85"
                  alt="Core & Fit Nişantaşı özel antrenman stüdyosu"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Stüdyo rozeti: görsel üstünde */}
                <div className="absolute top-5 left-5 cg-on-media">
                  <span className="cg-glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Aynı saatte yalnızca tek üye
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 cg-on-media">
                  <p className="cg-label cg-muted">Kurucu & baş antrenör</p>
                  <p className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1.5">İlker Yüksel</p>
                </div>
              </div>
            </motion.div>

            {/* Kayan cam kart 1: seans */}
            <motion.div
              {...floatIn(0.55, 24)}
              className="relative mt-4 lg:mt-0 lg:absolute lg:-left-10 lg:top-[14%] lg:w-[17rem] cg-shell"
            >
              <div className="cg-core cg-core-strong p-5">
                <div className="flex items-center justify-between">
                  <span className="cg-label">Özel seans</span>
                  <span className="cg-num text-[11px] font-semibold cg-accent">1:1</span>
                </div>
                <p className="cg-ink text-lg font-semibold tracking-tight mt-3">Tek üye, tek antrenör</p>
                <p className="cg-ink-3 text-[13px] leading-relaxed mt-1.5">
                  Randevunuz boyunca stüdyo yalnızca sizin kullanımınızdadır.
                </p>
              </div>
            </motion.div>

            {/* Kayan cam kart 2: ölçülebilir ilerleme */}
            <motion.div
              {...floatIn(0.7, -24)}
              className="relative mt-4 lg:mt-0 lg:absolute lg:-right-6 lg:bottom-[18%] lg:w-[15.5rem] cg-shell"
            >
              <div className="cg-core cg-core-strong p-5">
                <span className="cg-label">Seans süresi</span>
                <div className="flex items-end gap-1.5 mt-2">
                  <span className="cg-num cg-ink text-4xl font-semibold tracking-tight">50</span>
                  <span className="cg-ink-3 text-sm font-medium pb-1">dk</span>
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-[var(--cg-hair)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[var(--cg-accent)] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.8, delay: 1, ease: EASE }}
                  />
                </div>
                <p className="cg-ink-3 text-[12px] mt-2.5">Bölünmeyen, kesintisiz odak</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
