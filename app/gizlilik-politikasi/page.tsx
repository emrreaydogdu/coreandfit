import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/config/business";
import { H2, LegalPage, List, Strong } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Core & Fit web sitesi ve üye panelinde kişisel verilerin nasıl korunduğu, ödeme güvenliği ve üçüncü taraf hizmetler.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      current="/gizlilik-politikasi"
      intro={
        <p>
          Bu politika, www.coreandfit.com.tr web sitesini ve üye panelini kullandığınızda bilgilerinizin nasıl toplandığını,
          korunduğunu ve paylaşıldığını açıklar. Hangi verilerin hangi hukuki sebeple işlendiğinin ayrıntısı{" "}
          <Link href="/kvkk" className="underline text-white">
            KVKK Aydınlatma Metni
          </Link>
          &apos;nde yer alır.
        </p>
      }
    >
      <H2>1. Topladığımız Bilgiler</H2>
      <List
        items={[
          "Formlarda ve üyelik kaydında verdiğiniz ad soyad, telefon ve e-posta",
          "Üye panelinde oluşan randevu, paket, sipariş ve giriş kayıtları",
          "Yalnızca açık rıza verdiyseniz sağlık notu, sakatlık bilgisi ve vücut ölçüleri",
          "Güvenlik için oturum bilgisi ve IP adresi",
        ]}
      />
      <p>Sitede reklam, analitik veya davranış takibi yapan bir araç kullanılmaz.</p>

      <H2>2. Bilgilerinizi Nasıl Koruyoruz</H2>
      <List
        items={[
          "Tüm bağlantılar HTTPS ile şifrelenir; tarayıcıya yalnızca güvenli bağlantı kullanması bildirilir (HSTS).",
          "Şifreniz hiçbir zaman açık metin olarak saklanmaz; geri döndürülemez bir özet (scrypt) olarak tutulur.",
          "Oturum çerezi JavaScript ile okunamaz, yalnızca HTTPS üzerinden ve yalnızca bu siteye gönderilir.",
          "Art arda hatalı giriş denemelerinde hesap geçici olarak kilitlenir; kayıt ve form işlemlerinde deneme sınırı uygulanır.",
          "Başka sitelerden hesabınız adına işlem yapılmasını engelleyen istek doğrulaması (CSRF koruması) uygulanır.",
          "Şifrenizi değiştirdiğinizde diğer cihazlardaki oturumlarınız kapatılır.",
          "Stüdyo giriş QR kodu sunucu tarafından imzalanır, 90 saniye geçerlidir ve yalnızca bir kez kullanılabilir.",
          "Veritabanına yalnızca yetkili stüdyo yöneticisi erişir; veritabanının her gün yedeği alınır ve yedekler yalnızca sunucu yöneticisinin erişebildiği alanda tutulur.",
        ]}
      />

      <H2>3. Ödeme Güvenliği</H2>
      <p>
        Kart ile ödemeler, Türkiye Cumhuriyet Merkez Bankası lisanslı ödeme kuruluşu <Strong>PayTR</Strong>&apos;ın güvenli ödeme
        sayfasında, 3D Secure doğrulamasıyla alınır. Kart numaranız, son kullanma tarihiniz ve güvenlik kodunuz Core &amp; Fit
        sunucularına ulaşmaz ve Core &amp; Fit tarafından saklanmaz. Ödemenin sonucu, PayTR&apos;ın imzalı bildirimiyle doğrulanır.
        Nakit ve havale ödemeleri stüdyo tarafından kayda alınır.
      </p>

      <H2>4. Üçüncü Taraf Hizmetler</H2>
      <List
        items={[
          <>
            <Strong>PayTR:</Strong> kart ile ödeme.
          </>,
          <>
            <Strong>{BUSINESS_CONFIG.legal.hosting}:</Strong> web sitesi ve veritabanının barındırıldığı sunucu.
          </>,
          <>
            <Strong>WhatsApp ve Instagram:</Strong> bu bağlantılara tıkladığınızda ilgili platformun kendi gizlilik politikası geçerlidir.
          </>,
          <>
            <Strong>Google Translate:</Strong> yalnızca sitede farklı bir dil seçtiğinizde devreye girer.
          </>,
          <>
            <Strong>Görsel içerik:</Strong> bazı fotoğraflar harici bir görsel sağlayıcıdan yüklenir; bu sırada tarayıcınızın IP adresi
            sağlayıcıya iletilir.
          </>,
        ]}
      />

      <H2>5. Hesabınız ve Verileriniz Üzerindeki Kontrolünüz</H2>
      <List
        items={[
          "Profil bilgilerinizi üye panelinde Hesabım bölümünden güncelleyebilirsiniz.",
          "Sağlık verisi açık rızanızı Hesabım › Kişisel Verilerim bölümünden verebilir veya geri alabilirsiniz; geri aldığınızda sağlık verileriniz silinir.",
          `Hesabınızın kapatılmasını ve verilerinizin silinmesini ${BUSINESS_CONFIG.email} adresine yazarak talep edebilirsiniz. Mevzuat gereği saklanması zorunlu kayıtlar (ör. fatura) yasal süre sonunda silinir.`,
        ]}
      />

      <H2>6. 18 Yaşından Küçükler</H2>
      <p>
        18 yaşından küçük danışanlarımızın üyelik işlemleri ve sağlık verisine ilişkin açık rızası, veli veya vasisi tarafından
        verilir.
      </p>

      <H2>7. Değişiklikler</H2>
      <p>
        Bu politikayı hizmetlerimizdeki veya mevzuattaki değişikliklere göre güncelleyebiliriz. Güncel metin her zaman bu sayfada
        yayımlanır ve sayfanın başındaki son güncelleme tarihi değişir.
      </p>
    </LegalPage>
  );
}
