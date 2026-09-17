export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    question: "Personal Training nedir?",
    answer:
      "Personal Training (1:1 Birebir Kişisel Antrenörlük), antrenman programının tamamen sizin hedeflerinize, postüral yapınıza, mevcut kondisyon seviyenize ve yaşam tarzınıza göre özel olarak tasarlanıp, her saniyesinin uzman bir antrenör gözetiminde uygulandığı profesyonel koçluk sistemidir. Klasik spor salonlarındaki standart şablonlardan farklı olarak, her hareket sizin biyomekaniğinize göre uyarlanır.",
    category: "Genel",
  },
  {
    id: "faq-2",
    question: "1:1 ders nasıl ilerliyor?",
    answer:
      "Seansınız randevu saatinizde başlar. Koçunuz o günkü toparlanma durumunuzu ve enerji seviyenizi değerlendirir. Ardından dinamik hareket hazırlığı (Ramp Protocol) ile eklemler açılır. Ana antrenman bloğunda hedefinize göre planlanmış kuvvet, hipertrofi veya fonksiyonel yüklemeler birebir teknik kontrol ile uygulanır. Seans sonunda dekompresyon ve toparlanma çalışması yapılır. Seans boyunca stüdyoda dikkat dağıtıcı kalabalık veya sıra bekleme olmaz.",
    category: "Antrenman",
  },
  {
    id: "faq-3",
    question: "İlk görüşmede ne yapılıyor?",
    answer:
      "Ücretsiz Ön Görüşme seansında stüdyomuzu ziyaret edersiniz. Koçumuzla oturup spor geçmişinizi, sağlık durumunuzu, varsa eski sakatlıklarınızı ve hedeflerinizi konuşuruz. Basit bir postür ve mobilite taraması yaparak vücudunuzun başlangıç noktasını belirleriz. Size en uygun haftalık frekansı ve çalışma metodunu belirleyip yol haritanızı netleştiririz.",
    category: "Başlangıç",
  },
  {
    id: "faq-4",
    question: "Spora yeni başlasam uygun mu?",
    answer:
      "Kesinlikle evet. Hatta spora yeni başlayanlar için en güvenli ve etkili yöntem 1:1 Personal Training'dir. Kalabalık salonlarda yapılan yanlış hareketler sakatlıklara ve motivasyon kaybına yol açarken, Core & Fit'te koçunuz temel hareket kalıplarını (squat, hinge, push, pull) sıfırdan ve güvenle öğretir.",
    category: "Başlangıç",
  },
  {
    id: "faq-5",
    question: "Haftada kaç gün çalışmalıyım?",
    answer:
      "İdeal sıklık hedefinize, mevcut kondisyonunuza ve iş/yaşam takviminize göre belirlenir. Genellikle haftada 2 veya 3 gün 1:1 seans, sürdürülebilir bir gelişim ve kas adaptasyonu için en dengeli sonuçları verir. İleri seviye sporcular için bu sayı 4 güne çıkarılabilir.",
    category: "Programlama",
  },
  {
    id: "faq-6",
    question: "Dersler kaç dakika sürüyor?",
    answer:
      "Birebir antrenman seanslarımız net 50 dakikadır. Bu süre, yüksek odaklanma, form doğruluğu ve merkezi sinir sistemini aşırı yıpratmadan maksimum metabolik ve nöromüsküler verim almak için bilimsel olarak en optimize süredir.",
    category: "Antrenman",
  },
  {
    id: "faq-7",
    question: "Paket fiyatları nedir?",
    answer:
      "Core & Fit'te paketler seans adedine, haftalık çalışma sıklığına ve belirlenen hedefin kapsamına göre periyotlanır. Sabit bir salon abonelik ücreti yerine, aldığınız birebir koçluk seans adedi üzerinden şeffaf paket seçenekleri sunulur. Güncel paket opsiyonları ve size en uygun teklif için Paketler sayfamızdan ya da WhatsApp üzerinden anında bilgi alabilirsiniz.",
    category: "Paketler",
  },
  {
    id: "faq-8",
    question: "Koç seçebiliyor muyum?",
    answer:
      "Evet. Ön görüşme sırasında antrenman beklentiniz, hedeflenen branş ve seans saatlerinize göre uygun uzman koçlarımızla eşleştirilirsiniz. Web sitemizdeki Koçlar sayfasından eğitmenlerimizin uzmanlık alanlarını ve biyografilerini inceleyerek doğrudan belirli bir koçumuzla görüşme talep edebilirsiniz.",
    category: "Koçlar",
  },
  {
    id: "faq-9",
    question: "Randevu nasıl oluşturabilirim?",
    answer:
      "Web sitemizdeki 'Ücretsiz Ön Görüşme' veya 'Randevu' butonlarına tıklayarak 1 dakikada online talep formunu doldurabilirsiniz. Talebiniz iletildikten hemen sonra ekibimiz WhatsApp veya telefon üzerinden sizinle iletişime geçerek müsaitlik takviminizi netleştirir.",
    category: "Randevu",
  },
];
