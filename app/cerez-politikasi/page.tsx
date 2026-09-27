import React from "react";
import type { Metadata } from "next";
import { H2, LegalPage, List, Table } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Core & Fit web sitesinde kullanılan çerezler ve tarayıcı depolama alanları: türleri, amaçları ve süreleri.",
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      current="/cerez-politikasi"
      intro={
        <>
          <p>
            Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Bu sayfa, Core &amp; Fit
            web sitesinde ve üye panelinde kullanılan çerezleri ve tarayıcı depolama alanlarını listeler.
          </p>
          <p>
            <strong className="text-white">Sitede analitik, reklam veya kullanıcı takibi amaçlı çerez kullanılmaz.</strong> Kullanılan
            çerezler, sitenin çalışması veya sizin seçtiğiniz bir özelliğin (ör. dil tercihi) uygulanması için gereklidir.
          </p>
        </>
      }
    >
      <H2>1. Zorunlu Çerezler</H2>
      <Table
        head={["Ad", "Amaç", "Süre"]}
        rows={[
          [
            "__Host-cf_session",
            "Üye paneline giriş yaptığınızda oturumunuzu tanır. JavaScript ile okunamaz, yalnızca HTTPS üzerinden ve yalnızca bu siteye gönderilir.",
            "Üyelerde 30 gün, yöneticilerde 12 saat veya çıkış yapana kadar",
          ],
        ]}
      />
      <p>Zorunlu çerezler olmadan üye paneline giriş yapılamaz; bu çerezler için ayrıca onay alınmaz.</p>

      <H2>2. Tercih ve İşlev Çerezleri</H2>
      <Table
        head={["Ad", "Amaç", "Süre"]}
        rows={[
          ["googtrans", "Yalnızca sitede farklı bir dil seçtiğinizde kurulur ve seçtiğiniz dili hatırlar.", "Tarayıcı oturumu"],
          [
            "Google Translate çerezleri (üçüncü taraf)",
            "Farklı bir dil seçtiğinizde çeviri hizmetini sunan Google tarafından kurulabilir.",
            "Google'ın belirlediği süre",
          ],
        ]}
      />

      <H2>3. Tarayıcı Depolama Alanı (localStorage)</H2>
      <p>Aşağıdaki tercihler yalnızca cihazınızda tutulur ve sunucumuza gönderilmez:</p>
      <Table
        head={["Anahtar", "Amaç"]}
        rows={[
          ["coreandfit_theme", "Açık veya koyu tema tercihiniz"],
          ["coreandfit_design_mode", "Seçtiğiniz site görünümü"],
          ["cf_member_view_mode", "Üye panelinin görüntülenme biçimi"],
        ]}
      />

      <H2>4. Ödeme Sayfası</H2>
      <p>
        Kart ile ödeme yaptığınızda açılan ödeme penceresi PayTR&apos;a aittir. Bu pencerede PayTR, ödeme güvenliği için kendi alan
        adında çerez kullanabilir; bu çerezler PayTR&apos;ın politikalarına tabidir.
      </p>

      <H2>5. Çerezleri Yönetme</H2>
      <List
        items={[
          "Tarayıcınızın ayarlarından çerezleri görüntüleyebilir, silebilir veya engelleyebilirsiniz.",
          "Zorunlu oturum çerezini engellerseniz üye paneline giriş yapamazsınız.",
          "Dil tercihini sıfırlamak için sitedeki dil seçiciden Türkçe'yi seçmeniz yeterlidir.",
        ]}
      />
    </LegalPage>
  );
}
