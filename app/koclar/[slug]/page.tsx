import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COACHES_DATA } from "@/data/coaches";
import { buildQuickChatWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowLeft, ArrowRight, Check, Award, GraduationCap, MessageSquare } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COACHES_DATA.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const coach = COACHES_DATA.find((c) => c.slug === slug);
  if (!coach) return { title: "Antrenör Bulunamadı" };

  return {
    title: `${coach.name} | ${coach.title}`,
    description: coach.bio,
    openGraph: {
      title: `${coach.name} | Core & Fit Private Sport Studio Nişantaşı`,
      description: coach.bio,
      images: [{ url: coach.image }],
    },
  };
}

export default async function CoachDetailPage({ params }: Props) {
  const { slug } = await params;
  const coach = COACHES_DATA.find((c) => c.slug === slug);

  if (!coach) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          href="/koclar"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#72757C] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Eğitmen Kadrosuna Dön</span>
        </Link>
      </div>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coach Photo */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full border border-[#23272F] overflow-hidden">
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-[#08090B] via-transparent to-transparent opacity-40 dark:opacity-80" />
            </div>

            <div className="p-6 bg-[#0D0F12] border-x border-b border-[#23272F]">
              <span className="text-xs font-mono text-[#E8FF36] uppercase tracking-wider block mb-1">
                {coach.experience}
              </span>
              <h1 className="text-3xl font-extrabold uppercase font-display text-white">
                {coach.name}
              </h1>
              <p className="text-xs text-[#A5A7AD] mt-1">{coach.title}</p>

              <div className="pt-6 mt-6 border-t border-[#191B20] flex flex-col gap-3">
                <Link
                  href={`/on-gorusme?koc=${coach.slug}`}
                  className="w-full text-center py-3.5 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
                >
                  {coach.name} ile Görüşme Al
                </Link>

                <a
                  href={buildQuickChatWhatsAppUrl(
                    `Merhaba, antrenörünüz ${coach.name} ile 1:1 çalışma takvimi hakkında bilgi alabilir miyim?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#131519] border border-[#23272F] text-white hover:border-[#25D366] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp&apos;tan Müsaitlik Sor</span>
                </a>
              </div>
            </div>
          </div>

          {/* Coach Narrative & Experience */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <span className="text-xs font-mono text-[#E8FF36] uppercase tracking-widest block mb-2">
                ANTRENMAN YAKLAŞIMI & FELSEFESİ
              </span>
              <blockquote className="text-base sm:text-lg text-white font-medium italic border-l-2 border-[#E8FF36] pl-4 my-3">
                &ldquo;{coach.approach}&rdquo;
              </blockquote>
            </div>

            <div>
              <h2 className="text-xl font-bold uppercase font-display text-white mb-3">
                Biyografi & Geçmiş
              </h2>
              <p className="text-sm text-[#A5A7AD] leading-relaxed">{coach.bio}</p>
            </div>

            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <h3 className="text-lg font-bold uppercase font-display text-white mb-4">
                Uzmanlık Alanları
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coach.specialties.map((sp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#A5A7AD]">
                    <Check className="w-4 h-4 text-[#E8FF36] shrink-0 mt-0.5" />
                    <span>{sp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-[#0D0F12] border border-[#23272F]">
              <h3 className="text-lg font-bold uppercase font-display text-white mb-4">
                Akreditasyonlar & Sertifikalar
              </h3>
              <ul className="space-y-2 text-xs font-mono text-[#A5A7AD]">
                {coach.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E8FF36] rounded-full" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
