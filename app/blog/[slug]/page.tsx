import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Yazı Bulunamadı" };

  return {
    title: `${post.title} | Core & Fit Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-24 pb-20 bg-[#08090B] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#72757C] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Fitness Rehberine Dön</span>
        </Link>
      </div>

      <header className="py-12 border-b border-[#191B20] bg-[#0D0F12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-xs font-mono text-[#72757C] uppercase mb-3">
            <span className="text-[#E8FF36] font-semibold">{post.category}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>{post.publishedAt}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display leading-[1.08] mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#A5A7AD] leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-[#191B20] text-xs font-mono text-[#72757C]">
            <User className="w-4 h-4 text-[#E8FF36]" />
            <span>Yazar: {post.author}</span>
          </div>
        </div>
      </header>

      {/* Featured Photo */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#23272F]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8 text-sm sm:text-base text-[#A5A7AD] leading-relaxed">
          {post.content.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              {sec.heading && (
                <h2 className="text-xl sm:text-2xl font-bold uppercase font-display text-white mt-6 mb-2">
                  {sec.heading}
                </h2>
              )}
              <p>{sec.paragraph}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-[#191B20] flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono uppercase bg-[#131519] border border-[#23272F] px-3 py-1 text-[#72757C]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Conversion Box */}
        <div className="mt-12 p-8 bg-[#0D0F12] border border-[#23272F] text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E8FF36] block mb-2">
            NİŞANTAŞI • BİREBİR ANTRENMAN
          </span>
          <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
            Hedeflerinize Bilimsel Bir Yaklaşımla Başlayın
          </h3>
          <p className="text-xs text-[#A5A7AD] max-w-md mx-auto mb-6">
            Sadece okumakla kalmayın; antrenörlerimizle birebir çalışarak vücudunuzu doğru teknikle geliştirin.
          </p>
          <Link
            href="/on-gorusme"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8FF36] text-[#08090B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4EB2B] transition-colors"
          >
            <span>Ücretsiz Ön Görüşme Al</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
