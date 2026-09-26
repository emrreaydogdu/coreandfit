# CHANGELOG: Müşteri Paneli, Admin Paneli ve Paket Revizyonu

Portal artık tarayıcı içi demo veriyle çalışmıyor. Müşteri ve admin aynı SQLite veritabanını, aynı API'yi ve aynı iş kurallarını kullanıyor. Bir tarafta yapılan değişiklik diğer tarafta bir sonraki yüklemede görünür.

## Değiştirilen Müşteri Paneli Alanları

- **Giriş / Kayıt (`/portal/giris`)**: E-posta ve parola ile gerçek oturum. Kayıt formuna "Referans Kodunuz Var mı?" alanı ve "Uygula" kontrolü eklendi. Demo giriş butonu kaldırıldı. Giriş sonrası rol kontrolü: admin `/admin`'e, üye `/portal`'a yönlenir.
- **Üst menü**: "Siteye dön" bağlantıları yerine sekme geçmişini izleyen "Geri Dön" butonu. Mobilde yalnızca ok ikonu görünür. Admin bağlantısı yalnızca admin rolüne görünür. Sahte doluluk göstergesi kaldırıldı.
- **Özet**: Yaklaşan seans kartı durum rozetiyle gösterilir ("İlker Yüksel ile Üst Vücut"). Dijital kart ve ders hakkı göstergesi gerçek bakiyeyi okur. Paketi olmayan üyede "Henüz paket yok" yazar. Vücut ağırlığı özeti, Hediye kartı ve Referanslarım kartı eklendi.
- **Program**: Yalnızca gün ve antrenman tipi (Üst Vücut / Alt Vücut / Tam Vücut).
- **Seanslar**: 3 adımlı sihirbaz (gün, saat, antrenman tipi). Saatler koçun admin panelindeki çalışma programından gelir. Randevu "Onay Bekliyor" olarak oluşur. Liste durum rozetleri gösterir.
- **Gelişim** (eski "Biyometri & PR"): Vücut Ağırlığı (ilk / güncel / değişim), "Vücut Ölçülerim" penceresi (9 ölçü için İlk / Güncel / Fark), Ölçüm Geçmişi ve ölçüm ekleme. Seans geçmişi koç notu göstermez.
- **Paketler**: Yeni fiyatlar, referans indirimi aktifse üstü çizili eski fiyat ve ders başı fiyat. Düet Ders ayrı pencerede.
- **Ödeme ekranı**: POS seçeneği kaldırıldı. Tutar merkezi fiyat fonksiyonundan gelir. Online kart "Yakında" olarak kapalı (bkz. Manuel Kontrol).
- **Hesabım**: Parola değiştirme eklendi. Sahte varsayılan bilgiler kaldırıldı.
- **Hata sayfası**: "Oturumu Sıfırla" artık sunucu oturumunu kapatır.

## Değiştirilen Admin Paneli Alanları

- **Genel Bakış**: KPI'lar gerçek veriden hesaplanır (bugünkü seans, onay bekleyen, bu ay tahsilat, bekleyen ödeme). "Onay Bekleyen Randevular" listesi Onayla / İptal Et butonlarıyla. Yaklaşan onaylı randevular Ertele / İptal ve Tamamla ile.
- **Turnike & QR**: QR okuyucu üye numarasıyla sunucuda giriş işler. Bugün onaylı randevusu varsa tamamlar, yoksa bir ders düşer. Sahte test butonu kaldırıldı. Kamera döngüsü yeniden yazıldı.
- **Seans Programı**: Takvim durum ve antrenman tipini gösterir. Saatler koç programından gelir. Onay bekleyen randevu takvimden onaylanabilir.
- **Randevu Saatleri**: İptal edilen randevular dolu sayılmaz. Tek koç için sabit seçim.
- **Kasa**: POS kaldırıldı. Hızlı satış yalnızca nakit ve havale, merkezi fiyat ve isteğe bağlı ek indirimle.
- **Üyeler**: Üye detayında durum, ders hakkı ekleme / düşme, program düzenleyici, Vücut Ölçümleri, hediyeler, referans kodu açma / kapama ve yalnızca admine görünen iç notlar. Yeni üye oluşturulunca geçici parola gösterilir.
- **Referanslar** (yeni sekme): Davet eden, kod, kullanan, başarılı, indirim durumu, kayıt olanlar ve "Geçersiz Kıl".
- **WhatsApp hatırlatma**: Yeni sade şablon.
- **İşletme Ayarları**: "Kişi / İstasyon" etiketi "Kişi" oldu.

## Kaldırılan Özellikler

- Antrenman türü listesi (Üst / Alt / Tam Vücut dışındakiler) ve müşteri tarafındaki "Antrenman Türü" / "Koçun Seans Notu" alanları
- PR takibi, Tanita / InBody verileri
- POS ödeme yöntemi
- Misafir davet, baş koç bannerı
- Admin günlük brifing ve kontrol listesi (`AdminDailyBriefingWidget.tsx`)
- İstasyon sterilizasyonu ve nabız bandı takibi
- Envanter sekmesi (`AdminInventoryTab.tsx`)
- Su takibi, rozetler ve sahte haftalık matris
- Tüm localStorage tabanlı demo veri akışı ve demo giriş

## Eklenen Yeni Özellikler

- SQLite veritabanı ve Next.js route handler API'si (`app/api/*`)
- Parola tabanlı oturum (scrypt hash, httpOnly `cf_session` çerezi, sunucuda tutulan oturum kaydı)
- Referans sistemi, Referanslarım kartı ve admin referans takibi
- Randevu onay akışı
- Vücut Ölçülerim penceresi ve ölçüm geçmişi
- Hediye kartı (admin hediye tanımlar, üye görür)
- Herkese açık `/paketler` sayfasında yeni paket kartları ve Düet penceresi. Kart seçimi teklif formunu doldurur.
- Ön görüşme sihirbazı artık veritabanına yazmaz. Talep WhatsApp ile gönderilir.

## Randevu Onay Sistemi

| Durum | Etiket | Kim oluşturur / değiştirir |
|---|---|---|
| `PENDING` | Onay Bekliyor | Üyenin oluşturduğu her randevu |
| `CONFIRMED` | Onaylandı | Admin "Onayla" der ya da randevuyu admin oluşturur |
| `CANCELLED` | İptal Edildi | Üye veya admin iptal eder, ders hakkı iade edilir |
| `COMPLETED` | Tamamlandı | Admin "Tamamla" der ya da QR ile giriş yapılır |

- Randevu oluşturulurken ders hakkı sunucuda 1 düşer. İptalde iade edilir.
- Müsaitlik sunucuda kontrol edilir: dolu saat, kapalı saat, çalışılmayan gün, mola ve geçmiş saat reddedilir. Aynı saate ikinci randevu `409` döner.
- Onay bekleyen ve onaylı randevular saati dolu tutar.

## Referans Sistemi

- Her üyeye kayıtta benzersiz kod üretilir: `CORE-<ADIN İLK 6 HARFİ><3 RAKAM>`, örnek `CORE-EGE721`. Kod büyük / küçük harf duyarsızdır.
- Kayıtta geçerli kod girilirse davet edilen üyenin indirimi hemen ve kalıcı olarak açılır.
- Davet eden üyenin indirimi, en az 1 başarılı referansı olduğunda açılır. Başarılı referans: kodla kayıt olmuş ve durumu "Pasif" olmayan üye.
- Güvenlik: Kişi kendi kodunu kullanamaz. Davet eden sonradan değiştirilemez (yalnızca kayıtta yazılır). Admin tarafından geçersiz kılınan kod "bulunamadı" sayılır. Kod kontrolü kod sahibinin bilgisini döndürmez.
- Mesajlar: "Referans kodu bulunamadı." ve "Referans kodu uygulandı. Paketlerde %10 avantaj kazandınız."
- İndirim tutarı her zaman sunucuda hesaplanır. İstemcinin gönderdiği fiyat dikkate alınmaz.

## Paket ve Fiyat Değişiklikleri

| Paket | Ders | Geçerlilik | Fiyat | Referans indirimi | Esnek İptal (24 Saat) |
|---|---|---|---|---|---|
| Tek Ders | 1 | 30 gün | 3.000 TL | Yok | Yok |
| 10 Ders | 10 | 60 gün | 15.000 TL | %10 → 13.500 TL | Yok |
| 20 Ders | 20 | 90 gün | 28.000 TL | %10 → 25.200 TL | Var |
| 30 Ders | 30 | 120 gün | 36.000 TL | %10 → 32.400 TL | Var |
| Düet 10 Ders | 10 (2 kişi) | | 20.000 TL | Yok | Yok |
| Düet 20 Ders | 20 (2 kişi) | | 38.000 TL | Yok | Yok |
| Düet 30 Ders | 30 (2 kişi) | | 56.000 TL | Yok | Yok |

- Tek katalog: `data/packages.ts`. Merkezi fiyat: `lib/pricing.ts` (`basePrice × 0,90` indirim aktifse).
- Paket özellikleri sadeleştirildi. "Esnek İptal / Değiştirme Hakkı (24 Saat)" yalnızca 20 ve 30 Ders'te.

## Database / Schema Değişiklikleri

Veritabanı: `node:sqlite` (Node ≥ 22.13), WAL modu, foreign key açık. Dosya yolu `DATABASE_PATH` (varsayılan `./.data/coreandfit.sqlite`, git dışında).

| Tablo | Önemli alanlar |
|---|---|
| `members` | `member_no` UNIQUE, `role` (member / admin), `email` UNIQUE, `status` (Aktif / Yenileme Bekliyor / Pasif), ders bakiyesi, `referral_code` UNIQUE, `referred_by_id` FK, `referral_code_disabled`, `program_json`, `profile_json`, `password_hash` |
| `auth_sessions` | Token'ın sha256 özeti, üye FK, bitiş zamanı |
| `bookings` | `workout_type` (UPPER / LOWER / FULL), `status` (PENDING / CONFIRMED / CANCELLED / COMPLETED), `member_note`, `internal_note`, `credit_deducted`, `created_by` |
| `measurements` | Kilo ve 9 çevre ölçüsü, not |
| `orders` | Taban fiyat, indirim oranı, tutar, `payment_method` (online_card / cash_register / bank_transfer), `payment_status` |
| `gifts` | Üyeye veya herkese hediye, durum |
| `settings` | Stüdyo ayarları, koç programı, kapalı saatler (JSON) |

Ortam değişkenleri `.env.example` içinde: `ADMIN_EMAIL`, `ADMIN_PASSWORD` (ilk açılışta admin hesabı), `DATABASE_PATH`, `SEED_DEMO` ve `DEMO_MEMBER_PASSWORD` (yalnızca demo), `COOKIE_SECURE`.

## Değiştirilen Dosyalar

**Yeni**
- `app/api/**` (auth, me, availability, admin uç noktaları: 22 route)
- `lib/server/db.ts`, `lib/server/auth.ts`, `lib/server/password.ts`, `lib/server/repo.ts`
- `lib/training.ts`, `lib/pricing.ts`, `lib/slots.ts`, `lib/measurements.ts`, `lib/format.ts`
- `components/packages/PublicPackageGrid.tsx`, `components/packages/DuetModal.tsx`
- `components/portal/ReferralCard.tsx`, `components/portal/admin/AdminGate.tsx`
- `.env.example`, `CHANGELOG.md`

**Değişen**
- `app/admin/page.tsx`, `app/portal/page.tsx`, `app/portal/admin/page.tsx`, `app/portal/giris/page.tsx`, `app/portal/error.tsx`, `app/paketler/page.tsx`
- `context/MemberContext.tsx`, `types/portal.ts`, `data/packages.ts`, `data/portal-mock.ts`
- `components/portal/`: `PortalLayout`, `CheckoutModal`, `DigitalPassCard`, `QuickQrModal`, `SessionRingGauge`, `tabs/*` (Dashboard, Workout, Sessions, History, Store, Profile)
- `components/portal/admin/`: `AdminPortal`, `AdminFloatingNav`, `AdminScheduleCalendarTable`, `AdminCoachSlotsTab`, `AdminMemberDetailModal`, `AdminCreateMemberModal`, `AdminCreateSessionModal`, `AdminSessionActionModal`, `AdminQuickSaleModal`, `AdminQrScannerModal`, `AdminWhatsAppModal`, `AdminStudioSettingsTab`
- `components/booking/BookingWizard.tsx`, `components/forms/PackageInquiryForm.tsx`
- `package.json`, `package-lock.json` (`@types/node` ^22), `.gitignore` (`/.data/`, `!.env.example`)

**Silinen**
- `components/portal/admin/AdminDailyBriefingWidget.tsx`
- `components/portal/admin/AdminInventoryTab.tsx`

## Test Sonuçları

- **TypeScript** (`tsc --noEmit`): hata yok.
- **ESLint**: revizyonda dokunulan tüm dosyalarda hata ve uyarı yok (yalnızca mevcut `<img>` performans uyarıları).
- **Build** (`next build`): başarılı, 56 sayfa üretildi, 22 API route dinamik.
- **API uçtan uca testi**: 38 / 38 geçti. Kapsam: oturumsuz erişim (401 / 403), yanlış parola, referans kodu (bilinmeyen, büyük / küçük harf, kendi kodu, geçersiz kılınmış kod), referansla kayıt, kod formatı, sunucu tarafı fiyat (13.500 TL), Düet'te indirim olmaması, online kartın reddi, admin sipariş onayı, randevu oluşturma (PENDING), çift randevu reddi, geçersiz antrenman tipi reddi, admin onayı (CONFIRMED), üye iptali ve ders iadesi, ölçüm ekleme, çıkış, iç notun üyeye sızmaması.
- **Tarayıcı (mobil 375 px ve masaüstü)**: kayıt + referans mesajları, Özet, Paketler (indirimli fiyatlar), Düet penceresi, randevu sihirbazı (Onay Bekliyor, ders hakkı 10 → 9), admin onayı, Referanslar sekmesi, herkese açık `/paketler`, ödeme ekranı. Konsolda hata yok.

## Manuel Kontrol Edilmesi Gereken Noktalar

1. **Online kart ödemesi kapalı.** Gerçek bir ödeme sağlayıcısı (iyzico, PayTR vb.) bağlanana kadar sunucu online kart siparişini reddeder. Önceki halde bu seçenek tahsilat olmadan siparişi "ödendi" sayıyordu. Entegrasyon sonrası `lib/server/repo.ts` içindeki `ONLINE_CARD_ENABLED` açılmalı ve ödeme onayı sağlayıcının callback'ine bağlanmalı.
2. **Nakit ve havale siparişlerinde ders hakkı hemen tanımlanır**, ödeme admin onayına kadar "Bekleyen Ödeme" olarak görünür. Bu iş kuralı istenmiyorsa hak tanımı onaya bağlanabilir.
3. **Canlı ortam değişkenleri**: güçlü bir `ADMIN_PASSWORD` belirleyin, `SEED_DEMO=0` bırakın, HTTPS arkasında `COOKIE_SECURE=1` kalsın.
4. **Sunucu Node sürümü** en az 22.13 olmalı (`node:sqlite`).
5. **Veritabanı yedeği**: `DATABASE_PATH` kalıcı bir klasörde olmalı ve düzenli yedeklenmeli.
6. **Admin hesabı** ilk açılışta "İlker Yüksel" adıyla oluşturulur. Koç ve yönetici farklı kişilerse ad `lib/server/db.ts` içinden değiştirilmeli.
7. **Mevcut demo verisi**: localStorage'daki eski demo kayıtları taşınmadı. Gerçek üyeler admin panelinden eklenmeli ya da kayıt olmalı.
8. **Revizyon dışında kalan lint hataları**: `LanguageSwitcher`, `ConsultationFunnel`, `Header.apple`, `Header.classic`, `DesignModeProvider`, `ThemeProvider` dosyalarında önceden var olan `set-state-in-effect` hataları duruyor. Build'i engellemiyorlar.
9. **QR giriş**: Kamera izni ve gerçek cihazda okuma stüdyoda denenmeli.
10. **WhatsApp şablonları** gerçek numarayla bir kez gönderilip metin kontrol edilmeli.
