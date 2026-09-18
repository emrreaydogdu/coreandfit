"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Save,
  Activity,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { StudioBankAccount } from "@/types/portal";

export const AdminStudioSettingsTab: React.FC = () => {
  const {
    studioSettings,
    updateStudioSettings,
    addStudioBankAccount,
    removeStudioBankAccount,
  } = useMember();

  // Local editing states for form
  const [formData, setFormData] = useState({
    studioName: studioSettings.studioName,
    legalTitle: studioSettings.legalTitle,
    address: studioSettings.address,
    phone: studioSettings.phone,
    whatsapp: studioSettings.whatsapp,
    email: studioSettings.email,
    maxCapacity: studioSettings.maxCapacity,
    turnstileRelayDelay: studioSettings.turnstileRelayDelay,
    qrRefreshSeconds: studioSettings.qrRefreshSeconds,
    autoDeductOnTurnstile: studioSettings.autoDeductOnTurnstile,
    weekdayHours: studioSettings.weekdayHours,
    weekendHours: studioSettings.weekendHours,
  });

  // New bank account state
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBank, setNewBank] = useState<Omit<StudioBankAccount, "id">>({
    bankName: "",
    accountHolder: studioSettings.legalTitle,
    iban: "",
    branch: "",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudioSettings({
      studioName: formData.studioName,
      legalTitle: formData.legalTitle,
      address: formData.address,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      maxCapacity: Number(formData.maxCapacity),
      turnstileRelayDelay: Number(formData.turnstileRelayDelay),
      qrRefreshSeconds: Number(formData.qrRefreshSeconds),
      autoDeductOnTurnstile: formData.autoDeductOnTurnstile,
      weekdayHours: formData.weekdayHours,
      weekendHours: formData.weekendHours,
    });

    setToastMessage("İşletme ayarları başarıyla kaydedildi ve stüdyo sistemine uygulandı.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.bankName || !newBank.iban) return;

    addStudioBankAccount(newBank);
    setNewBank({
      bankName: "",
      accountHolder: studioSettings.legalTitle,
      iban: "",
      branch: "",
    });
    setIsAddingBank(false);
    setToastMessage("Yeni banka hesabı başarıyla eklendi.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Studio Profile & Contact */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base uppercase text-[#0F172A]">
                Stüdyo Kimliği & İletişim Bilgileri
              </h3>
              <p className="text-xs text-[#64748B]">
                Müşterilerin gördüğü stüdyo unvanı, fatura bilgileri ve irtibat kanalları.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                STÜDYO GÖRÜNEN ADI
              </label>
              <input
                type="text"
                required
                value={formData.studioName}
                onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                RESMİ ŞİRKET UNVANI
              </label>
              <input
                type="text"
                required
                value={formData.legalTitle}
                onChange={(e) => setFormData({ ...formData, legalTitle: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                STÜDYO ADRESİ & ŞUBE KONUMU
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                SABİT TELEFON HATTI
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                WHATSAPP DANIŞMA HATTI
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                BİLGİ & DESTEK E-POSTA
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Turnstile & Capacity Hardware Config */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base uppercase text-[#0F172A]">
                Turnike Donanımı & Kapasite Parametreleri
              </h3>
              <p className="text-xs text-[#64748B]">
                Stüdyo anlık doluluk tavanı, turnike röle gecikmesi ve dinamik QR döngüsü.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl space-y-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block">
                EŞZAMANLI MAKSİMUM KAPASİTE
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                  className="w-20 p-2 bg-white border border-black/[0.08] rounded-xl text-sm font-bold text-[#0F172A] text-center"
                />
                <span className="text-xs text-[#64748B] font-medium">Kişi / İstasyon</span>
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                Stüdyodaki toplam antrenman istasyonu adedi.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl space-y-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block">
                TURNİKE RÖLE SÜRESİ
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.turnstileRelayDelay}
                  onChange={(e) => setFormData({ ...formData, turnstileRelayDelay: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs font-bold text-[#0F172A]"
                >
                  <option value={3}>3 Saniye (Hızlı)</option>
                  <option value={5}>5 Saniye (Önerilen)</option>
                  <option value={8}>8 Saniye (Geniş Kapı)</option>
                  <option value={10}>10 Saniye</option>
                </select>
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                QR okunduktan sonra kapının açık kalma süresi.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl space-y-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block">
                DİNAMİK TOTP QR SÜRESİ
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.qrRefreshSeconds}
                  onChange={(e) => setFormData({ ...formData, qrRefreshSeconds: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs font-bold text-[#0F172A]"
                >
                  <option value={30}>30 Saniye</option>
                  <option value={60}>60 Saniye (Standart)</option>
                  <option value={90}>90 Saniye</option>
                </select>
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                Üye ekranında QR kodunun otomatik yenilenme sıklığı.
              </p>
            </div>
          </div>

          {/* Auto Deduct Switch */}
          <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[#0F172A]">
                Turnike Geçişinde Otomatik Seans Düşümü
              </div>
              <p className="text-[11px] text-[#64748B]">
                Aktif olduğunda kameradan QR kod okutulduğu an üyenin kalan seans bakiyesinden 1 hak düşülür.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoDeductOnTurnstile}
                onChange={(e) => setFormData({ ...formData, autoDeductOnTurnstile: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Section 3: Operating Hours */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base uppercase text-[#0F172A]">
                Stüdyo Çalışma Saatleri
              </h3>
              <p className="text-xs text-[#64748B]">
                Tesisin üyelere ve antrenörlere açık olduğu resmi operasyon saatleri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                HAFTA İÇİ (PAZARTESİ - CUMA)
              </label>
              <input
                type="text"
                required
                value={formData.weekdayHours}
                onChange={(e) => setFormData({ ...formData, weekdayHours: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]"
                placeholder="Örn: 07:00 - 22:00"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                HAFTA SONU (CUMARTESİ - PAZAR)
              </label>
              <input
                type="text"
                required
                value={formData.weekendHours}
                onChange={(e) => setFormData({ ...formData, weekendHours: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]"
                placeholder="Örn: 08:30 - 20:00"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Bank Accounts (IBAN) Management */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base uppercase text-[#0F172A]">
                  Havale & EFT Banka Hesapları
                </h3>
                <p className="text-xs text-[#64748B]">
                  Üyelerin paket alımlarında havale seçtiklerinde görecekleri resmi IBAN bilgileri.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingBank(!isAddingBank)}
              className="px-3.5 py-2 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Yeni Banka Hesabı Ekle</span>
            </button>
          </div>

          {/* New Bank Form Inline */}
          {isAddingBank && (
            <div className="p-4 bg-slate-50 border border-black/[0.08] rounded-2xl space-y-3">
              <div className="font-bold text-xs uppercase text-[#0F172A]">
                Yeni Banka / IBAN Kaydı
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Banka Adı
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Garanti BBVA"
                    value={newBank.bankName}
                    onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Şube Bilgisi
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Nişantaşı Şubesi"
                    value={newBank.branch}
                    onChange={(e) => setNewBank({ ...newBank, branch: e.target.value })}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    Hesap Sahibi
                  </label>
                  <input
                    type="text"
                    required
                    value={newBank.accountHolder}
                    onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    IBAN Numarası
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="TR..."
                    value={newBank.iban}
                    onChange={(e) => setNewBank({ ...newBank, iban: e.target.value })}
                    className="w-full p-2 bg-white border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBank(false)}
                  className="px-3 py-1.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleAddBankSubmit}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors"
                >
                  Hesabı Kaydet
                </button>
              </div>
            </div>
          )}

          {/* Bank accounts list */}
          <div className="space-y-2.5">
            {studioSettings.bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black/[0.08] transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0F172A]">{acc.bankName}</span>
                    <span className="text-[10px] text-[#64748B]">({acc.branch})</span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-[#334155] mt-1 select-all">
                    {acc.iban}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Alıcı: {acc.accountHolder}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleCopyIban(acc.iban)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-black/[0.08] text-[11px] font-semibold text-[#0F172A] hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    {copiedIban === acc.iban ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                    )}
                    <span>{copiedIban === acc.iban ? "Kopyalandı" : "Kopyala"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeStudioBankAccount(acc.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Bu hesabı kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg active:scale-98 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Tüm İşletme Ayarlarını Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
};
