"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbox } from "@/components/ui/Lightbox";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Maximize2 } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: "g-1",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85",
    title: "1:1 Performans & Ağırlık Alanı",
    category: "Interior & Studio",
    span: "col-span-1 md:col-span-2 lg:col-span-2 aspect-[16/9]",
  },
  {
    id: "g-2",
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=85",
    title: "Birebir Koçluk & Duruş Kontrolü",
    category: "Coaching",
    span: "col-span-1 aspect-square",
  },
  {
    id: "g-3",
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=85",
    title: "Serbest Ağırlık & Barbell İstasyonu",
    category: "Equipment",
    span: "col-span-1 aspect-square",
  },
  {
    id: "g-4",
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=85",
    title: "Progresif Kuvvet Blokları",
    category: "Strength",
    span: "col-span-1 md:col-span-2 lg:col-span-2 aspect-[16/9]",
  },
  {
    id: "g-5",
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85",
    title: "Mobilite & Dekompresyon Alanı",
    category: "Mobility",
    span: "col-span-1 aspect-square",
  },
  {
    id: "g-6",
    src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1000&q=85",
    title: "Fonksiyonel Ekipmanlar & Kettlebell",
    category: "Equipment",
    span: "col-span-1 aspect-square",
  },
];

export default function StudioGalleryPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");

  const handleOpen = (src: string, title: string) => {
    setActiveImage(src);
    setActiveTitle(title);
  };

  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
              [ NİŞANTAŞI • STÜDYO ALANI ]
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
              Stüdyo & Ekipman
            </h1>
            <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
              Sadece randevulu üyelerin kabul edildiği, hijyen ve akustik konforun ön planda tutulduğu butik antrenman atmosferimiz.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer
          staggerDelay={0.08}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {GALLERY_IMAGES.map((img) => (
            <StaggerItem key={img.id} className={img.span}>
              <div
                onClick={() => handleOpen(img.src, img.title)}
                className="relative w-full h-full overflow-hidden border border-[#23272F] group cursor-pointer hover:border-[#E8FF36]/40 transition-colors"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-[#08090B] via-transparent to-transparent opacity-60 dark:opacity-80 group-hover:opacity-40 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#E8FF36] tracking-wider block">
                      {img.category}
                    </span>
                    <h3 className="text-base font-bold text-white uppercase font-display">
                      {img.title}
                    </h3>
                  </div>
                  <span className="p-2 bg-[#131519] border border-[#23272F] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-[#E8FF36]" />
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Action Banner */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="mt-16 p-8 bg-[#0D0F12] border border-[#23272F] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-white uppercase font-display">
                Stüdyomuzu Yerinde İnceleyin
              </h4>
              <p className="text-xs text-[#A5A7AD] mt-1">
                Nişantaşı stüdyomuza gelip ekipmanları ve ortamı bizzat görmek için ön randevu oluşturabilirsiniz.
              </p>
            </div>
            <Link
              href="/randevu"
              className="px-6 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors shrink-0"
            >
              Ziyaret Randevusu Al
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={Boolean(activeImage)}
        imageSrc={activeImage}
        imageAlt={activeTitle}
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
