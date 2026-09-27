import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/config/business";
import { H2, LegalPage, List, Strong, Table, controllerAddress, controllerName } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Core & Fit Private Sport Studio 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni: işlenen veriler, amaçlar, hukuki sebepler, aktarım, saklama süreleri ve haklarınız.",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      current="/kvkk"
      intro={
        <p>
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) 10. maddesi ve Aydınlatma Yükümlülüğünün
          Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, <Strong>{controllerName()}</Strong> (&ldquo;Core
          &amp; Fit&rdquo;) tarafından veri sorumlusu sıfatıyla hazırlanmıştır. Web sitemizi, üye panelimizi ve stüdyo hizmetlerimizi
          kullanan danışanlarımızın, üyelerimizin ve ziyaretçilerimizin kişisel verilerinin nasıl işlendiğini açıklar.
        </p>
      }
    >
      <H2>1. Veri Sorumlusu</H2>
      <p>
        Veri sorumlusu: <Strong>{controllerName()}</Strong>, {controllerAddress()}. İletişim: {BUSINESS_CONFIG.email},{" "}
        {BUSINESS_CONFIG.phone}.
      </p>

      <H2>2. İşlenen Kişisel Veriler</H2>
      <Table
        head={["Veri kategorisi", "Veriler"]}
        rows={[
          ["Kimlik", "Ad, soyad; isteğe bağlı olarak doğum tarihi"],
          ["İletişim", "Telefon numarası, e-posta adresi; isteğe bağlı olarak adres ve acil durumda aranacak kişi"],
          [
            "Müşteri işlem",
            "Üye numarası, satın alınan paket ve kalan ders hakkı, randevu tarih ve saatleri, antrenman tipi ve haftalık program, randevuya eklediğiniz not, stüdyo giriş kayıtları, referans kodu ve davet ilişkisi, tanımlanan hediye ve avantajlar",
          ],
          [
            "Finans",
            "Sipariş tutarı, uygulanan indirim, ödeme yöntemi ve durumu, ödeme kuruluşu sipariş numarası. Kart numarası, son kullanma tarihi ve güvenlik kodu Core & Fit tarafından görülmez ve saklanmaz; kart ile ödeme PayTR'ın güvenli ödeme sayfasında yapılır.",
          ],
          [
            "İşlem güvenliği",
            "Şifrenizin geri döndürülemez özeti (şifrenin kendisi saklanmaz), oturum kayıtları, IP adresi, güvenlik amaçlı giriş denemesi sayaçları, ödeme bildirim kayıtları",
          ],
          [
            <>
              Özel nitelikli kişisel veri (sağlık)
            </>,
            <>
              Sağlık notları, sakatlık ve hassasiyet bilgisi, vücut ağırlığı ve vücut çevre ölçüleri. <Strong>Bu veriler yalnızca açık rızanız ile işlenir</Strong> (bkz.{" "}
              <Link href="/acik-riza-metni" className="underline text-white">
                Açık Rıza Metni
              </Link>
              ).
            </>,
          ],
          ["Talep ve şikâyet", "İletişim, ön görüşme ve paket teklif formlarında ilettiğiniz mesaj, hedef ve zaman tercihleri"],
        ]}
      />

      <H2>3. İşleme Amaçları</H2>
      <List
        items={[
          "Üyelik hesabınızın oluşturulması ve yönetilmesi, kimlik doğrulama",
          "1:1 antrenman hizmetinin sunulması: randevu planlama, onay, iptal ve erteleme, stüdyo girişlerinin kaydı",
          "Paket satışı, ödeme ve tahsilat süreçlerinin yürütülmesi, fatura ve muhasebe kayıtlarının tutulması",
          "Referans (Arkadaşını Getir) programının yürütülmesi ve indirimlerin uygulanması",
          "Açık rızanız varsa sağlık durumunuza uygun, güvenli ve kişiye özel antrenman planı hazırlanması, gelişiminizin takibi",
          "Randevu hatırlatması, paket yenileme ve hizmetle ilgili bilgilendirme amacıyla sizinle iletişime geçilmesi",
          "Bilgi güvenliğinin sağlanması, yetkisiz erişim ve kötüye kullanımın önlenmesi",
          "Talep ve şikâyetlerinizin yanıtlanması, hukuki uyuşmazlıklarda hakların korunması",
          "Yetkili kurum ve kuruluşların mevzuattan doğan bilgi taleplerinin karşılanması",
        ]}
      />

      <H2>4. Hukuki Sebepler</H2>
      <Table
        head={["Hukuki sebep (KVKK)", "Kapsadığı işleme"]}
        rows={[
          ["m.5/2-c: Sözleşmenin kurulması ve ifası", "Üyelik, randevu, paket, ödeme, giriş kaydı, iletişim ve hatırlatmalar"],
          ["m.5/2-ç: Hukuki yükümlülük", "Fatura, muhasebe ve vergi kayıtları, yetkili kurumlara bilgi verilmesi"],
          ["m.5/2-e: Bir hakkın tesisi, kullanılması veya korunması", "Ödeme ve sipariş kayıtları, uyuşmazlık durumunda delil olarak saklanan kayıtlar"],
          ["m.5/2-f: Meşru menfaat", "Bilgi güvenliği kayıtları, deneme sınırlama, referans programının kötüye kullanımının önlenmesi"],
          ["m.6/2: Açık rıza", "Sağlık notları, sakatlık bilgisi ve vücut ölçüleri"],
        ]}
      />

      <H2>5. Toplama Yöntemi</H2>
      <p>
        Kişisel verileriniz; web sitemizdeki formlar ve üye paneli aracılığıyla elektronik ortamda, stüdyoda antrenörünüz tarafından
        panele girilen bilgilerle, WhatsApp veya telefon üzerinden bizimle kurduğunuz iletişimle ve kart ödemelerinde ödeme kuruluşunun
        sistemimize gönderdiği ödeme sonucu bildirimiyle, kısmen otomatik yollarla toplanır.
      </p>

      <H2>6. Kişisel Verilerin Aktarılması</H2>
      <Table
        head={["Alıcı", "Aktarılan veri ve amaç"]}
        rows={[
          [
            "PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş. (yurt içi)",
            "Kart ile ödemede ad soyad, e-posta, telefon, adres, IP adresi, sipariş tutarı ve paket adı; ödemenin alınması ve dolandırıcılığın önlenmesi amacıyla",
          ],
          [
            `${BUSINESS_CONFIG.legal.hosting} (yurt dışı)`,
            "Web sitesi ve üye paneli verilerinin barındırılması. Sunucu Almanya'dadır; aktarım KVKK m.9'da öngörülen şartlara uygun olarak yapılır.",
          ],
          ["Yetkili kamu kurum ve kuruluşları", "Mevzuatın gerektirdiği hallerde ve talep edilen ölçüde"],
          ["Muhasebe ve hukuk danışmanları", "Sır saklama yükümlülüğü altında, mali ve hukuki süreçlerin yürütülmesi için gerekli ölçüde"],
          [
            "WhatsApp (Meta Platforms)",
            "Yalnızca WhatsApp üzerinden bize yazmayı veya talebinizi WhatsApp ile göndermeyi seçtiğinizde, ilettiğiniz mesaj içeriği",
          ],
          [
            "Google Translate (Google)",
            "Yalnızca sitede farklı bir dil seçtiğinizde, çevrilmek üzere sayfa içeriği ve teknik bağlantı bilgileri",
          ],
        ]}
      />
      <p>Kişisel verileriniz pazarlama amacıyla üçüncü kişilerle paylaşılmaz ve satılmaz.</p>

      <H2>7. Saklama Süreleri</H2>
      <Table
        head={["Veri", "Saklama süresi"]}
        rows={[
          ["Üyelik, randevu ve giriş kayıtları", "Üyelik süresince ve üyeliğin sona ermesinden itibaren genel zamanaşımı süresi olan 10 yıl"],
          ["Sipariş, ödeme ve fatura kayıtları", "Vergi ve ticaret mevzuatı gereği 10 yıl"],
          ["Sağlık notları ve vücut ölçüleri", "Açık rıza geri alınana veya üyelik sona erene kadar; sonrasında en geç 6 ay içinde silinir"],
          ["Oturum kayıtları", "Üyeler için 30 gün, yöneticiler için 12 saat; süre dolunca silinir"],
          ["Form mesajları", "Talebin sonuçlanmasından itibaren 2 yıl"],
        ]}
      />
      <p>Süresi dolan veriler silinir, yok edilir veya anonim hale getirilir.</p>

      <H2>8. KVKK m.11 Kapsamındaki Haklarınız</H2>
      <List
        items={[
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "İşlenmişse buna ilişkin bilgi talep etme",
          "İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme ve bu işlemin aktarılan üçüncü kişilere bildirilmesini isteme",
          "KVKK m.7'deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme ve bu işlemin aktarılan üçüncü kişilere bildirilmesini isteme",
          "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
          "Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
        ]}
      />

      <H2>9. Başvuru Yöntemi</H2>
      <p>
        Haklarınıza ilişkin taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca; ad soyad, T.C. kimlik
        numarası (yabancılar için pasaport numarası), tebligata esas adres, varsa e-posta ve telefon bilgileri ile talep konunuzu içeren
        yazılı bir dilekçeyle {controllerAddress()} adresine elden veya noter aracılığıyla, ya da sistemimizde kayıtlı e-posta
        adresinizden <Strong>{BUSINESS_CONFIG.email}</Strong> adresine iletebilirsiniz
        {BUSINESS_CONFIG.legal.kepAddress ? `; kayıtlı elektronik posta (KEP) ile ${BUSINESS_CONFIG.legal.kepAddress} adresine de başvurabilirsiniz` : ""}.
      </p>
      <p>
        Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel
        Verileri Koruma Kurulunca belirlenen tarifedeki ücret alınabilir. Başvurunuzun reddedilmesi, verilen cevabı yetersiz
        bulmanız veya süresinde cevap verilmemesi hâllerinde Kişisel Verileri Koruma Kurulu&apos;na şikâyette bulunabilirsiniz.
      </p>
      <p>
        Üye panelinde Hesabım › Kişisel Verilerim bölümünden sağlık verisi açık rızanızı dilediğiniz zaman verebilir veya geri
        alabilirsiniz.
      </p>
    </LegalPage>
  );
}
