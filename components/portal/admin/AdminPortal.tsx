"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  CreditCard,
  Banknote,
  Building2,
  FileText,
  Check,
  X,
  UserCheck,
  QrCode,
  Zap,
  Smartphone,
  Monitor,
  Camera,
  MessageSquare,
  RotateCcw,
  UserPlus,
  Download,
  Menu,
  LogOut,
  Hourglass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMember } from "@/context/MemberContext";
import type { BookedSession, StudioMemberCRM } from "@/types/portal";
import { AdminQrScannerModal } from "@/components/portal/admin/AdminQrScannerModal";
import { AdminFloatingNav, ADMIN_TABS, type AdminTab } from "@/components/portal/admin/AdminFloatingNav";
import { AdminCreateSessionModal } from "@/components/portal/admin/AdminCreateSessionModal";
import { AdminScheduleCalendarTable } from "@/components/portal/admin/AdminScheduleCalendarTable";
import { AdminStudioSettingsTab } from "@/components/portal/admin/AdminStudioSettingsTab";
import { AdminCoachSlotsTab } from "@/components/portal/admin/AdminCoachSlotsTab";
import { AdminQuickSaleModal } from "@/components/portal/admin/AdminQuickSaleModal";
import { AdminWhatsAppModal } from "@/components/portal/admin/AdminWhatsAppModal";
import { AdminSessionActionModal } from "@/components/portal/admin/AdminSessionActionModal";
import { AdminMemberDetailModal } from "@/components/portal/admin/AdminMemberDetailModal";
import { AdminCreateMemberModal } from "@/components/portal/admin/AdminCreateMemberModal";
import { formatTL } from "@/lib/pricing";
import { formatDateLong, formatDateShort, formatDateMedium } from "@/lib/format";
import { todayIso } from "@/lib/slots";
import {
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_STYLE,
  HEAD_COACH_NAME,
  STUDIO_AREA,
  workoutLabel,
} from "@/lib/training";

const COACH_AVATAR = "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80";

const PAYMENT_LABEL = {
  online_card: "Online Kart",
  cash_register: "Stüdyoda Nakit",
  bank_transfer: "Havale / FAST",
} as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export const AdminPortal: React.FC = () => {
  const {
    user,
    bookedSessions,
    adminOrders,
    crmMembers,
    approveOrder,
    confirmBooking,
    cancelBookedSession,
    completeBookedSession,
    adminCheckIn,
    updateMemberDetails,
    logout,
  } = useMember();

  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [viewMode, setViewMode] = useState<"responsive" | "app_frame">("responsive");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [createSession, setCreateSession] = useState<{ date?: string; timeSlot?: string; key: number } | null>(null);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isCreateMemberOpen, setIsCreateMemberOpen] = useState(false);
  const [selectedCrmMember, setSelectedCrmMember] = useState<StudioMemberCRM | null>(null);
  const [activeSessionForAction, setActiveSessionForAction] = useState<BookedSession | null>(null);
  const [sessionToComplete, setSessionToComplete] = useState<BookedSession | null>(null);
  const [completeNote, setCompleteNote] = useState("");
  const [whatsApp, setWhatsApp] = useState<{
    key: number;
    name: string;
    phone: string;
    sessionInfo?: { date: string; timeSlot: string };
  } | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "completed">("all");
  const [memberSearch, setMemberSearch] = useState("");
  const [checkInMemberId, setCheckInMemberId] = useState("");

  const showResult = (res: { ok: true; message?: string } | { ok: false; error: string }) => {
    setToast(res.ok ? { ok: true, text: res.message ?? "Kaydedildi." } : { ok: false, text: res.error });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreateSession = (date?: string, timeSlot?: string) => setCreateSession((prev) => ({ date, timeSlot, key: (prev?.key ?? 0) + 1 }));

  const openWhatsApp = (name: string, phone: string, sessionInfo?: { date: string; timeSlot: string }) =>
    setWhatsApp((prev) => ({ key: (prev?.key ?? 0) + 1, name, phone, sessionInfo }));

  const today = todayIso();
  const monthPrefix = today.slice(0, 7);
  const pendingBookings = bookedSessions
    .filter((s) => s.status === "PENDING")
    .sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot));
  const upcomingConfirmed = bookedSessions
    .filter((s) => s.status === "CONFIRMED" && s.date >= today)
    .sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot));
  const todaysSessions = bookedSessions.filter((s) => s.date === today && s.status !== "CANCELLED");
  const pendingOrders = adminOrders.filter((o) => o.paymentStatus !== "completed");
  const monthRevenue = adminOrders
    .filter((o) => o.paymentStatus === "completed" && (o.paidAt ?? o.createdAt).startsWith(monthPrefix))
    .reduce((sum, o) => sum + o.amount, 0);

  const filteredMembers = crmMembers.filter((m) => {
    const q = memberSearch.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.memberNo.toLowerCase().includes(q) || m.phone.includes(memberSearch);
  });

  const handleCompleteSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToComplete) return;
    const res = await completeBookedSession(sessionToComplete.id, completeNote);
    showResult(res);
    setSessionToComplete(null);
    setCompleteNote("");
  };

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInMemberId) return;
    showResult(await adminCheckIn(checkInMemberId));
  };

  const handleExportOrdersCSV = () => {
    const headers = ["Siparis No", "Uye", "Paket", "Ders", "Tutar (TL)", "Odeme", "Durum", "Tarih"];
    const rows = adminOrders.map((o) => [
      o.orderNumber,
      `"${o.memberName ?? ""}"`,
      `"${o.packageName}"`,
      o.sessionCount,
      o.amount,
      PAYMENT_LABEL[o.paymentMethod],
      o.paymentStatus,
      formatDateShort(o.createdAt),
    ]);
    const csv = "data:text/csv;charset=utf-8,﻿" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `CoreAndFit_Kasa_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Randevu kartı: onay bekleyen ve yaklaşan listelerinde ortak
  const renderBookingRow = (sess: BookedSession) => (
    <div key={sess.id} className="p-4 bg-white border border-black/[0.06] rounded-2xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F172A] text-white rounded-lg text-xs font-bold" data-keep-white>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {sess.timeSlot}
          </span>
          <span className="text-xs font-semibold text-[#0F172A]">{formatDateLong(sess.date)}</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${BOOKING_STATUS_STYLE[sess.status]}`}>
          {BOOKING_STATUS_LABEL[sess.status]}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-[#64748B] block">Üye</span>
          <span className="font-bold">{sess.memberName}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block">Antrenör</span>
          <span className="font-semibold">{HEAD_COACH_NAME}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block">Antrenman</span>
          <span className="font-semibold">{workoutLabel(sess.workoutType)}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block">Alan</span>
          <span className="font-semibold">{STUDIO_AREA}</span>
        </div>
      </div>
      {sess.memberNote && (
        <p className="text-[11px] text-[#475569] bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg">Üye notu: {sess.memberNote}</p>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => openWhatsApp(sess.memberName ?? "", sess.memberPhone ?? "", { date: sess.date, timeSlot: sess.timeSlot })}
          className="min-h-10 px-3 bg-[#25D366]/10 text-[#128C7E] rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          WhatsApp
        </button>
        {sess.status === "PENDING" ? (
          <>
            <button
              type="button"
              onClick={async () => showResult(await cancelBookedSession(sess.id, true, "Stüdyo tarafından onaylanmadı"))}
              className="min-h-10 px-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              İptal Et
            </button>
            <button
              type="button"
              onClick={async () => showResult(await confirmBooking(sess.id))}
              className="min-h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Onayla
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveSessionForAction(sess)}
              className="min-h-10 px-3 bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ertele / İptal
            </button>
            <button
              type="button"
              onClick={() => setSessionToComplete(sess)}
              className="min-h-10 px-4 bg-[#0F172A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Tamamla
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (adminTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {[
                { label: "Bugünkü Seans", value: String(todaysSessions.length), icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
                { label: "Onay Bekleyen", value: String(pendingBookings.length), icon: Hourglass, color: "bg-amber-50 text-amber-600" },
                { label: "Bu Ay Tahsilat", value: formatTL(monthRevenue), icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
                { label: "Bekleyen Ödeme", value: String(pendingOrders.length), icon: Banknote, color: "bg-blue-50 text-blue-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-black/[0.05] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase text-[#64748B] truncate">{label}</span>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-lg sm:text-2xl font-black tracking-tight">{value}</span>
                </div>
              ))}
            </div>

            <section className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-sm uppercase">Onay Bekleyen Randevular ({pendingBookings.length})</h3>
                </div>
              </div>
              {pendingBookings.length === 0 ? (
                <p className="text-xs text-[#64748B] p-4 bg-[#F8FAFC] rounded-2xl">Onay bekleyen randevu yok.</p>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map(renderBookingRow)}
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <section className="lg:col-span-2 bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#10B981]" />
                    <h3 className="font-bold text-sm uppercase">Yaklaşan Onaylı Randevular</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCreateSession()}
                      className="min-h-9 px-3 bg-[#0F172A] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      Randevu
                    </button>
                    <button onClick={() => setAdminTab("schedule")} className="text-xs font-semibold text-[#2563EB] hover:underline">
                      Program →
                    </button>
                  </div>
                </div>
                {upcomingConfirmed.length === 0 ? (
                  <p className="text-xs text-[#64748B] p-4 bg-[#F8FAFC] rounded-2xl">Yaklaşan onaylı randevu yok.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingConfirmed.slice(0, 8).map(renderBookingRow)}
                  </div>
                )}
              </section>

              <section className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">QR ile Giriş</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Üyenin paneldeki QR kodunu okutun. Bugün onaylı randevusu varsa tamamlanır, yoksa 1 ders düşülür.
                  </p>
                </div>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full min-h-12 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  QR Okuyucuyu Başlat
                </button>
              </section>
            </div>
          </div>
        );

      case "schedule":
        return (
          <AdminScheduleCalendarTable
            bookedSessions={bookedSessions}
            onOpenCreateSession={openCreateSession}
            onOpenWhatsApp={openWhatsApp}
            onOpenSessionAction={(sess) => setActiveSessionForAction(sess)}
            onCompleteSession={(sess) => setSessionToComplete(sess)}
            onConfirmSession={async (sess) => showResult(await confirmBooking(sess.id))}
            onNavigateToCoachSlots={() => setAdminTab("coach_slots")}
          />
        );

      case "coach_slots":
        return <AdminCoachSlotsTab />;

      case "settings":
        return <AdminStudioSettingsTab />;

      case "turnstile": {
        const recentCheckIns = bookedSessions
          .filter((s) => s.status === "COMPLETED")
          .sort((a, b) => (b.date + b.timeSlot).localeCompare(a.date + a.timeSlot))
          .slice(0, 15);
        return (
          <div className="space-y-5">
            <div className="bg-white border border-black/[0.06] rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-2xl font-bold">Turnike ve QR Okuyucu</h3>
                <p className="text-xs text-[#64748B] max-w-lg">Üyenin telefonundaki QR kodu kameraya gösterin.</p>
              </div>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="min-h-12 px-8 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2.5 shrink-0"
              >
                <Camera className="w-5 h-5 text-emerald-400" />
                Kamerayı Başlat
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <form onSubmit={handleManualCheckIn} className="bg-white border border-black/[0.06] rounded-3xl p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-base">Manuel Giriş</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">Telefonu yanında olmayan üyeler için.</p>
                </div>
                <select
                  required
                  value={checkInMemberId}
                  onChange={(e) => setCheckInMemberId(e.target.value)}
                  className="w-full min-h-11 p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold"
                >
                  <option value="">Üye seçin</option>
                  {crmMembers
                    .filter((m) => m.status !== "Pasif")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.memberNo}) • {m.remaining} ders
                      </option>
                    ))}
                </select>
                <button type="submit" className="w-full min-h-12 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase rounded-xl">
                  Girişi Onayla
                </button>
              </form>

              <div className="bg-white border border-black/[0.06] rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-black/[0.05] pb-3">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-base">Son Girişler</h4>
                </div>
                <div className="space-y-2 max-h-[380px] overflow-y-auto">
                  {recentCheckIns.length === 0 ? (
                    <p className="text-xs text-[#64748B]">Henüz giriş kaydı yok.</p>
                  ) : (
                    recentCheckIns.map((s) => (
                      <div key={s.id} className="p-3 bg-[#F8FAFC] rounded-2xl flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold">{s.memberName}</span>
                        <span className="text-[#64748B]">
                          {formatDateShort(s.date)} {s.timeSlot.split(" - ")[0]} • {workoutLabel(s.workoutType)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "cashier": {
        const totalFor = (method: keyof typeof PAYMENT_LABEL) =>
          adminOrders.filter((o) => o.paymentMethod === method && o.paymentStatus === "completed").reduce((acc, o) => acc + o.amount, 0);
        const visibleOrders = adminOrders.filter((o) =>
          orderFilter === "pending" ? o.paymentStatus !== "completed" : orderFilter === "completed" ? o.paymentStatus === "completed" : true
        );
        return (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
              <div>
                <h3 className="font-bold text-lg">Kasa ve Ödemeler ({adminOrders.length})</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Stüdyoda nakit veya havale ile gelen siparişleri onaylayın, yeni satış yapın.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsQuickSaleOpen(true)}
                  className="min-h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Satış Yap
                </button>
                <button
                  onClick={handleExportOrdersCSV}
                  className="min-h-10 px-3.5 bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value as typeof orderFilter)}
                  className="min-h-10 px-2.5 border border-black/[0.08] rounded-xl text-xs bg-[#F8FAFC]"
                >
                  <option value="all">Tümü ({adminOrders.length})</option>
                  <option value="pending">Onay bekleyen ({pendingOrders.length})</option>
                  <option value="completed">Tahsil edilen</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                ["cash_register", Banknote],
                ["bank_transfer", Building2],
                ["online_card", CreditCard],
              ] as const).map(([method, Icon]) => (
                <div key={method} className="p-4 bg-[#F8FAFC] rounded-2xl">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {PAYMENT_LABEL[method]}
                  </span>
                  <span className="text-xl font-black block mt-1">{formatTL(totalFor(method))}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {visibleOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-[#F8FAFC] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{ord.packageName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.paymentStatus === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.paymentStatus === "completed" ? "Tahsil Edildi" : ord.paymentMethod === "bank_transfer" ? "Havale Bekliyor" : "Stüdyoda Ödenecek"}
                      </span>
                      {ord.discountRate > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          %{Math.round(ord.discountRate * 100)} indirim
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      {ord.memberName} • {ord.orderNumber} • {formatDateMedium(ord.createdAt)} • {PAYMENT_LABEL[ord.paymentMethod]}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 justify-between md:justify-end">
                    <span className="text-base font-black">{formatTL(ord.amount)}</span>
                    {ord.paymentStatus !== "completed" ? (
                      <button
                        onClick={async () => showResult(await approveOrder(ord.id))}
                        className="min-h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                      >
                        Tahsil Edildi
                      </button>
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                </div>
              ))}
              {visibleOrders.length === 0 && <p className="text-xs text-[#64748B]">Kayıt yok.</p>}
            </div>
          </div>
        );
      }

      case "members":
        return (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
              <h3 className="font-bold text-lg">Üyeler ({filteredMembers.length})</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsCreateMemberOpen(true)}
                  className="min-h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Yeni Üye
                </button>
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="İsim, no veya telefon ara"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full min-h-10 bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {filteredMembers.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0" data-keep-white>
                      {initials(mem.name)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm">{mem.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md">{mem.memberNo}</span>
                        {mem.status !== "Aktif" && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md">{mem.status}</span>
                        )}
                        {mem.referral.discountActive && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">%10 referans</span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B]">{mem.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-between lg:justify-end">
                    <div className="lg:text-right">
                      <span className="text-[10px] text-[#64748B] block uppercase font-bold">Kalan Ders</span>
                      <span className="text-base font-black text-emerald-600">
                        {mem.remaining} / {mem.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openWhatsApp(mem.name, mem.phone)}
                        className="min-h-10 px-2.5 bg-[#25D366]/10 text-[#128C7E] rounded-xl text-xs font-bold"
                        aria-label="WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCrmMember(mem)}
                        className="min-h-10 px-3 bg-[#0F172A] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Üye Kartı
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "referrals": {
        const rows = [...crmMembers].sort((a, b) => b.referral.uses - a.referral.uses);
        return (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg">Referanslar</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Arkadaşını Getir – %10 İndirim. En az 1 başarılı referansı olan üyede indirim kalıcı olarak açılır.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
              <table className="w-full min-w-[720px] text-xs">
                <thead className="bg-[#F8FAFC] text-[10px] uppercase text-[#64748B]">
                  <tr>
                    <th className="p-3 text-left">Davet eden</th>
                    <th className="p-3 text-left">Referans kodu</th>
                    <th className="p-3 text-center">Kullanan</th>
                    <th className="p-3 text-center">Başarılı</th>
                    <th className="p-3 text-left">İndirim</th>
                    <th className="p-3 text-left">Referansla kayıt olanlar</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {rows.map((m) => (
                    <tr key={m.id}>
                      <td className="p-3 font-bold">{m.name}</td>
                      <td className={`p-3 font-mono ${m.referral.disabled ? "line-through text-[#94A3B8]" : ""}`}>{m.referral.code}</td>
                      <td className="p-3 text-center">{m.referral.uses}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{m.referral.successful}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.referral.discountActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {m.referral.discountActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="p-3 text-[#475569]">
                        {m.referredMembers.length ? m.referredMembers.map((r) => r.name).join(", ") : "—"}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={async () =>
                            showResult(await updateMemberDetails(m.id, { referralCodeDisabled: !m.referral.disabled }))
                          }
                          className={`min-h-9 px-3 rounded-lg text-[11px] font-bold ${
                            m.referral.disabled ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {m.referral.disabled ? "Aktifleştir" : "Geçersiz Kıl"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#0F172A] font-sans antialiased pb-28">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-xs shrink-0" data-keep-white>
              CF
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-xs sm:text-sm uppercase truncate">Core & Fit Yönetim</h1>
              <p className="text-[10px] text-[#64748B] hidden sm:block truncate">Nişantaşı Private Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setIsQuickSaleOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 min-h-9 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Satış
            </button>
            <button
              onClick={() => openCreateSession()}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-9 px-3 bg-[#0F172A] hover:bg-black text-white font-bold text-xs rounded-full"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              Randevu
            </button>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-9 px-3 bg-emerald-50 text-emerald-950 border border-emerald-200/80 font-bold text-xs rounded-full"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">QR</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === "app_frame" ? "responsive" : "app_frame")}
              className="hidden lg:inline-flex items-center gap-1.5 min-h-9 px-3 bg-black/[0.04] rounded-full text-xs font-semibold"
            >
              {viewMode === "app_frame" ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{viewMode === "app_frame" ? "Geniş" : "iPhone"}</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-black/[0.08]">
              <img src={COACH_AVATAR} alt={user?.fullName ?? HEAD_COACH_NAME} className="w-8 h-8 rounded-full object-cover" />
              <span className="hidden md:block text-xs font-bold">{user?.fullName}</span>
              <button onClick={logout} className="p-2 rounded-full hover:bg-slate-100" aria-label="Çıkış yap" title="Çıkış yap">
                <LogOut className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-black/[0.08]"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md p-3.5 rounded-2xl shadow-lg text-xs font-semibold flex items-center gap-2 ${
              toast.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-5">
        {viewMode === "app_frame" ? (
          <div className="py-6 px-4 flex justify-center">
            <div className="relative w-full max-w-[420px] bg-white rounded-[50px] border-[9px] border-slate-900 shadow-2xl overflow-hidden flex flex-col h-[850px]">
              <div className="w-28 h-6 bg-slate-900 rounded-full mx-auto mt-2.5 shrink-0" />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">{renderTabContent()}</div>
              <div className="shrink-0 p-2 flex justify-center">
                <AdminFloatingNav activeTab={adminTab} setActiveTab={setAdminTab} />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pb-28 lg:pb-12">
            <div className="hidden lg:grid grid-cols-8 gap-1.5 p-1.5 bg-black/[0.03] border border-black/[0.05] rounded-[26px]">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                const badge = tab.id === "overview" ? pendingBookings.length : tab.id === "cashier" ? pendingOrders.length : 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`inline-flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-2xl text-xs font-semibold ${
                      isActive ? "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] font-bold" : "text-[#64748B] hover:bg-white/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.fullLabel}</span>
                    {badge > 0 && <span className="px-1.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{badge}</span>}
                  </button>
                );
              })}
            </div>
            {renderTabContent()}
          </div>
        )}
      </main>

      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <AdminFloatingNav activeTab={adminTab} setActiveTab={setAdminTab} />
      </div>

      <AdminQrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {createSession && (
        <AdminCreateSessionModal
          key={createSession.key}
          isOpen
          onClose={() => setCreateSession(null)}
          initialDate={createSession.date}
          initialTimeSlot={createSession.timeSlot}
        />
      )}

      <AnimatePresence>
        {sessionToComplete && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl"
            >
              <button
                onClick={() => setSessionToComplete(null)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] rounded-full bg-[#F1F5F9]"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-bold mb-1">Seansı Tamamla</h3>
              <p className="text-xs text-[#64748B] mb-4">
                {sessionToComplete.memberName} • {workoutLabel(sessionToComplete.workoutType)} • {sessionToComplete.timeSlot}
              </p>
              <form onSubmit={handleCompleteSession} className="space-y-3 text-xs">
                <label className="block">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Dahili not (isteğe bağlı, üyeye gösterilmez)</span>
                  <textarea
                    rows={3}
                    value={completeNote}
                    onChange={(e) => setCompleteNote(e.target.value)}
                    className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-xl"
                  />
                </label>
                <button type="submit" className="w-full min-h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase">
                  Tamamlandı Olarak İşaretle
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminQuickSaleModal isOpen={isQuickSaleOpen} onClose={() => setIsQuickSaleOpen(false)} />

      {whatsApp && (
        <AdminWhatsAppModal
          key={whatsApp.key}
          isOpen
          onClose={() => setWhatsApp(null)}
          defaultMemberName={whatsApp.name}
          defaultPhone={whatsApp.phone}
          defaultSessionInfo={whatsApp.sessionInfo}
        />
      )}

      {activeSessionForAction && (
        <AdminSessionActionModal
          key={activeSessionForAction.id}
          session={activeSessionForAction}
          onClose={() => setActiveSessionForAction(null)}
        />
      )}

      {selectedCrmMember && (
        <AdminMemberDetailModal
          key={selectedCrmMember.id}
          member={selectedCrmMember}
          onClose={() => setSelectedCrmMember(null)}
          onOpenWhatsApp={(name, phone) => openWhatsApp(name, phone)}
        />
      )}

      <AdminCreateMemberModal isOpen={isCreateMemberOpen} onClose={() => setIsCreateMemberOpen(false)} />

      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-[320px] h-full bg-white shadow-2xl flex flex-col z-10"
            >
              <div className="p-4 border-b border-black/[0.06] flex items-center justify-between">
                <span className="font-extrabold text-sm uppercase">Yönetim Menüsü</span>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl border border-black/[0.08]"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {ADMIN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setAdminTab(tab.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 min-h-11 px-3 rounded-xl text-xs font-semibold ${
                        isActive ? "bg-[#0F172A] text-white" : "text-[#475569] hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.fullLabel}
                    </button>
                  );
                })}
              </div>
              <div className="p-4 border-t border-black/[0.06] space-y-2">
                <button
                  onClick={logout}
                  className="w-full min-h-11 flex items-center justify-center gap-2 bg-white border border-black/[0.08] rounded-xl text-xs font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Çıkış Yap
                </button>
                <Link href="/" className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#64748B]">
                  <User className="w-3.5 h-3.5" />
                  Web sitesine git
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
