"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Receipt,
  LogOut,
  Bell,
  HeartPulse,
  Download,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

export const ProfileTab: React.FC = () => {
  const { user, orders, logout } = useMember();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!user) return null;

  const handleDownloadReceipt = (orderNo: string) => {
    setDownloadSuccess(orderNo);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider font-bold">
            HESAP & ÖDEME GEÇMİŞİ
          </span>
          <span className="text-[#72757C]">•</span>
          <span className="text-[11px] font-mono text-[#A5A7AD]">Üye Profili</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-white tracking-tight mt-0.5">
          Üye Bilgileri & Siparişler
        </h2>
      </div>

      {/* Profile Details Card */}
      <div className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#191B20] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E8FF36] shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold uppercase font-display text-white">
                  {user.fullName}
                </h3>
                <span className="px-2 py-0.5 bg-[#E8FF36]/10 text-[#E8FF36] border border-[#E8FF36]/30 text-[10px] font-mono rounded font-bold">
                  {user.memberNo}
                </span>
              </div>
              <p className="text-xs text-[#A5A7AD] font-mono mt-0.5">
                {user.membershipTier} • Kayıt: {user.joinDate}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-900/40 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 rounded-xl text-xs font-mono transition-colors self-start sm:self-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-3 bg-[#131519] border border-[#23272F] rounded-xl flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#E8FF36] shrink-0" />
            <div>
              <span className="text-[10px] text-[#72757C] block uppercase">E-POSTA</span>
              <span className="text-white">{user.email}</span>
            </div>
          </div>

          <div className="p-3 bg-[#131519] border border-[#23272F] rounded-xl flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#E8FF36] shrink-0" />
            <div>
              <span className="text-[10px] text-[#72757C] block uppercase">TELEFON</span>
              <span className="text-white">{user.phone}</span>
            </div>
          </div>

          {user.emergencyContact && (
            <div className="p-3 bg-[#131519] border border-[#23272F] rounded-xl flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#E8FF36] shrink-0" />
              <div>
                <span className="text-[10px] text-[#72757C] block uppercase">ACİL DURUM İLETİŞİM</span>
                <span className="text-white">{user.emergencyContact}</span>
              </div>
            </div>
          )}

          {user.healthNotes && (
            <div className="p-3 bg-[#131519] border border-[#23272F] rounded-xl flex items-center gap-3">
              <HeartPulse className="w-4 h-4 text-[#E8FF36] shrink-0" />
              <div>
                <span className="text-[10px] text-[#72757C] block uppercase">SAĞLIK & POSTÜR NOTU</span>
                <span className="text-white">{user.healthNotes}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders & Payments List */}
      <div className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-4 h-4 text-[#E8FF36]" />
          <h3 className="text-base font-bold font-display uppercase text-white">
            Geçmiş Ödemeler & Faturalar ({orders.length})
          </h3>
        </div>

        {downloadSuccess && (
          <div className="mb-4 p-3 bg-[#162B16] border border-[#25D366] text-[#25D366] text-xs font-mono rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Fatura/Makbuz ({downloadSuccess}) hazırlandı ve indirildi.</span>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 bg-[#131519] border border-[#23272F] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{ord.packageName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.paymentStatus === "completed"
                        ? "bg-[#25D366]/20 text-[#25D366]"
                        : "bg-amber-400/20 text-amber-300"
                    }`}
                  >
                    {ord.paymentStatus === "completed"
                      ? "Ödendi"
                      : ord.paymentMethod === "cash_register"
                      ? "Kasada Nakit"
                      : ord.paymentMethod === "pos_register"
                      ? "Kasada POS"
                      : "Havale Bekliyor"}
                  </span>
                </div>
                <span className="text-[11px] text-[#72757C] block mt-1">
                  {ord.orderNumber} • {ord.createdAt} • {ord.paymentMethod.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 border-[#191B20] pt-2 sm:pt-0">
                <span className="font-black text-sm text-[#E8FF36]">
                  {ord.formattedAmount}
                </span>

                <button
                  onClick={() => handleDownloadReceipt(ord.orderNumber)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-[#A5A7AD] hover:text-white rounded-lg flex items-center gap-1 text-[11px] transition-colors"
                  title="Makbuzu İndir"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E8FF36]" />
                  <span>Makbuz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
