import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/config/business";
import { H2, LegalPage, List, Strong, controllerName } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Açık Rıza Metni",
  description: "Core & Fit sağlık verilerinin (sağlık notu, sakatlık bilgisi, vücut ölçüleri) işlenmesine ilişkin açık rıza metni.",
  alternates: { canonical: "/acik-riza-metni" },
};

export default function AcikRizaPage() {
  return (
    <LegalPage
      title="Açık Rıza Metni"
      current="/acik-riza-metni"
      intro={
        <p>
          Sağlık verileri, KVKK 6. maddesine göre özel nitelikli kişisel veridir ve Core &amp; Fit tarafından yalnızca açık rızanızla
          işlenir. Açık rıza vermek isteğe bağlıdır. Rıza vermemeniz üyeliğinizi, randevu almanızı veya paket satın almanızı
          engellemez.
        </p>
      }
    >
      <H2>1. Rıza Verdiğiniz Veriler</H2>
      <List
        items={[
          "Sağlık notlarınız (ör. geçirilmiş ameliyat, kronik rahatsızlık, alerji)",
          "Sakatlık ve hassasiyet bilgisi (ör. bel, diz, omuz problemleri)",
          "Vücut ağırlığınız ve omuz, göğüs, bel, karın, kalça, kol ve bacak çevre ölçüleriniz",
        ]}
      />

      <H2>2. İşleme Amacı</H2>
      <List
        items={[
          "Sağlık durumunuza uygun, sakatlanma riskini azaltan ve kişiye özel antrenman planı hazırlanması",
          "Antrenörünüzün seans sırasında dikkat etmesi gereken hassasiyetleri bilmesi",
          "Vücut ölçülerinizdeki değişimin takip edilerek gelişiminizin size gösterilmesi",
        ]}
      />

      <H2>3. Kimler Erişebilir, Nerede Saklanır</H2>
      <p>
        Bu verilere yalnızca size antrenman veren yetkili antrenör ve stüdyo yöneticisi erişir. Veriler pazarlama amacıyla
        kullanılmaz ve üçüncü kişilerle paylaşılmaz. Kayıtlar, {BUSINESS_CONFIG.legal.hosting} tarafından sağlanan sunucuda şifreli
        bağlantı üzerinden erişilen, yetkisiz erişime karşı korunan veritabanında saklanır.
      </p>

      <H2>4. Rızanızı Geri Alma</H2>
      <p>
        Açık rızanızı dilediğiniz zaman üye panelinde <Strong>Hesabım › Kişisel Verilerim</Strong> bölümünden veya{" "}
        <Strong>{BUSINESS_CONFIG.email}</Strong> adresine yazarak geri alabilirsiniz. Rızanızı geri aldığınızda sağlık notlarınız,
        sakatlık bilginiz ve tüm vücut ölçümleriniz sistemden kalıcı olarak silinir ve yeni sağlık verisi kaydedilmez. Geri alma,
        o ana kadar yapılan işlemlerin hukuka uygunluğunu etkilemez.
      </p>

      <H2>5. Beyan</H2>
      <p>
        <Link href="/kvkk" className="underline text-white">
          KVKK Aydınlatma Metni
        </Link>
        &apos;ni ve bu metni okuyarak; yukarıda belirtilen sağlık verilerimin, belirtilen amaçlarla {controllerName()} tarafından
        işlenmesine, özgür irademle ve konuya ilişkin bilgilendirilmiş olarak açık rıza veriyorum. Bu rızayı üye kaydı sırasında
        veya üye panelinden verdiğimde, verildiği tarih ve saat sistemde kayıt altına alınır.
      </p>
    </LegalPage>
  );
}
