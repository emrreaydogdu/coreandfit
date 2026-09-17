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
import { BUSINESS_CONFIG } from "@/config/business";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowUpRight, MessageSquare } from "lucide-react";

export default function HomePage() {
  const featuredServices = SERVICES_DATA.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 8. Hero */}
      <HeroSection />

      {/* 9. Editorial Brand Statement */}
      <EditorialStatement />

      {/* 10. 1:1 Personal Training Spotlight */}
      <PersonalTrainingSpotlight />

      {/* 11. Core & Fit System */}
      <SystemSection />

      {/* 12. Interactive Goal Selection */}
      <GoalSelector />

      {/* 13. Why Private Studio Comparison */}
      <ComparisonSection />

      {/* Services Showcase */}
      <section className="py-20 lg:py-28 bg-[#08090B] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#191B20]">
            <ScrollReveal variant="fade-up">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                  [ PROGRAM PROTOKOLLERİ ]
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display">
                  Antrenman Hizmetleri
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.15}>
              <Link
                href="/antrenman"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A5A7AD] hover:text-[#E8FF36] transition-colors"
              >
                <span>Tüm 8 Programı İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {featuredServices.map((srv) => (
              <StaggerItem key={srv.id}>
                <Link
                  href={`/antrenman/${srv.slug}`}
                  className="group bg-[#0D0F12] border border-[#23272F] hover:border-[#E8FF36]/60 p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden h-full"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden border border-[#191B20]">
                      <Image
                        src={srv.image}
                        alt={srv.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 bg-[#08090B]/90 text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider border border-[#23272F]">
                          {srv.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white uppercase font-display group-hover:text-[#E8FF36] transition-colors flex items-center justify-between">
                      <span>{srv.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#72757C] group-hover:text-[#E8FF36] transition-colors" />
                    </h3>

                    <p className="text-xs text-[#A5A7AD] mt-2 line-clamp-2 leading-relaxed">
                      {srv.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#191B20] flex items-center justify-between text-[11px] font-mono text-[#72757C]">
                    <span>{srv.duration}</span>
                    <span className="text-white group-hover:text-[#E8FF36] transition-colors uppercase">
                      Detay →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Coaches Preview */}
      <section className="py-20 lg:py-28 bg-[#0D0F12] border-t border-[#191B20] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#191B20]">
            <ScrollReveal variant="fade-up">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                  [ UZMAN KADRO ]
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-display">
                  Eğitmenlerimiz
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.15}>
              <Link
                href="/koclar"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A5A7AD] hover:text-[#E8FF36] transition-colors"
              >
                <span>Tüm Kadroyu Gör</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerContainer
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            {COACHES_DATA.map((coach) => (
              <StaggerItem key={coach.id}>
                <div className="bg-[#08090B] border border-[#23272F] overflow-hidden group hover:border-[#343A46] transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={coach.image}
                        alt={coach.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-[#08090B] via-transparent to-transparent opacity-70 dark:opacity-90" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider bg-black/80 dark:bg-[#08090B]/80 px-2 py-0.5 border border-white/20 dark:border-[#23272F]">
                          {coach.experience}
                        </span>
                        <h3 className="text-xl font-bold text-white uppercase font-display mt-2 drop-shadow-md">
                          {coach.name}
                        </h3>
                        <p className="text-xs text-[#A5A7AD] mt-0.5">{coach.title}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-[#A5A7AD] leading-relaxed italic mb-4">
                        &ldquo;{coach.quote}&rdquo;
                      </p>

                      <div className="space-y-1.5 mb-6">
                        {coach.specialties.slice(0, 2).map((sp, idx) => (
                          <div
                            key={idx}
                            className="text-[11px] font-mono text-[#72757C] flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 bg-[#E8FF36] rounded-full" />
                            <span>{sp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#191B20]">
                      <Link
                        href={`/koclar/${coach.slug}`}
                        className="text-center py-2.5 bg-[#131519] border border-[#23272F] text-xs font-semibold text-white uppercase tracking-wider hover:border-[#343A46] transition-colors"
                      >
                        Profili İncele
                      </Link>
                      <Link
                        href={`/on-gorusme?koc=${coach.slug}`}
                        className="text-center py-2.5 bg-[#E8FF36] text-[#08090B] text-xs font-bold uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
                      >
                        Görüşme Al
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 28. Google Rating & Testimonials */}
      <TestimonialTeaser />

      {/* 26. FAQ */}
      <FaqAccordion limit={6} />

      {/* Final Conversion Action Banner */}
      <section className="py-20 lg:py-24 bg-[#08090B] border-t border-[#191B20] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="zoom-in" duration={0.7}>
            <div className="bg-[#0D0F12] border border-[#23272F] p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-2">
                  NİŞANTAŞI • PRIVATE SPORT STUDIO
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.08]">
                  Standart program değil. <br />
                  <span className="text-[#A5A7AD]">Sana göre program.</span>
                </h2>
                <p className="text-sm sm:text-base text-[#A5A7AD] mt-4 leading-relaxed">
                  Hedeflerinize ulaşmak için tek başınıza deneme-yanılma yapmak zorunda değilsiniz. Core & Fit koçunuzla tanışmak için ilk adımı atın.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <Link
                  href="/on-gorusme"
                  className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] active:scale-[0.98] transition-all"
                >
                  <span>Ücretsiz Ön Görüşme Al</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={buildQuickChatWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 bg-[#131519] border border-[#23272F] text-white hover:border-[#25D366] font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp&apos;tan Sor</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
