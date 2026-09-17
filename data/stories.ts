export interface StoryItem {
  id: string;
  client: string;
  clientTitle: string;
  goal: string;
  duration: string;
  program: string;
  experience: string;
  coachNote: string;
  highlightMetric: string;
  image?: string;
  isSampleData?: boolean;
}

export const STORIES_DATA: StoryItem[] = [
  {
    id: "story-1",
    client: "Ece K.",
    clientTitle: "Pazarlama Direktörü / Nişantaşı",
    goal: "Postüral Düzeltme & Yağ Kaybı",
    duration: "4 Ay (16 Hafta)",
    program: "1:1 Personal Training & Mobilite",
    experience:
      "Masa başı çalışma düzenim sebebiyle şiddetli sırt ağrılarım vardı ve kalabalık salonlarda kendimi hep yabancı hissediyordum. Core & Fit'te ilk günden itibaren hareket formlarım adım adım düzeltildi. Ağrılarım tamamen bitti, kendimi çok daha enerjik ve dik hissediyorum.",
    coachNote:
      "Öncelikli olarak torasik omurga hareketliliği ve glute aktivasyonu üzerine çalıştık. Ece Hanım'ın seans disiplini ve tempo kontrollerine uyumu dönüşümün anahtarı oldu.",
    highlightMetric: "Ağrısız Günlük Yaşam & %18 Kuvvet Artışı",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    isSampleData: true,
  },
  {
    id: "story-2",
    client: "Barış T.",
    clientTitle: "Yazılım Mimarı / Beşiktaş",
    goal: "Kas Kazanımı & Fonksiyonel Güç",
    duration: "6 Ay (24 Hafta)",
    program: "Strength & Hypertrophy Periodization",
    experience:
      "Daha önce 3 yıl boyunca klasik spor salonlarına üye oldum ancak hiçbir zaman belirgin bir kuvvet artışı kaydedemedim. Core & Fit'te her seans ağırlıklar, setler ve form not edildi. Rastgele çalışmadığımız için sonuç kaçınılmaz oldu.",
    coachNote:
      "Temel bileşik kaldırışlarda (Squat, Deadlift) teknik limitasyonları giderdik. RPE tabanlı kademeli aşırı yükleme ile kas kütlesinde net bir artış yakaladık.",
    highlightMetric: "+6.5 kg Yağsız Kas Kazanımı",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    isSampleData: true,
  },
  {
    id: "story-3",
    client: "Deniz A.",
    clientTitle: "Girişimci / Teşvikiye",
    goal: "Kondisyon, VO2 Max & Yağ Oranı Düşürme",
    duration: "3 Ay (12 Hafta)",
    program: "Functional Conditioning & Fat Loss",
    experience:
      "Zamanım çok kısıtlı. Randevulu sistem sayesinde stüdyoya girdiğim an koçum hazır oluyor, 50 dakikamın her saniyesi maksimum verimle geçiyor. Duşumu alıp 1 saat içinde işimin başına dönebiliyorum.",
    coachNote:
      "Metabolik devreler ve kalp atım hızı zonu takibiyle çalışıldı. Deniz Bey'in toparlanma süresi her hafta belirgin şekilde kısaldı.",
    highlightMetric: "Dinlenme Nabzında -12 BPM & Yağ Oranında Net Düşüş",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    isSampleData: true,
  },
  {
    id: "story-4",
    client: "Zeynep S.",
    clientTitle: "İç Mimar / Maçka",
    goal: "Spora Sıfırdan Başlama & Güçlenme",
    duration: "5 Ay (20 Hafta)",
    program: "1:1 Temel Kuvvet & Hareket Kalitesi",
    experience:
      "Hayatımda hiç ağırlık kaldırmamıştım ve çekiniyordum. Core & Fit'in sakin, sadece randevulu kişilerin bulunduğu ortamı beni çok rahatlattı. Koçumun sabırlı yaklaşımı sayesinde şimdi kendi vücut ağırlığımın üstünde ağırlık kaldırabiliyorum.",
    coachNote:
      "Zeynep Hanım ile sıfırdan motor öğrenme fazıyla başladık. Doğru zihin-kas bağlantısı kurulduktan sonra kuvvet gelişimi hızla ivmelendi.",
    highlightMetric: "Kusursuz Hareket Mekaniği & Kalıcı Alışkanlık",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    isSampleData: true,
  },
];
