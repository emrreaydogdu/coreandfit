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
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { SERVICES_DATA } from "@/data/services";
import { COACHES_DATA } from "@/data/coaches";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowUpRight, MessageSquare, Sparkles, Award, ShieldCheck } from "lucide-react";

export function HomePageApple() {
  const featuredServices = SERVICES_DATA.slice(0, 4);
  const headCoach = COACHES_DATA[0]; // İlker Yüksel (Founder & Head Coach)

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFD] dark:bg-[#000000]">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Editorial Brand Statement */}
      <EditorialStatement />

      {/* 3. 1:1 Personal Training Spotlight */}
      <PersonalTrainingSpotlight />

      {/* 4. Core & Fit System */}
      <SystemSection />

      {/* 5. Interactive Goal Selection */}
      <GoalSelector />

      {/* 6. Why Private Studio Comparison */}
      <ComparisonSection />

      {/* 7. Services Showcase - Apple Liquid Glass Product Cards */}
      <section className="py-20 lg:py-28 bg-[#FBFBFD] dark:bg-[#000000] relative overflow-hidden">
        {/* Environmental Glow */}
        <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-black/[0.06] dark:border-white/[0.08]">
            <ScrollReveal variant="fade-up">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ÖZEL PROGRAMLAR</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Hedefinize özel antrenmanlar
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.15}>
              <Link
                href="/antrenman"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>Tüm 8 Programı Gör</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {featuredServices.map((srv) => (
              <StaggerItem key={srv.id}>
                <Link
                  href={`/antrenman/${srv.slug}`}
                  className="group rounded-[32px] p-6 liquid-glass-card hover:-translate-y-1.5 transition-all duration-300 shadow-md flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full mb-6 rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.1] bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={srv.image}
                        alt={srv.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full liquid-glass-panel text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider shadow-sm">
                          {srv.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                      <span>{srv.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {srv.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">{srv.duration}</span>
                    <span className="text-slate-900 dark:text-white group-hover:text-emerald-600 font-semibold transition-colors">
                      İncele →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 8. Kurucu & Baş Antrenör İlker Yüksel - Apple Executive Spotlight */}
      <section className="py-20 lg:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0C] border-y border-black/[0.06] dark:border-white/[0.08] relative overflow-hidden">
        {/* Environmental Glow */}
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-black/[0.06] dark:border-white/[0.08]">
            <ScrollReveal variant="fade-up">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                  <Award className="w-3.5 h-3.5" />
                  <span>BAŞ ANTRENÖR & KURUCU</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  İlker Yüksel ile birebir çalışın
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.15}>
              <Link
                href="/koclar/ilker-yuksel"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>Detaylı Antrenör Özgeçmişi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Master Apple Spotlight Card in Liquid Glass Panel */}
          <ScrollReveal variant="fade-up" delay={0.2}>
            <div className="mt-12 rounded-[36px] liquid-glass-panel p-8 sm:p-12 lg:p-14 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Coach Portrait Frame */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[3/4] w-full rounded-[30px] overflow-hidden border border-black/[0.08] dark:border-white/[0.15] shadow-xl bg-slate-950 group">
                    <Image
                      src={headCoach.image}
                      alt={headCoach.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-[11px] font-semibold text-white tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {headCoach.experience}
                      </span>
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {headCoach.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">{headCoach.title}</p>
                    </div>
                  </div>
                </div>

                {/* Coach Bio & Methodology */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
                      <span>Marmara Ünv. BESYO Mezunu</span>
                      <span className="text-slate-400">•</span>
                      <span>Tek Yetkili Baş Antrenör</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                      &ldquo;{headCoach.quote}&rdquo;
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                      {headCoach.bio}
                    </p>

                    {/* Certifications Badges */}
                    <div className="pt-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                        AKREDİTASYONLAR & UZMANLIK ALANLARI
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {headCoach.certifications.map((cert, i) => (
                          <span
                            key={i}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium liquid-glass-pill text-slate-800 dark:text-slate-200"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Consultation Actions */}
                  <div className="pt-8 mt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      href="/on-gorusme"
                      className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 rounded-full liquid-glass-btn-primary font-semibold text-xs tracking-wide w-full sm:w-auto select-none"
                    >
                      <span>İlker Yüksel ile 1:1 Görüşme Al</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/koclar/${headCoach.slug}`}
                      className="inline-flex items-center justify-center min-h-[50px] px-7 rounded-full liquid-glass-pill text-slate-800 dark:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] font-medium text-xs transition-all w-full sm:w-auto select-none"
                    >
                      Özgeçmişi İncele
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. Google Rating & Testimonials */}
      <TestimonialTeaser />

      {/* 10. FAQ */}
      <FaqAccordion limit={6} />

      {/* 11. Final Conversion Action Banner in Liquid Glass Velvet Panel */}
      <section className="py-20 lg:py-24 bg-[#FBFBFD] dark:bg-[#000000] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="zoom-in" duration={0.7}>
            <div className="rounded-[36px] bg-gradient-to-br from-slate-900 via-[#101318] to-slate-950 border border-white/15 p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl text-white">
              {/* Internal Refraction Glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[130px] pointer-events-none" />

              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 mb-3 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NİŞANTAŞI • PRIVATE SPORT STUDIO</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
                  Standart program değil. <br />
                  <span className="text-slate-400">Tamamen size göre antrenman.</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                  Hedeflerinize ulaşmak için tek başınıza deneme-yanılma yapmak zorunda değilsiniz. Kurucu antrenör İlker Yüksel ile tanışarak ilk adımı atın.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto shrink-0 relative z-10">
                <Link
                  href="/on-gorusme"
                  className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 rounded-full bg-white text-black font-semibold text-xs tracking-wide hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg select-none"
                >
                  <span>Ücretsiz Ön Görüşme Al</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={buildQuickChatWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-7 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs tracking-wide transition-all backdrop-blur-xl select-none"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp&apos;tan Yazın</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
