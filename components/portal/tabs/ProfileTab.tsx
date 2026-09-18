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
          <span className="text-[11px] font-sans text-[#10B981] uppercase tracking-wider font-bold">
            HESAP & ÖDEME GEÇMİŞİ
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[11px] font-sans text-[#64748B]">Üye Profili</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
          Üye Bilgileri & Siparişler
        </h2>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
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
                {user.membershipTier} • Kayıt: {user.joinDate}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-sans font-medium transition-colors self-start sm:self-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981] shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">E-POSTA</span>
              <span className="text-[#0F172A] font-semibold">{user.email}</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase font-medium">TELEFON</span>
              <span className="text-[#0F172A] font-semibold">{user.phone}</span>
            </div>
          </div>

          {user.emergencyContact && (
            <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981] shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase font-medium">ACİL DURUM İLETİŞİM</span>
                <span className="text-[#0F172A] font-semibold">{user.emergencyContact}</span>
              </div>
            </div>
          )}

          {user.healthNotes && (
            <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981] shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase font-medium">SAĞLIK & POSTÜR NOTU</span>
                <span className="text-[#0F172A] font-semibold">{user.healthNotes}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders & Payments List */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
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
              className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs hover:border-black/[0.09] transition-all"
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
                      ? "Kasada Nakit"
                      : ord.paymentMethod === "pos_register"
                      ? "Kasada POS"
                      : "Havale Bekliyor"}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] block mt-1">
                  {ord.orderNumber} • {ord.createdAt} • {ord.paymentMethod.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 border-black/[0.05] pt-2 sm:pt-0">
                <span className="font-black text-sm text-[#0F172A]">
                  {ord.formattedAmount}
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
    </div>
  );
};
