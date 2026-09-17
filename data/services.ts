export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  headline: string;
  summary: string;
  description: string[];
  targetAudience: string[];
  mainGoal: string;
  structure: string[];
  duration: string;
  frequencyRecommendation: string;
  image: string;
  badge: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "personal-training",
    slug: "personal-training",
    title: "1:1 Personal Training",
    headline: "Antrenman boyunca tek odağımız sensin.",
    summary:
      "Bireysel biyomekanik analiz, postür değerlendirmesi ve hedefe özel hazırlanan haftalık periyotlama ile tam odaklı koçluk.",
    description: [
      "Core & Fit 1:1 Personal Training, standart spor salonu şablonlarının tamamen dışındadır. Her seans, üyenin güncel toparlanma durumu, eklem hareket açıklığı ve o günkü enerji seviyesi gözetilerek yürütülür.",
      "Koçunuz hareketin her tekrarında formunuzu denetler, tempo (tempo control) ve gerilim altındaki süreyi optimize eder. Sakatlık riskini minimize ederken maksimum adaptasyon sağlanır.",
    ],
    targetAudience: [
      "Kalabalık salon ortamından uzak, tamamen odaklı çalışmak isteyenler",
      "Doğru form ve teknikle sakatlanmadan ilerlemeyi amaçlayanlar",
      "Daha önce spordan istediği sonucu alamamış olanlar",
      "Yoğun iş temposunda zamanını en verimli şekilde kullanmak isteyen yöneticiler",
    ],
    mainGoal: "Maksimum kişiselleştirme, kusursuz teknik takip ve sürdürülebilir fiziksel adaptasyon.",
    structure: [
      "Bireysel postür, mobilite ve kuvvet analizi",
      "Kişiye özel haftalık antrenman periyotlaması",
      "Birebir koç eşliğinde kesintisiz seans",
      "Düzenli çevre ölçümleri ve kuvvet artış takibi",
    ],
    duration: "50 Dakika",
    frequencyRecommendation: "Haftada 2 - 4 Gün",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    badge: "Öncelikli Hizmet",
  },
  {
    id: "functional-training",
    slug: "functional-training",
    title: "Functional Training",
    headline: "Günlük hayata ve spora aktarılabilen gerçek fonksiyonel güç.",
    summary:
      "Vücudu tek bir kas grubu yerine çoklu düzlemlerde ve doğal hareket zincirlerinde çalıştıran dinamik antrenman protokolü.",
    description: [
      "Fonksiyonel antrenman, makinelerin kısıtlı hareket açılarından kurtularak bedeninizi 3 boyutlu uzayda denge, rotasyon ve stabilizasyonla sınar.",
      "Kettlebell, serbest ağırlık, kızak, direnç bantları ve gövde stabilizasyon teknikleriyle kalp ritmini yükseltirken eklem sağlığını güçlendirir.",
    ],
    targetAudience: [
      "Hareketsiz masa başı yaşam tarzının getirdiği tutukluktan kurtulmak isteyenler",
      "Günlük enerjisini ve genel atletik kabiliyetini artırmak isteyenler",
      "Eklemlerini korurken yağ yakımını hızlandırmak isteyenler",
    ],
    mainGoal: "Eklem mobilitesi, core gücü, denge ve çok yönlü fonksiyonel dayanıklılık.",
    structure: [
      "Dinamik hareket hazırlığı (Ramp Protocol)",
      "Bileşik ve rotasyonel kuvvet çalışmaları",
      "Yüksek yoğunluklu fonksiyonel kondisyon blokları",
      "Regeneratif toparlanma ve dekompresyon",
    ],
    duration: "50 Dakika",
    frequencyRecommendation: "Haftada 2 - 3 Gün",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    badge: "Atletik Performans",
  },
  {
    id: "strength-training",
    slug: "strength-training",
    title: "Strength Training",
    headline: "Progresif aşırı yükleme ile inşa edilen saf kuvvet.",
    summary:
      "Squat, deadlift, bench press ve overhead press gibi temel bileşik hareketlerde kademeli ilerlemeyi hedefleyen bilimsel kuvvet antrenmanı.",
    description: [
      "Kuvvet, tüm atletik niteliklerin temelidir. Core & Fit kuvvet protokolünde rastgele ağırlık kaldırma yoktur; RPE (algılanan zorluk derecesi) ve yüzde tabanlı periyotlama kullanılır.",
      "Sinir sistemini ve kas fibrillerini organize ederek vücudun mekanik güç üretim kapasitesini zirveye taşır.",
    ],
    targetAudience: [
      "Kemik yoğunluğunu, eklem dayanıklılığını ve saf kuvvetini artırmak isteyenler",
      "Bileşik egzersizlerde doğru tekniği profesyonel bir koçla öğrenmek isteyenler",
      "Kalıcı metabolik hız artışı hedefleyen kadın ve erkek sporcular",
    ],
    mainGoal: "Maksimal kuvvet gelişimi, nöromüsküler verimlilik ve yapısal sağlamlık.",
    structure: [
      "Merkezi sinir sistemi aktivasyonu ve eklem yükleme hazırlığı",
      "Ana bileşik kuvvet bloğu (Progressive Overload)",
      "Asimetrileri gideren destekleyici (accessory) çalışmalar",
      "Eklem stabilite bitirişi",
    ],
    duration: "50 - 60 Dakika",
    frequencyRecommendation: "Haftada 2 - 3 Gün",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80",
    badge: "Kuvvet & Biyomekanik",
  },
  {
    id: "fat-loss",
    slug: "fat-loss",
    title: "Fat Loss Training",
    headline: "Kas kütlesini korurken metabolizmayı hızlandıran stratejik yağ kaybı.",
    summary:
      "Aşırı yıpratıcı kardiyo yerine yüksek metabolik etki (EPOC) sağlayan direnç ve aralıklı yükleme programı.",
    description: [
      "Sadece kalori yakmak sürdürülebilir bir yağ kaybı sağlamaz. Core & Fit yağ kaybı yaklaşımında temel prensip, kas dokusunu koruyarak vücut kompozisyonunu değiştirmektir.",
      "Seans sonrası saatlerce devam eden oksijen tüketimi (Afterburn) sayesinde vücut dinlenme anında dahi enerji harcamaya devam eder.",
    ],
    targetAudience: [
      "Sıkılaşmak ve yağ oranını sağlıklı şekilde düşürmek isteyenler",
      "Saatlerce kardiyo cihazında koşmaktan sıkılanlar",
      "Diyetle birlikte kas kaybı yaşamadan form tutmak isteyenler",
    ],
    mainGoal: "Viseral ve deri altı yağ dokusunu azaltırken yağsız kas kütlesini ve formu korumak.",
    structure: [
      "Metabolik yoğunluklu direnç devreleri",
      "Kontrollü dinlenme aralıkları ve kalp atım hızı takibi",
      "Bileşik kas gruplarını devreye sokan bileşik hareketler",
      "Haftalık beslenme düzeni ve hidrasyon takibi",
    ],
    duration: "50 Dakika",
    frequencyRecommendation: "Haftada 3 - 4 Gün",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1200&q=80",
    badge: "Metabolik Dönüşüm",
  },
  {
    id: "muscle-building",
    slug: "muscle-building",
    title: "Muscle Building (Hipertrofi)",
    headline: "Mekanik gerilim ve kas lifi hasarını hedefe göre yöneten hacim sistemi.",
    summary:
      "Kişinin kemik yapısına ve kas ekleme açılarına uygun egzersiz varyasyonlarıyla estetik ve hacimli kas gelişimi.",
    description: [
      "Hipertrofi (kas büyümesi), yalnızca ağırlık kaldırmakla değil; doğru kas grubuna doğru açıyla gerilim yüklemekle gerçekleşir.",
      "Core & Fit'te her bireyin eklem açısına özel egzersiz seçilir, eksik bölgeler önceliklendirilir ve hacim (volume) kademeli artırılır.",
    ],
    targetAudience: [
      "Kas kütlesini artırmak ve belirgin bir fiziksel form yakalamak isteyenler",
      "Omuz, sırt, glute veya bacak bölgelerinde hedefe yönelik gelişim arayanlar",
      "Daha önce ağırlık çalışıp hacim kazanamamış sporcular",
    ],
    mainGoal: "Yağsız kas kütlesi kazanımı, estetik orantı ve kas dolgunluğu.",
    structure: [
      "Hedef kas grubuna özel dinamik aktivasyon",
      "Yüksek mekanik gerilim sağlayan ana setler",
      "Metabolik stres ve kas tükenişine yakın kontrollü bitirişler",
      "Beslenme protein ve toparlanma yönlendirmesi",
    ],
    duration: "50 Dakika",
    frequencyRecommendation: "Haftada 3 - 4 Gün",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    badge: "Hipertrofi",
  },
  {
    id: "conditioning",
    slug: "conditioning",
    title: "Conditioning",
    headline: "Kardiyovasküler kapasiteyi ve laktat toleransını üst seviyeye taşı.",
    summary:
      "Aerobik ve anaerobik enerji sistemlerini geliştiren, nabız zonlarını bilinçli yöneten kondisyon protokolü.",
    description: [
      "Çabuk yorulmayan, nefes kapasitesi geniş ve yüksek tempolu seansları tolere edebilen bir bünye inşa ediyoruz.",
      "Rower, AirBike, SkiErg ve vücut ağırlığı kombinasyonlarıyla nabız kontrolü yapılarak laktat eşiği kademeli olarak yukarı çekilir.",
    ],
    targetAudience: [
      "Nefes nefese kalmadan merdiven çıkmak veya sahada aktif olmak isteyenler",
      "Koşu, tenis veya basketbol gibi branş sporlarında dayanıklılığını artırmak isteyenler",
      "Kardiyo sağlığını ve VO2 max değerini optimize etmek isteyenler",
    ],
    mainGoal: "VO2 Max artışı, kalp-dolaşım sistemi sağlığı ve dayanıklılık.",
    structure: [
      "Kalp hızı zonu ısınması (Zone 2)",
      "Yüksek yoğunluklu aralıklı yüklemeler (HIIT / Tempo)",
      "Laktat temizleme ve nefes ritmi eğitimi",
      "Parasempatik sinir sistemi sakinleşme fazı",
    ],
    duration: "45 - 50 Dakika",
    frequencyRecommendation: "Haftada 2 - 3 Gün",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80",
    badge: "Kondisyon & Dayanıklılık",
  },
  {
    id: "mobility",
    slug: "mobility",
    title: "Mobility & Posture",
    headline: "Kısıtlı eklemleri aç, postürünü düzelt ve ağrısız hareket et.",
    summary:
      "Masa başı duruş bozuklukları, omuz ve kalça sıkışmalarını hedefleyen derin eklem mobilitesi ve postür restorasyonu.",
    description: [
      "Öne yuvarlanan omuzlar, gergin boyun kasları ve zayıflayan kalça mekaniği günümüzün en büyük sorunudur.",
      "Mobilite seanslarımız esneme (stretching) ile sınırlı değildir; eklemin son açısında kuvvet üretebilmesini (Active Mobility) sağlar.",
    ],
    targetAudience: [
      "Masa başı çalışan, bel ve boyun sertliğinden yakınan profesyoneller",
      "Kuvvet antrenmanlarında derin çömelemeyen veya squat açısı kısıtlı olanlar",
      "Daha dik, rahat ve özgür hareket etmek isteyen bireyler",
    ],
    mainGoal: "Eklem hareket genişliği, omurga sağlığı, postüral hizalanma ve ağrısız hareket.",
    structure: [
      "Postüral tarama ve eklem açı ölçümleri",
      "Myofascial gevşetme ve dinamik eklem kapsülü çalışmaları",
      "Eklemin uç noktalarında aktif kuvvet çalışmaları",
      "Günlük ergonomi ve ofis içi düzeltici öneriler",
    ],
    duration: "45 - 50 Dakika",
    frequencyRecommendation: "Haftada 2 Gün veya Antrenman Tamamlayıcısı",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    badge: "Postür & Omurga",
  },
  {
    id: "performance",
    slug: "performance",
    title: "Performance Training",
    headline: "Patlayıcı güç, çeviklik ve elit atletik hazırlık.",
    summary:
      "Reaksiyon süresi, dikey sıçrama, yön değiştirme ve patlayıcılığı geliştiren sporcu odaklı performans antrenmanı.",
    description: [
      "İster amatör ister profesyonel bir branşta yarışın; Core & Fit performans antrenmanı bedeninizi sahaya hazır hale getirir.",
      "Kuvvet-hız eğrisinde (Force-Velocity Curve) eksik kalan yönleri tespit ederek güç aktarımını mükemmelleştiririz.",
    ],
    targetAudience: [
      "Tenis, futbol, kayak veya dövüş sporlarında atletik avantaj kazanmak isteyenler",
      "Patlayıcı kuvvet ve çevikliğini test etmek isteyen ileri seviye sporcular",
      "Saha içi sakatlık riskini önceden önlemek isteyen rekabetçi bireyler",
    ],
    mainGoal: "Patlayıcı kuvvet, yön değiştirme sürati ve nöromüsküler hız.",
    structure: [
      "Dinamik plyometrik ve reaktif ısınma",
      "Hız ve patlayıcı güç bloğu (Olympic lifting varyasyonları / Medicine ball)",
      "Rotasyonel güç ve denge çalışmaları",
      "Merkezi sinir sistemi toparlanma protokolü",
    ],
    duration: "50 - 60 Dakika",
    frequencyRecommendation: "Haftada 2 - 3 Gün",
    image: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80",
    badge: "Elit Atletizm",
  },
];
