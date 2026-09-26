"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  Receipt,
  LogOut,
  HeartPulse,
  FileText,
  CheckCircle2,
  Calendar,
  MapPin,
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  X,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMember } from "@/context/MemberContext";
import { formatTL } from "@/lib/pricing";
import { formatDateMedium } from "@/lib/format";
import type { PaymentMethod } from "@/types/portal";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  online_card: "Online Kart",
  cash_register: "Stüdyoda Nakit",
  bank_transfer: "Havale / FAST",
};

export const ProfileTab: React.FC = () => {
  const {
    user,
    orders,
    logout,
    updateUserProfile,
    addSavedCard,
    removeSavedCard,
    setDefaultCard,
    updateAddress,
    changePassword,
  } = useMember();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  // Form states - Profile
  const [editFullName, setEditFullName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editBirthDate, setEditBirthDate] = useState(user?.birthDate || "");
  const [editEmergency, setEditEmergency] = useState(user?.emergencyContact || "");
  const [editHealth, setEditHealth] = useState(user?.healthNotes || "");

  // Form states - Card
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardBrand, setNewCardBrand] = useState<"visa" | "mastercard">("mastercard");

  // Form states - Address
  const [addressTitle, setAddressTitle] = useState(user?.address?.title || "Ev Adresi");
  const [addressStreet, setAddressStreet] = useState(user?.address?.street || "");
  const [addressDistrict, setAddressDistrict] = useState(user?.address?.district || "");
  const [addressCity, setAddressCity] = useState(user?.address?.city || "İstanbul");
  const [addressPostal, setAddressPostal] = useState(user?.address?.postalCode || "");

  // Şifre değiştirme
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!user) return null;

  const handleDownloadReceipt = (orderNo: string) => {
    setDownloadSuccess(orderNo);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: editFullName,
      phone: editPhone,
      birthDate: editBirthDate,
      emergencyContact: editEmergency,
      healthNotes: editHealth,
    });
    setIsEditProfileOpen(false);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = newCardNumber.replace(/\s+/g, "");
    const last4 = cleanNumber.slice(-4) || "4242";
    addSavedCard({
      last4,
      cardHolder: newCardHolder.toUpperCase(),
      expiry: newCardExpiry,
      brand: newCardBrand,
      isDefault: (user.savedCards || []).length === 0,
    });
    setNewCardNumber("");
    setNewCardHolder("");
    setNewCardExpiry("");
    setIsAddCardOpen(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changePassword(currentPassword, newPassword);
    setPasswordMsg(res.ok ? { ok: true, text: res.message ?? "Şifreniz güncellendi." } : { ok: false, text: res.error });
    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress({
      title: addressTitle,
      street: addressStreet,
      district: addressDistrict,
      city: addressCity,
      postalCode: addressPostal,
    });
    setIsEditAddressOpen(false);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans text-[#10B981] uppercase tracking-wider font-bold">
            HESAP & ÖDEME GEÇMİŞİ
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[11px] font-sans text-[#64748B]">Üye Profili</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
          Üye Bilgileri & Hesap
        </h2>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shrink-0 shadow-xs">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold uppercase font-display text-[#0F172A]">
                  {user.fullName}
                </h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-sans rounded-md font-bold">
                  {user.memberNo}
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-sans mt-0.5">
                {user.membershipTier} • Kayıt: {formatDateMedium(user.joinDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-black/[0.08] bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] rounded-xl text-xs font-sans font-semibold transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Bilgileri Düzenle</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-sans font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans text-xs">
          {/* Birth Date */}
          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">DOĞUM TARİHİ</span>
              <span className="text-[#0F172A] font-semibold">{user.birthDate || "Belirtilmemiş"}</span>
            </div>
          </div>

          {/* Email */}
          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981] shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">E-POSTA</span>
              <span className="text-[#0F172A] font-semibold">{user.email}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">TELEFON</span>
              <span className="text-[#0F172A] font-semibold">{user.phone}</span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">ACİL DURUM İLETİŞİM</span>
              <span className="text-[#0F172A] font-semibold">{user.emergencyContact || "Belirtilmemiş"}</span>
            </div>
          </div>

          {/* Health Notes - Span full width */}
          <div className="sm:col-span-2 p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">SAĞLIK NOTU</span>
              <span className="text-[#0F172A] font-semibold leading-relaxed">
                {user.healthNotes || "Aktif bir sağlık uyarısı bulunmamaktadır."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards & Address Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Cards Section */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-base font-bold font-display uppercase text-[#0F172A]">
                  Kayıtlı Kartlarım ({user.savedCards?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => setIsAddCardOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F172A] text-white text-[11px] font-semibold rounded-full hover:bg-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kart Ekle</span>
              </button>
            </div>

            <div className="space-y-3">
              {(user.savedCards || []).map((card) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    card.isDefault
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-[#F8FAFC] text-[#0F172A] border-black/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-7 rounded-md flex items-center justify-center font-bold text-[10px] tracking-wider uppercase ${
                        card.brand === "mastercard"
                          ? "bg-gradient-to-r from-red-500 to-amber-500 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {card.brand === "mastercard" ? "MC" : "VISA"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs tracking-wider">
                          •••• •••• •••• {card.last4}
                        </span>
                        {card.isDefault && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase rounded-full">
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] block mt-0.5 ${
                          card.isDefault ? "text-slate-300" : "text-[#64748B]"
                        }`}
                      >
                        {card.cardHolder} • SKT: {card.expiry}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!card.isDefault && (
                      <button
                        onClick={() => setDefaultCard(card.id)}
                        className="text-[10px] text-[#64748B] hover:text-[#0F172A] underline font-medium"
                      >
                        Varsayılan Yap
                      </button>
                    )}
                    <button
                      onClick={() => removeSavedCard(card.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        card.isDefault
                          ? "text-slate-400 hover:text-white"
                          : "text-[#94A3B8] hover:text-rose-600"
                      }`}
                      title="Kartı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {(!user.savedCards || user.savedCards.length === 0) && (
                <div className="p-5 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-black/[0.08] text-xs text-[#64748B]">
                  Henüz kayıtlı bir ödeme kartı bulunmuyor.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.05] text-[10px] text-[#94A3B8] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Kart bilgileriniz PCI-DSS standartlarında şifrelenir.</span>
          </div>
        </div>

        {/* Saved Address Section */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-base font-bold font-display uppercase text-[#0F172A]">
                  Kayıtlı Adres Bilgilerim
                </h3>
              </div>
              <button
                onClick={() => setIsEditAddressOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F8FAFC] border border-black/[0.08] hover:bg-slate-100 text-[#0F172A] text-[11px] font-semibold rounded-full transition-colors"
              >
                <Edit3 className="w-3 h-3 text-[#10B981]" />
                <span>Düzenle</span>
              </button>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wide">
                  {user.address?.title || "Ev Adresi"}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                  Birincil
                </span>
              </div>
              {user.address?.street ? (
                <>
                  <p className="text-xs text-[#334155] leading-relaxed">{user.address.street}</p>
                  <p className="text-xs font-semibold text-[#0F172A]">
                    {user.address.district} / {user.address.city}
                  </p>
                </>
              ) : (
                <p className="text-xs text-[#64748B]">Henüz adres eklenmedi.</p>
              )}
              {user.address?.postalCode && (
                <span className="text-[11px] text-[#64748B] block">
                  Posta Kodu: {user.address.postalCode}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.05] text-[10px] text-[#94A3B8]">
            Resmi fatura ve üyelik sözleşmesi tebligat adresi olarak kullanılır.
          </div>
        </div>
      </div>

      {/* Şifre değiştir */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-base font-bold font-display uppercase text-[#0F172A]">Şifre Değiştir</h3>
        </div>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Mevcut şifre"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="min-h-11 bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 text-[#0F172A] focus:outline-none focus:border-[#10B981]"
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Yeni şifre (en az 8 karakter)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="min-h-11 bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 text-[#0F172A] focus:outline-none focus:border-[#10B981]"
          />
          <button type="submit" className="min-h-11 rounded-xl bg-[#0F172A] text-white font-bold uppercase tracking-wider hover:bg-black">
            Şifreyi Güncelle
          </button>
        </form>
        {passwordMsg && (
          <p className={`mt-3 text-xs font-medium ${passwordMsg.ok ? "text-emerald-700" : "text-rose-600"}`}>{passwordMsg.text}</p>
        )}
      </div>

      {/* Orders & Payments List */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-base font-bold font-display uppercase text-[#0F172A]">
            Geçmiş Ödemeler & Faturalar ({orders.length})
          </h3>
        </div>

        {downloadSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Fatura/Makbuz ({downloadSuccess}) hazırlandı ve indirildi.</span>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs hover:border-black/[0.09] transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F172A]">{ord.packageName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.paymentStatus === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ord.paymentStatus === "completed"
                      ? "Ödendi"
                      : ord.paymentMethod === "cash_register"
                      ? "Stüdyoda Ödenecek"
                      : "Havale Bekliyor"}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] block mt-1">
                  {ord.orderNumber} • {formatDateMedium(ord.createdAt)} • {PAYMENT_LABEL[ord.paymentMethod]}
                </span>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 border-black/[0.05] pt-2 sm:pt-0">
                <span className="font-black text-sm text-[#0F172A]">
                  {formatTL(ord.amount)}
                </span>

                <button
                  onClick={() => handleDownloadReceipt(ord.orderNumber)}
                  className="px-3 py-1.5 bg-white border border-black/[0.08] hover:bg-slate-100 text-[#334155] rounded-lg flex items-center gap-1.5 text-[11px] font-medium transition-colors shadow-2xs"
                  title="Makbuzu İndir"
                >
                  <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Makbuz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Edit Profile */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold font-display uppercase text-[#0F172A] mb-1">
                Profil Bilgilerini Düzenle
              </h3>
              <p className="text-xs text-[#64748B] mb-5">
                Stüdyo ve koçunuz ile paylaşılan kişisel üye bilgilerinizi güncelleyin.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-3.5 font-sans text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    AD SOYAD
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    DOĞUM TARİHİ & YAŞ
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 14 Mayıs 1994"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    TELEFON NUMARASI
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    ACİL DURUM İLETİŞİM KİŞİSİ
                  </label>
                  <input
                    type="text"
                    placeholder="+90 532 111 2233 (Ayla Mert - Eşi)"
                    value={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    SAĞLIK / SAKATLIK NOTLARI
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ameliyat, bel fıtığı, diz menisküs veya alerji durumu..."
                    value={editHealth}
                    onChange={(e) => setEditHealth(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Add Saved Card */}
      <AnimatePresence>
        {isAddCardOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A]"
            >
              <button
                onClick={() => setIsAddCardOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold font-display uppercase text-[#0F172A] mb-1">
                Yeni Kart Ekle
              </h3>
              <p className="text-xs text-[#64748B] mb-5">
                Gelecek paket satın alımlarında hızlı ödeme için kartınızı kaydedin.
              </p>

              <form onSubmit={handleSaveCard} className="space-y-3.5 font-sans text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    KART TÜRÜ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCardBrand("mastercard")}
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 ${
                        newCardBrand === "mastercard"
                          ? "border-[#0F172A] bg-slate-100 text-[#0F172A]"
                          : "border-black/[0.08] text-[#64748B]"
                      }`}
                    >
                      Mastercard
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCardBrand("visa")}
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 ${
                        newCardBrand === "visa"
                          ? "border-[#0F172A] bg-slate-100 text-[#0F172A]"
                          : "border-black/[0.08] text-[#64748B]"
                      }`}
                    >
                      Visa
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    KART NUMARASI
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="5421 •••• •••• 5432"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    KART ÜZERİNDEKİ İSİM
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EGE MERT"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    SON KULLANMA (AA/YY)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="12/28"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCardOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Kartı Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Edit Address */}
      <AnimatePresence>
        {isEditAddressOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A]"
            >
              <button
                onClick={() => setIsEditAddressOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold font-display uppercase text-[#0F172A] mb-1">
                Adres Bilgisini Güncelle
              </h3>
              <p className="text-xs text-[#64748B] mb-5">
                Fatura ve üyelik adresinizi aşağıdan güncelleyebilirsiniz.
              </p>

              <form onSubmit={handleSaveAddress} className="space-y-3.5 font-sans text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    ADRES BAŞLIĞI
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ev Adresi veya Şirket Adresi"
                    value={addressTitle}
                    onChange={(e) => setAddressTitle(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    SOKAK / CADDE / NO
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Abdi İpekçi Cad. No: 42/8"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      İLÇE / SEMT
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nişantaşı, Şişli"
                      value={addressDistrict}
                      onChange={(e) => setAddressDistrict(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      ŞEHİR
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="İstanbul"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    POSTA KODU
                  </label>
                  <input
                    type="text"
                    placeholder="34367"
                    value={addressPostal}
                    onChange={(e) => setAddressPostal(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditAddressOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Adresi Güncelle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
