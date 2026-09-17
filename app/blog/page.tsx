import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import { ArrowRight, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Fitness & Biyomekanik Rehberi (Blog) | Nişantaşı Core & Fit",
  description:
    "Nişantaşı Personal Training, kas kazanımı, yağ kaybı, doğru teknik ve biyomekanik üzerine antrenörlerimizin hazırladığı bilimsel fitness rehberi.",
};

export default function BlogIndexPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="pt-24 pb-20 bg-[#08090B] text-white">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">
            [ EDİTORYAL FIT JOURNAL ]
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-display leading-[1.05] mb-4">
            Fitness & Biyomekanik
          </h1>
          <p className="text-sm sm:text-base text-[#A5A7AD] max-w-2xl leading-relaxed">
            Şehir efsaneleri yerine spor biliminin güncel verileri; Nişantaşı stüdyo koçlarımızın hazırladığı antrenman, toparlanma ve beslenme yazıları.
          </p>
        </div>
      </section>

      {/* Featured Main Article */}
      <section className="py-12 border-b border-[#191B20] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0D0F12] border border-[#23272F] hover:border-[#E8FF36]/60 transition-all p-6 sm:p-10"
        >
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden border border-[#191B20]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-[#08090B]/90 text-[10px] font-mono text-[#E8FF36] uppercase tracking-wider border border-[#23272F]">
                ÖNE ÇIKAN MAKALE
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#72757C] uppercase mb-3">
                <span className="text-[#E8FF36]">{featured.category}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold uppercase font-display text-white group-hover:text-[#E8FF36] transition-colors leading-tight mb-4">
                {featured.title}
              </h2>

              <p className="text-sm text-[#A5A7AD] leading-relaxed mb-6">
                {featured.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-[#191B20] flex items-center justify-between">
              <span className="text-xs font-mono text-[#72757C]">
                Yazar: {featured.author}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono uppercase text-[#E8FF36] group-hover:underline">
                <span>Devamını Oku</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid of Other Articles */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-[#0D0F12] border border-[#23272F] hover:border-[#343A46] p-6 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#191B20] mb-5">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#72757C] uppercase mb-2">
                  <span className="text-[#E8FF36]">{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold uppercase font-display text-white group-hover:text-[#E8FF36] transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-[#A5A7AD] leading-relaxed line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#191B20] flex items-center justify-between text-[11px] font-mono text-[#72757C]">
                <span>{post.author}</span>
                <span className="text-white group-hover:text-[#E8FF36] transition-colors">
                  Oku →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
