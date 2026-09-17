export interface GoalItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  howWeWork: string[];
  recommendedServiceSlug: string;
  recommendedServiceTitle: string;
}

export const GOALS_DATA: GoalItem[] = [
  {
    id: "yag-kaybi",
    slug: "yag-kaybi",
    name: "Yağ Kaybı",
    tagline: "Kas kütlesini koruyarak yağ oranını kalıcı olarak düşürün.",
    summary:
      "Vücudu saatlerce yıpratıcı kardiyo makinelerinde tüketmek yerine, metabolik direnç ve bileşik egzersizlerle dinlenme anında bile kalori harcayan bir fizyoloji inşa ediyoruz.",
    howWeWork: [
      "Kişiye özel hedef nabız ve metabolik yoğunluk yönetimi",
      "Kas kaybını önleyen progresif direnç antrenmanı",
      "Haftalık çevre ve yağ dokusu ölçüm takibi",
      "Sürdürülebilir günlük aktivite ve toparlanma yönlendirmesi",
    ],
    recommendedServiceSlug: "fat-loss",
    recommendedServiceTitle: "Fat Loss Training",
  },
  {
    id: "kas-kazanimi",
    slug: "kas-kazanimi",
    name: "Kas Kazanımı",
    tagline: "Doğru biyomekanik açılar ve mekanik gerilimle estetik hacim.",
    summary:
      "Rastgele ağırlık kaldırmak yerine, eklemlerinize en uygun açılarda kas fibrillerini maksimum gerilime maruz bırakan bilimsel hipertrofi protokolleri uyguluyoruz.",
    howWeWork: [
      "Bireysel iskelet yapısına uygun egzersiz varyasyonu seçimi",
      "Set içi gerilim süresi (Time Under Tension) ve tempo kontrolü",
      "Haftalık hacim ve progressive overload (kademeli yük) takibi",
      "Kas toparlanmasını destekleyen uyku ve beslenme rehberliği",
    ],
    recommendedServiceSlug: "muscle-building",
    recommendedServiceTitle: "Muscle Building",
  },
  {
    id: "guc",
    slug: "guc",
    name: "Güç",
    tagline: "Merkezi sinir sistemini ve kas liflerini organize eden saf kuvvet.",
    summary:
      "Squat, deadlift, press gibi temel bileşik hareketlerde sakatlanmadan, teknik mükemmellik ve planlı periyotlama ile maksimum kuvvet üretmeyi öğrenin.",
    howWeWork: [
      "Biyomekanik açı analizi ve omurga stabilizasyon testi",
      "RPE ve yüzde tabanlı kuvvet periyotlaması",
      "Eklemleri koruyan yardımcı (accessory) kuvvet blokları",
      "Kuvvet artışının periyodik olarak kayıt altına alınması",
    ],
    recommendedServiceSlug: "strength-training",
    recommendedServiceTitle: "Strength Training",
  },
  {
    id: "kondisyon",
    slug: "kondisyon",
    name: "Kondisyon",
    tagline: "Geniş nefes kapasitesi, laktat eşiği ve yüksek dayanıklılık.",
    summary:
      "Günlük hayatta ya da spor sahasında çabuk tükenmeyen, toparlanma süresi kısa ve enerjisi yüksek bir dolaşım sistemi inşa edin.",
    howWeWork: [
      "Zone 2 ve Zone 4/5 aralıklı nabız zonu çalışmaları",
      "Rower, SkiErg, AirBike ve fonksiyonel yük taşımaları",
      "Nefes mekaniği ve laktat temizleme yeteneği geliştirme",
      "VO2 Max kapasitesini aşamalı olarak yukarı taşıma",
    ],
    recommendedServiceSlug: "conditioning",
    recommendedServiceTitle: "Conditioning",
  },
  {
    id: "postur",
    slug: "postur",
    name: "Postür",
    tagline: "Masa başı duruş bozukluklarını düzeltin, dik ve dengeli durun.",
    summary:
      "İçeri yuvarlanan omuzlar, ileri kaymış baş pozisyonu ve zayıf sırt kasları yaşam kalitenizi düşürür. Postür analizi ile omurga sağlığınızı geri kazandırıyoruz.",
    howWeWork: [
      "Detaylı statik ve dinamik postür değerlendirmesi",
      "Göğüs ve kalça fleksörlerinde miyofasiyal açılma",
      "Derin boyun ve sırt stabilizatörlerini güçlendirme",
      "Günlük çalışma masası ergonomisi önerileri",
    ],
    recommendedServiceSlug: "mobility",
    recommendedServiceTitle: "Mobility & Posture",
  },
  {
    id: "mobilite",
    slug: "mobilite",
    name: "Mobilite",
    tagline: "Eklem hareket açıklığını artırın ve kısıtlılıklardan kurtulun.",
    summary:
      "Pasif esneme eklemleri güvende tutmaz. Biz eklemlerin son açılarında aktif kuvvet üretmesini sağlayarak sakatlık riskini yok ediyoruz.",
    howWeWork: [
      "Omuz, kalça ve ayak bileği eklem hareket aralığı testi",
      "Aktif mobilite ve eklem kapsülü yükleme teknikleri",
      "Ağrısız ve serbest hareket kabiliyeti kazandırma",
      "Kuvvet antrenmanlarına kusursuz hazırlık",
    ],
    recommendedServiceSlug: "mobility",
    recommendedServiceTitle: "Mobility & Posture",
  },
  {
    id: "spora-baslangic",
    slug: "spora-baslangic",
    name: "Spora Başlangıç",
    tagline: "Kalabalık salon korkusu olmadan, sıfırdan güvenle başlayın.",
    summary:
      "Daha önce spor yapmadıysanız ya da uzun süre ara verdiyseniz, özel stüdyo ortamında sadece size odaklanan bir koçla adım adım ilerleyin.",
    howWeWork: [
      "Temel motor beceri ve hareket kalitesi tespiti",
      "Eklemleri zorlamayan kontrollü başlangıç yoğunluğu",
      "Her egzersizin adım adım doğru formunun öğretilmesi",
      "Düzenli antrenman alışkanlığı ve motivasyon desteği",
    ],
    recommendedServiceSlug: "personal-training",
    recommendedServiceTitle: "1:1 Personal Training",
  },
  {
    id: "performans",
    slug: "performans",
    name: "Performans",
    tagline: "Atletik patlayıcılık, çeviklik ve rekabetçi güç.",
    summary:
      "Branş sporlarında veya ileri seviye hedeflerde fark yaratmak isteyenler için reaksiyon süresi ve patlayıcı güç transferi.",
    howWeWork: [
      "Kuvvet-hız spektrumu değerlendirmesi",
      "Plyometrik ve reaktif hız antrenmanları",
      "Rotasyonel güç ve yön değiştirme mekaniği",
      "Sezon içi ve sezon dışı atletik periyotlama",
    ],
    recommendedServiceSlug: "performance",
    recommendedServiceTitle: "Performance Training",
  },
];
