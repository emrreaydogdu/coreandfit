export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  image: string;
  content: {
    heading?: string;
    paragraph: string;
  }[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "nisantasi-personal-trainer-secerken-nelere-dikkat-edilmeli",
    title: "Nişantaşı Personal Trainer Seçerken Nelere Dikkat Edilmeli?",
    excerpt:
      "İstanbul Nişantaşı ve çevresinde kişisel antrenör ararken doğru uzmanı seçmek hem zamanınızı hem de sağlığınızı korur.",
    category: "Rehber",
    readTime: "5 Dk Okuma",
    publishedAt: "2025-01-15",
    author: "Mert Aksoy (Head Coach)",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    tags: ["Nişantaşı Personal Trainer", "Kişisel Koç", "Birebir Antrenman"],
    content: [
      {
        heading: "1. Şablon Programlar mı, Biyomekanik Analiz mi?",
        paragraph:
          "Pek çok spor merkezinde herkese benzer egzersiz listeleri verilir. Oysa her bireyin kalça açısı, omuz kapsül derinliği ve omurga eğriliği farklıdır. Profesyonel bir eğitmen, antrenmana geçmeden önce mutlaka postür ve mobilite taraması yapmalıdır.",
      },
      {
        heading: "2. Stüdyo Ortamı ve Dikkat Dağınıklığı",
        paragraph:
          "Klasik kalabalık spor salonlarında sıra beklemek veya gürültü arasında koçun dikkatinin dağılması sık yaşanan bir problemdir. Nişantaşı'ndaki private sport studio konsepti, seans boyunca koçunuzun yalnızca size odaklanmasını garanti eder.",
      },
      {
        heading: "3. Ölçülebilir İlerleme ve Veri Takibi",
        paragraph:
          "İyi bir antrenör yalnızca 'Bugün ne çalışmak istersin?' diye sormaz. Bir sonraki haftanın kaldırış ağırlıklarını, dinlenme aralıklarını ve toparlanma periyotlarını önceden planlar.",
      },
    ],
  },
  {
    id: "blog-2",
    slug: "personal-training-nedir-avantajlari",
    title: "Personal Training Nedir? Kişisel Antrenörle Çalışmanın Avantajları",
    excerpt:
      "Neden tek başınıza çalışmak yerine bir koçla çalışmalısınız? Sakatlanma riskini sıfıra indiren ve sonuca ulaştıran bilimsel yaklaşım.",
    category: "Sistem",
    readTime: "4 Dk Okuma",
    publishedAt: "2025-01-10",
    author: "Selin Yılmaz",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    tags: ["Personal Training", "Doğru Teknik", "Verimlilik"],
    content: [
      {
        heading: "Birebir İlgi ve Teknik Kontrol",
        paragraph:
          "Bir hareketi doğru yaptığınızı düşünmekle gerçekten doğru yapmak arasında büyük bir fark vardır. Squat yaparken dizinizin milimetrik içe dönmesi veya belinizin yuvarlanması uzun vadede kronik ağrılara sebep olabilir.",
      },
      {
        heading: "Zaman Tasarrufu",
        paragraph:
          "Günde 2 saat salonda boş yere oyalanmak yerine, 50 dakikalık yüksek yoğunluklu ve odaklı bir seans metabolizmanızı gün boyu canlı tutar.",
      },
    ],
  },
  {
    id: "blog-3",
    slug: "yag-kaybinda-kardiyo-mu-agirlik-mi",
    title: "Yağ Kaybında Kardiyo mu Ağırlık mı? Bilimin Söyledikleri",
    excerpt:
      "Saatlerce koşu bandında yürümek yerine neden direnç antrenmanına odaklanmalısınız? EPOC ve metabolik hız gerçeği.",
    category: "Beslenme & Fizyoloji",
    readTime: "6 Dk Okuma",
    publishedAt: "2025-01-05",
    author: "Can Demir",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Yağ Kaybı", "Kardiyo", "Direnç Antrenmanı"],
    content: [
      {
        heading: "Kalori Yakımı vs. Kas Kütlesi Korunumu",
        paragraph:
          "Yalnızca kardiyo ile verilen kiloların önemli bir bölümü kas dokusudur. Kas dokusu azaldığında bazal metabolizma hızı düşer ve diyet bittiğinde kilolar hızla geri alınır.",
      },
      {
        heading: "Afterburn (EPOC) Etkisi",
        paragraph:
          "Kuvvet antrenmanı sonrası vücut kas liflerini onarmak ve oksijen açığını kapatmak için sonraki 24-48 saat boyunca dinlenme anında kalori yakmaya devam eder.",
      },
    ],
  },
  {
    id: "blog-4",
    slug: "kas-kazanmak-icin-nasil-antrenman-yapilmali",
    title: "Kas Kazanmak İçin Nasıl Antrenman Yapılmalı? Hipertrofi Rehberi",
    excerpt:
      "Mekanik gerilim, kas içi hasar ve metabolik stres dengesi. Kas kütlesi inşa etmenin temel biyomekanik kuralları.",
    category: "Hipertrofi",
    readTime: "5 Dk Okuma",
    publishedAt: "2024-12-28",
    author: "Mert Aksoy",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Kas İnşası", "Hipertrofi", "Progresif Yükleme"],
    content: [
      {
        heading: "Progresif Aşırı Yükleme Prensibi",
        paragraph:
          "Kasların büyümesi için her antrenmanda ya da haftada bir parametreyi (ağırlık, tekrar sayısı, tempo veya dinlenme süresi) yukarı taşımak zorundasınız.",
      },
    ],
  },
  {
    id: "blog-5",
    slug: "haftada-kac-gun-antrenman-yapilmali",
    title: "Haftada Kaç Gün Antrenman Yapılmalı?",
    excerpt:
      "Daha çok çalışmak her zaman daha iyi sonuç vermez. Toparlanma kapasitenize göre ideal haftalık antrenman frekansı.",
    category: "Programlama",
    readTime: "4 Dk Okuma",
    publishedAt: "2024-12-20",
    author: "Selin Yılmaz",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80",
    tags: ["Antrenman Frekansı", "Toparlanma", "Programlama"],
    content: [
      {
        heading: "Toparlanma ve Süperkompanzasyon",
        paragraph:
          "Kaslar salonda değil, dinlenme ve uyku esnasında büyür ve güçlenir. Yeterli toparlanma süresi tanınmadığında overtraining ve performans gerilemesi kaçınılmazdır.",
      },
    ],
  },
  {
    id: "blog-6",
    slug: "spora-yeni-baslayanlar-icin-antrenman-rehberi",
    title: "Spora Yeni Başlayanlar İçin Antrenman Rehberi",
    excerpt:
      "İlk haftalarda yapılan en yaygın hatalar, sakatlıklardan korunma ve kalıcı spor alışkanlığı edinmenin püf noktaları.",
    category: "Başlangıç",
    readTime: "5 Dk Okuma",
    publishedAt: "2024-12-15",
    author: "Mert Aksoy",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    tags: ["Başlangıç", "Motivasyon", "Teknik"],
    content: [
      {
        heading: "Ego Lifting Tuzağından Kaçının",
        paragraph:
          "Ağırlığın büyüklüğü değil, hareketin hedef kas grubuna ne kadar saf aktarıldığı önemlidir. Temel biyomekaniği kavramak ilk 4 haftanın en önemli önceliğidir.",
      },
    ],
  },
];
