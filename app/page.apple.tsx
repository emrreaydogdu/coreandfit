"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { EditorialStatement } from "@/components/home/EditorialStatement";
import { PersonalTrainingSpotlight } from "@/components/home/PersonalTrainingSpotlight";
import { SystemSection } from "@/components/home/SystemSection";
import { GoalSelector } from "@/components/home/GoalSelector";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { TestimonialTeaser } from "@/components/home/TestimonialTeaser";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { Eyebrow, Reveal, Stagger, StaggerChild } from "@/components/glass/GlassPrimitives";
import { SERVICES_DATA } from "@/data/services";
import { COACHES_DATA } from "@/data/coaches";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowUpRight, MessageSquare } from "lucide-react";

export function HomePageApple() {
  const featuredServices = SERVICES_DATA.slice(0, 4);
  const headCoach = COACHES_DATA[0]; // İlker Yüksel (Founder & Head Coach)

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Editoryal marka ifadesi */}
      <EditorialStatement />

      {/* 3. 1:1 koçluk */}
      <PersonalTrainingSpotlight />

      {/* 4. Core & Fit sistemi */}
      <SystemSection />

      {/* 5. Hedef seçimi */}
      <GoalSelector />

      {/* 6. Karşılaştırma */}
      <ComparisonSection />

      {/* 7. Programlar */}
      <section className="relative py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Reveal>
                <Eyebrow>Özel programlar</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="cg-display cg-ink mt-7 text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] font-semibold max-w-3xl">
                  Hedefinize özel{" "}
                  <span className="cg-serif cg-accent">antrenmanlar.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <Link href="/antrenman" className="cg-link">
                Tüm 8 programı gör
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-16">
            {featuredServices.map((srv, idx) => (
              <StaggerChild key={srv.id} className={idx % 2 === 1 ? "lg:mt-12" : ""}>
                <Link href={`/antrenman/${srv.slug}`} className="block cg-shell cg-lift group h-full cg-focus">
                  <div className="cg-core h-full flex flex-col">
                    <div className="relative aspect-[4/5] m-1.5 rounded-[1.25rem] overflow-hidden bg-[#0B1411]">
                      <Image
                        src={srv.image}
                        alt={srv.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover cg-zoom"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 cg-on-media">
                        <span className="cg-glass-dark inline-block rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase">
                          {srv.badge}
                        </span>
                      </div>
                      <span className="absolute bottom-3 left-4 cg-on-media cg-num text-[11px] font-semibold tracking-widest">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="p-5 pt-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="cg-ink text-lg font-semibold tracking-tight">{srv.title}</h3>
                        <span className="cg-btn-icon w-8 h-8 bg-[var(--cg-accent-soft)] cg-accent transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </span>
                      </div>
                      <p className="cg-ink-3 text-[13px] leading-relaxed mt-2 line-clamp-2">{srv.summary}</p>
                      <p className="cg-label mt-auto pt-5">{srv.duration}</p>
                    </div>
                  </div>
                </Link>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 8. Kurucu & baş antrenör */}
      <section className="relative py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="cg-shell cg-shell-lg">
              <div className="cg-core grid grid-cols-1 lg:grid-cols-12">
                {/* Portre */}
                <div className="lg:col-span-5 p-2 sm:p-3">
                  <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[420px] rounded-[1.75rem] overflow-hidden bg-[#0B1411] group">
                    <Image
                      src={headCoach.image}
                      alt={headCoach.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover cg-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 cg-on-media">
                      <span className="cg-glass-dark inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide">
                        {headCoach.experience}
                      </span>
                      <p className="text-3xl font-semibold tracking-tight mt-3">{headCoach.name}</p>
                      <p className="cg-muted text-[13px] mt-1">{headCoach.title}</p>
                    </div>
                  </div>
                </div>

                {/* Biyografi */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col">
                  <Eyebrow className="self-start">Baş antrenör & kurucu</Eyebrow>
                  <blockquote className="cg-serif cg-ink text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] mt-8 cg-pretty">
                    &ldquo;{headCoach.quote}&rdquo;
                  </blockquote>
                  <p className="cg-ink-2 cg-pretty text-[15px] sm:text-base leading-relaxed mt-6 max-w-xl">
                    {headCoach.bio}
                  </p>

                  <p className="cg-label mt-10 mb-3.5">Akreditasyonlar & uzmanlık alanları</p>
                  <ul className="flex flex-wrap gap-2">
                    {["Marmara Ünv. BESYO", ...headCoach.certifications].map((cert) => (
                      <li key={cert} className="cg-glass rounded-full px-3.5 py-1.5 text-[12px] font-medium cg-ink-2 shadow-none">
                        {cert}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link href="/on-gorusme" className="cg-btn cg-btn-ink">
                      <span>İlker Yüksel ile 1:1 görüşme al</span>
                      <span className="cg-btn-icon">
                        <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                      </span>
                    </Link>
                    <Link href={`/koclar/${headCoach.slug}`} className="cg-btn cg-btn-ghost">
                      Özgeçmişi incele
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. Üye deneyimleri */}
      <TestimonialTeaser />

      {/* 10. SSS */}
      <FaqAccordion limit={6} />

      {/* 11. Kapanış: görsel üzerinde cam panel */}
      <section className="relative pt-12 pb-24 lg:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="cg-shell cg-shell-lg">
              <div className="cg-core cg-core-media relative min-h-[520px] flex items-end">
                <Image
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=2000&q=80"
                  alt="Stüdyoda kuvvet antrenmanı ekipmanları"
                  fill
                  sizes="100vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/50 to-emerald-900/30" />

                <div className="relative w-full p-6 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end cg-on-media">
                  <div className="lg:col-span-7">
                    <span className="cg-glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Nişantaşı · private sport studio
                    </span>
                    <h2 className="cg-display text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.02] font-semibold mt-7">
                      Standart program değil.{" "}
                      <span className="cg-serif cg-muted">Tamamen size göre antrenman.</span>
                    </h2>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="cg-glass-dark rounded-[1.75rem] p-6 sm:p-7">
                      <p className="cg-muted cg-pretty text-[15px] leading-relaxed">
                        Hedeflerinize ulaşmak için tek başınıza deneme-yanılma yapmak zorunda değilsiniz. Kurucu antrenör İlker Yüksel ile tanışarak ilk adımı atın.
                      </p>
                      <div className="mt-6 flex flex-col gap-2.5">
                        <Link href="/on-gorusme" className="cg-btn cg-btn-accent justify-between w-full">
                          <span>Ücretsiz ön görüşme al</span>
                          <span className="cg-btn-icon">
                            <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                          </span>
                        </Link>
                        <a
                          href={buildQuickChatWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cg-btn w-full px-6 border border-white/20 bg-white/10 hover:bg-white/15"
                        >
                          <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                          <span>WhatsApp&apos;tan yazın</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
