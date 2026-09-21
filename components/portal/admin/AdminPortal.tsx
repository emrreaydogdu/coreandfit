"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Award,
  CreditCard,
  Banknote,
  Building2,
  FileText,
  AlertCircle,
  Activity,
  Dumbbell,
  Check,
  X,
  ChevronRight,
  Filter,
  UserCheck,
  Sparkles,
  QrCode,
  Zap,
  Smartphone,
  Monitor,
  Camera,
  Settings,
  CalendarPlus,
  MessageSquare,
  RotateCcw,
  UserPlus,
  Download,
  Boxes,
  Percent,
  Menu,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMember } from "@/context/MemberContext";
import { PaymentMethod, StudioMemberCRM, BookedSession } from "@/types/portal";
import { AdminQrScannerModal } from "@/components/portal/admin/AdminQrScannerModal";
import { AdminFloatingNav, AdminTab } from "@/components/portal/admin/AdminFloatingNav";
import { AdminCreateSessionModal } from "@/components/portal/admin/AdminCreateSessionModal";
import { AdminScheduleCalendarTable } from "@/components/portal/admin/AdminScheduleCalendarTable";
import { AdminStudioSettingsTab } from "@/components/portal/admin/AdminStudioSettingsTab";
import { AdminCoachSlotsTab } from "@/components/portal/admin/AdminCoachSlotsTab";
import { AdminQuickSaleModal } from "@/components/portal/admin/AdminQuickSaleModal";
import { AdminWhatsAppModal } from "@/components/portal/admin/AdminWhatsAppModal";
import { AdminSessionActionModal } from "@/components/portal/admin/AdminSessionActionModal";
import { AdminMemberDetailModal } from "@/components/portal/admin/AdminMemberDetailModal";
import { AdminCreateMemberModal } from "@/components/portal/admin/AdminCreateMemberModal";
import { AdminDailyBriefingWidget } from "@/components/portal/admin/AdminDailyBriefingWidget";
import { AdminInventoryTab } from "@/components/portal/admin/AdminInventoryTab";

const ADMIN_TAB_LABELS: Record<AdminTab, string> = {
  overview: "Genel Bakış",
  turnstile: "Turnike & Hızlı QR",
  schedule: "Seans Programı",
  coach_slots: "Koç Randevu Saatleri",
  cashier: "Kasa & Ödemeler",
  members: "Üye Rehberi (CRM)",
  inventory: "Envanter & Donanım",
  settings: "İşletme Ayarları",
};

export const AdminPortal: React.FC = () => {
  const {
    user,
    remainingSessions,
    totalSessions,
    bookedSessions,
    checkInLogs,
    orders,
    approveOrder,
    adminCheckInMember,
    adminAddSessions,
    completeBookedSession,
    crmMembers,
  } = useMember();

  // Role switch & Display Mode
  const [selectedRole, setSelectedRole] = useState<string>("İlker Yüksel");
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [viewMode, setViewMode] = useState<"responsive" | "app_frame">("responsive");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState<boolean>(false);
  const [createSessionInitialDate, setCreateSessionInitialDate] = useState<string | undefined>(undefined);
  const [createSessionInitialTimeSlot, setCreateSessionInitialTimeSlot] = useState<string | undefined>(undefined);

  const handleOpenCreateSession = (date?: string, timeSlot?: string) => {
    setCreateSessionInitialDate(date);
    setCreateSessionInitialTimeSlot(timeSlot);
    setIsCreateSessionOpen(true);
  };

  // New Operational Modals
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState<boolean>(false);
  const [isCreateMemberOpen, setIsCreateMemberOpen] = useState<boolean>(false);
  const [selectedCrmMember, setSelectedCrmMember] = useState<StudioMemberCRM | null>(null);
  const [activeSessionForAction, setActiveSessionForAction] = useState<BookedSession | null>(null);

  // WhatsApp template modal state
  const [whatsAppData, setWhatsAppData] = useState<{
    isOpen: boolean;
    name: string;
    phone: string;
    sessionInfo?: { date: string; timeSlot: string; focusArea?: string };
  }>({
    isOpen: false,
    name: "",
    phone: "",
  });

  const handleOpenWhatsApp = (
    name: string,
    phone: string,
    sessionInfo?: { date: string; timeSlot: string; focusArea?: string }
  ) => {
    setWhatsAppData({
      isOpen: true,
      name,
      phone,
      sessionInfo,
    });
  };

  // CSV Export for Cashier
  const handleExportOrdersCSV = () => {
    const headers = [
      "Siparis No",
      "Paket Adi",
      "Seans Sayisi",
      "Tutar (TL)",
      "Odeme Yontemi",
      "Durum",
      "Tarih",
      "Makbuz Kodu",
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.packageName}"`,
      o.sessionCount,
      o.amount,
      o.paymentMethod,
      o.paymentStatus,
      `"${o.createdAt}"`,
      o.receiptCode,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CoreAndFit_Kasa_Raporu_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter states
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [memberSearch, setMemberSearch] = useState<string>("");

  // Turnstile check-in simulator state
  const [turnstileCoach, setTurnstileCoach] = useState<string>("İlker Yüksel");
  const [turnstileSessionType, setTurnstileSessionType] = useState<string>("1:1 Kuvvet & Postür");
  const [turnstileNote, setTurnstileNote] = useState<string>("Deadlift & squat form kontrolleri yapıldı.");
  const [turnstileMetric, setTurnstileMetric] = useState<string>("RPE 8 • 5 Set");
  const [turnstileSuccessMsg, setTurnstileSuccessMsg] = useState<string | null>(null);

  // Complete session modal
  const [activeSessionToComplete, setActiveSessionToComplete] = useState<any | null>(null);
  const [sessionCompleteNote, setSessionCompleteNote] = useState("");
  const [sessionCompleteMetric, setSessionCompleteMetric] = useState("");

  // Add session modal
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [addSessionCount, setAddSessionCount] = useState(6);

  // Handlers
  const handleTurnstileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = adminCheckInMember({
      coachName: turnstileCoach,
      sessionType: turnstileSessionType,
      performanceNote: turnstileNote,
      keyMetric: turnstileMetric,
    });
    setTurnstileSuccessMsg(res.message);
    setTimeout(() => setTurnstileSuccessMsg(null), 4000);
  };

  const handleCompleteSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSessionToComplete) return;
    completeBookedSession(
      activeSessionToComplete.id,
      sessionCompleteNote || "Ders planlanan programa uygun başarıyla tamamlandı.",
      sessionCompleteMetric || "Tamamlandı"
    );
    setActiveSessionToComplete(null);
    setSessionCompleteNote("");
    setSessionCompleteMetric("");
  };

  const filteredMembers = crmMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.memberNo.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.phone.includes(memberSearch)
  );

  const pendingOrdersCount = orders.filter((o) => o.paymentStatus !== "completed").length;

  // Render tab contents
  const renderTabContent = () => {
    switch (adminTab) {
      case "overview":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Top KPI Metric Cards - Clean 2x2 on Mobile, 4 columns on Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white/90 backdrop-blur-xl border border-black/[0.05] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5 sm:mb-2 font-medium">
                  <span className="tracking-tight text-[10px] sm:text-[11px] font-bold uppercase truncate">GÜNLÜK TURNİKE</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
                    <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">{checkInLogs.length + 34}</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">↑ %14</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#94A3B8] block mt-0.5 sm:mt-1 truncate">Tamamlanan seans</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-black/[0.05] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5 sm:mb-2 font-medium">
                  <span className="tracking-tight text-[10px] sm:text-[11px] font-bold uppercase truncate">DOLULUK ORANI</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">%70</span>
                  <span className="text-[10px] sm:text-xs text-[#64748B] truncate">14/20</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#94A3B8] block mt-0.5 sm:mt-1 truncate">Anlık kapasite</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-black/[0.05] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5 sm:mb-2 font-medium">
                  <span className="tracking-tight text-[10px] sm:text-[11px] font-bold uppercase truncate">AYLIK CİRO</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs shrink-0">
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">₺428.000</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">%107</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#94A3B8] block mt-0.5 sm:mt-1 truncate">Eylül 2026</span>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-black/[0.05] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5 sm:mb-2 font-medium">
                  <span className="tracking-tight text-[10px] sm:text-[11px] font-bold uppercase truncate">KASA TAHSİLATI</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs shrink-0">
                    <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">{pendingOrdersCount} Sipariş</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#94A3B8] block mt-0.5 sm:mt-1 truncate">Kasada / Havale</span>
              </div>
            </div>

            {/* Solo Coach & Studio Model Executive Banner - Apple Liquid Glass */}
            <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.06] rounded-2xl sm:rounded-[32px] p-4 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>TEK YETKİLİ BAŞ ANTRENÖR YÖNETİMİNDE (1:1)</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                    İlker Yüksel — Birebir Stüdyo İşletim Merkezi
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
                    Core & Fit Nişantaşı Studio, kurucu baş antrenör İlker Yüksel tarafından bizzat işletilmekte ve yönetilmektedir. Stüdyomuzda asistan veya stajyer antrenör çalıştırılmaz; her üye doğrudan 10+ yıl deneyimli kurucumuzla 1:1 biyomekanik ve kuvvet çalışır.
                  </p>
                  <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold text-[#334155]">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-black/[0.04]">
                      🏅 NSCA-CSCS Sertifikalı
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-black/[0.04]">
                      📋 NASM-CES Düzeltici Egzersiz
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-black/[0.04]">
                      ⚡ FMS 1 & 2 Eklem Taraması
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/60 font-bold">
                      🛡️ %100 Bizzat Kurucu Güvencesi
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
                  <div className="p-3 sm:p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl sm:rounded-2xl">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">GÜNLÜK SEANS</span>
                    <span className="text-base sm:text-lg font-black text-[#0F172A]">{bookedSessions.length} / 8 Planlı</span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-600 block mt-0.5 font-semibold">1:1 Özel Kapasite</span>
                  </div>
                  <div className="p-3 sm:p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl sm:rounded-2xl">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">MOLA ARALIĞI</span>
                    <span className="text-base sm:text-lg font-black text-[#0F172A]">15 Dakika</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">Hijyen & Hazırlık</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Operational Briefing & Checklist Widget */}
            <AdminDailyBriefingWidget />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule Snapshot (Ultra Detailed Cards) */}
              <div className="lg:col-span-2 bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#10B981]" />
                    <h3 className="font-bold text-sm uppercase text-[#0F172A]">
                      Yaklaşan Birebir Seanslar ({bookedSessions.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCreateSessionOpen(true)}
                      className="px-3 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+ Seans Oluştur</span>
                    </button>
                    <button
                      onClick={() => setAdminTab("schedule")}
                      className="text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Tüm Programı Gör →
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {bookedSessions.map((sess) => {
                    const coachName = "İlker Yüksel";
                    const coachTitle = "Kurucu & Baş Antrenör (Founder & Head Coach)";
                    const memberName = sess.memberName || user?.fullName || "Ege Mert";
                    const memberNo = sess.memberNo || user?.memberNo || "CF-89210";
                    const stationName = sess.station || "Özel İstasyon A (Kuvvet Alanı)";
                    const focusArea = sess.focusArea || "Kuvvet & Biyomekanik (Deadlift & Core)";
                    const notes = sess.notes || "Ağır çekiş bloğu ve core stabilizasyonu çalışılacak.";

                    let startTime = sess.timeSlot;
                    let endTime = "";
                    if (sess.timeSlot.includes(" - ")) {
                      [startTime, endTime] = sess.timeSlot.split(" - ");
                    }

                    return (
                      <div
                        key={sess.id}
                        className="bg-white hover:bg-slate-50/50 border border-black/[0.08] hover:border-black/[0.14] rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] space-y-4 relative"
                      >
                        {/* 1. Header Bar: Time, Date, Station & Live Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-black/[0.06]">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {/* Time Pill */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] text-white rounded-xl shadow-xs">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-black tracking-tight">{startTime}</span>
                              {endTime && <span className="text-[10px] text-slate-300 font-medium">- {endTime}</span>}
                              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded ml-0.5">
                                60 DK
                              </span>
                            </div>

                            {/* Date Badge */}
                            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>{sess.date}</span>
                            </span>

                            {/* Station */}
                            <span className="px-2.5 py-1 bg-slate-100 text-[#475569] text-[11px] font-medium rounded-xl flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{stationName}</span>
                            </span>
                          </div>

                          {/* Live Status Pill */}
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/70 text-[11px] font-bold rounded-full flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Birebir (1:1) Seans</span>
                          </span>
                        </div>

                        {/* 2. Unified Member & Coach Briefing Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                          {/* Member Side */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ring-2 ring-white">
                              {memberName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                                  DANIŞAN (MÜŞTERİ)
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-md">
                                  {remainingSessions} Seans Kalan
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-[#0F172A] truncate mt-0.5">
                                {memberName} <span className="text-[11px] font-mono text-[#64748B] font-normal">({memberNo})</span>
                              </h4>
                              <p className="text-[11px] text-[#64748B] font-medium">VIP 1:1 Personal Training</p>
                            </div>
                          </div>

                          {/* Coach Side */}
                          <div className="flex items-start gap-3 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-black/[0.06] md:pl-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80"
                              alt="İlker Yüksel"
                              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                  BAŞ ANTRENÖR
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-md">
                                  1:1 Birebir
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-1 truncate mt-0.5">
                                <span>{coachName}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              </h4>
                              <p className="text-[11px] text-[#64748B] font-medium">Kurucu & Baş Antrenör • NSCA-CSCS</p>
                            </div>
                          </div>
                        </div>

                        {/* 3. Focus & Protocol Bar */}
                        <div className="p-3 bg-[#F1F5F9]/70 border border-black/[0.04] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                              <Dumbbell className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Odak:</span>
                              <span className="font-bold text-[#0F172A]">{focusArea}</span>
                            </div>
                          </div>

                          {notes && notes !== "xxx" && notes !== "undefined" && (
                            <span className="text-[11px] text-[#475569] italic bg-white px-2.5 py-1 rounded-lg border border-black/[0.05]">
                              &ldquo;{notes}&rdquo;
                            </span>
                          )}
                        </div>

                        {/* 4. Readiness Chips & Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                          {/* Readiness status */}
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[11px]">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              İstasyon Sterilize
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[11px]">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Nabız Bandı Hazır
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenWhatsApp(memberName, "+90 532 555 0124", {
                                  date: sess.date,
                                  timeSlot: sess.timeSlot,
                                  focusArea,
                                })
                              }
                              className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                              title="WhatsApp Hatırlatması Gönder"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveSessionForAction(sess)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                              title="Seansı Ertele veya İptal Et"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>Ertele / İptal</span>
                            </button>

                            <button
                              onClick={() => setActiveSessionToComplete(sess)}
                              className="px-4 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                              <span>Tamamla</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Turnstile Action Widget - Apple White Liquid Glass */}
              <div className="bg-white/85 backdrop-blur-2xl border border-black/[0.06] rounded-[32px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-center justify-center mb-4 shadow-2xs">
                    <Zap className="w-5 h-5 fill-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    ⚡ OPTİK DİJİTAL GEÇİŞ
                  </span>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-[#0F172A]">
                    Otomatik QR Turnike Terminali
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Üyenin ekranındaki 60 saniyelik dinamik QR kodunu kamerayla okutarak anında seans düşüşü yapın.
                  </p>

                  <div className="mt-5 p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Örnek Üye:</span>
                      <span className="font-bold text-[#0F172A]">{user?.fullName} ({user?.memberNo})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Kalan Seans:</span>
                      <span className="font-bold text-emerald-600">{remainingSessions} Seans</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-black/[0.04]">
                      <span className="text-[#64748B]">Görevli Antrenör:</span>
                      <span className="font-bold text-[#0F172A]">İlker Yüksel (Kurucu)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="relative z-10 w-full mt-6 py-3.5 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Kamerayı / QR Okuyucuyu Başlat →</span>
                </button>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <AdminScheduleCalendarTable
            bookedSessions={bookedSessions}
            onOpenCreateSession={handleOpenCreateSession}
            onOpenWhatsApp={handleOpenWhatsApp}
            onOpenSessionAction={(sess) => setActiveSessionForAction(sess)}
            onCompleteSession={(sess) => setActiveSessionToComplete(sess)}
            onOpenMemberDetail={(mem) => setSelectedCrmMember(mem)}
            onNavigateToCoachSlots={() => setAdminTab("coach_slots")}
          />
        );

      case "coach_slots":
        return <AdminCoachSlotsTab />;

      case "settings":
        return <AdminStudioSettingsTab />;

      case "turnstile":
        return (
          <div className="space-y-6">
            {/* Direct Auto Scanner Launcher Hero - Apple White Liquid Glass */}
            <div className="bg-white/85 backdrop-blur-2xl border border-black/[0.06] rounded-[32px] p-6 sm:p-8 text-[#0F172A] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="space-y-2 text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Optik Turnike Kapı Sensörü</span>
                </div>
                <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                  Kamera & Turnike QR Okuyucu
                </h3>
                <p className="text-xs text-[#64748B] max-w-lg leading-relaxed">
                  Kapıya gelen üyenin telefonundaki 60 saniyelik dinamik kodu kameraya gösterin. Sistem turnikeyi anında açar ve bakiyeden seans düşer.
                </p>
              </div>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="relative z-10 px-8 py-4 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center gap-2.5 shrink-0 active:scale-98"
              >
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Kamerayı & Okuyucuyu Başlat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Turnstile Check-in Form */}
              <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
                <div>
                  <h4 className="font-bold text-base uppercase text-[#0F172A]">
                    Manuel Turnike Girişi Yap
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Kartı veya telefonu yanında olmayan üyeler için manuel giriş terminali.
                  </p>
                </div>

                {turnstileSuccessMsg && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{turnstileSuccessMsg}</span>
                  </div>
                )}

                {/* Member Preview */}
                <div className="p-4 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#0F172A]">{user?.fullName} ({user?.memberNo})</h5>
                    <span className="text-[11px] text-[#64748B]">{user?.membershipTier}</span>
                  </div>
                  <span className="text-sm font-black text-emerald-600">{remainingSessions} / {totalSessions} Seans</span>
                </div>

                <form onSubmit={handleTurnstileSubmit} className="space-y-3.5 text-xs font-sans">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      EŞLİK EDEN KOÇ / ANTRENÖR
                    </label>
                    <div className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A] flex items-center justify-between">
                      <span>İlker Yüksel (Kurucu & Baş Antrenör)</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md">
                        1:1 Birebir
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      ANTRENMAN TÜRÜ
                    </label>
                    <input
                      type="text"
                      required
                      value={turnstileSessionType}
                      onChange={(e) => setTurnstileSessionType(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                      KOÇUN SEANS NOTU
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={turnstileNote}
                      onChange={(e) => setTurnstileNote(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md active:scale-98"
                  >
                    Turnikeyi Aç (1 Seans Düşür)
                  </button>
                </form>
              </div>

              {/* Live Turnstile Activity Feed */}
              <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-black/[0.05] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-base uppercase text-[#0F172A]">
                        Canlı Turnike Giriş Akışı ({checkInLogs.length})
                      </h4>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {checkInLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0F172A]">{log.sessionType}</span>
                          <span className="text-[10px] font-mono text-[#64748B]">{log.date} {log.time}</span>
                        </div>
                        <p className="text-[#64748B] text-[11px]">
                          Eğitmen: <strong className="text-[#0F172A]">İlker Yüksel</strong> (Kurucu & Baş Antrenör) • {log.keyMetric || "Standart Seans"}
                        </p>
                        <p className="text-[11px] text-[#334155] italic bg-white p-2 rounded-lg border border-black/[0.03]">
                          &ldquo;{log.performanceNote}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.05] text-[11px] text-[#94A3B8] flex items-center justify-between">
                  <span>Turnike Donanımı: Online (Optik Tarayıcı v2.4)</span>
                  <span className="text-emerald-600 font-bold">● Aktif</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "cashier": {
        const posTotal = orders
          .filter((o) => o.paymentMethod === "pos_register" && o.paymentStatus === "completed")
          .reduce((acc, c) => acc + c.amount, 0);
        const cashTotal = orders
          .filter((o) => o.paymentMethod === "cash_register" && o.paymentStatus === "completed")
          .reduce((acc, c) => acc + c.amount, 0);
        const transferTotal = orders
          .filter((o) => o.paymentMethod === "bank_transfer" && o.paymentStatus === "completed")
          .reduce((acc, c) => acc + c.amount, 0);

        return (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            {/* Cashier Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/[0.05] pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stüdyo Kasası & Mali Akış</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg uppercase text-[#0F172A] font-display">
                  Kasa Tahsilatları & Sipariş Onayları ({orders.length})
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Kasada nakit, POS veya banka havalesi ile oluşturulan siparişleri onaylayın, yeni satış yapın veya döküm alın.
                </p>
              </div>

              {/* Cashier Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsQuickSaleOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Hızlı Satış Yap</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportOrdersCSV}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Tüm kasa siparişlerini CSV dosyası olarak bilgisayara indir"
                >
                  <Download className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Excel / CSV</span>
                </button>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="p-2.5 border border-black/[0.08] rounded-xl text-xs font-medium bg-[#F8FAFC] text-[#0F172A]"
                >
                  <option value="all">Tüm Siparişler ({orders.length})</option>
                  <option value="pending">Sadece Onay Bekleyenler ({pendingOrdersCount})</option>
                  <option value="completed">Tahsil Edilenler</option>
                </select>
              </div>
            </div>

            {/* Financial Breakdown Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  POS KREDİ KARTI
                </span>
                <span className="text-xl font-black text-[#0F172A] block mt-1">
                  ₺{posTotal.toLocaleString("tr-TR")}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Doğrudan Terminal</span>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  KASADA NAKİT
                </span>
                <span className="text-xl font-black text-[#0F172A] block mt-1">
                  ₺{cashTotal.toLocaleString("tr-TR")}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Elden Tahsilat</span>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  HAVALE & FAST
                </span>
                <span className="text-xl font-black text-[#0F172A] block mt-1">
                  ₺{transferTotal.toLocaleString("tr-TR")}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Banka Hesabı</span>
              </div>
            </div>

            <div className="space-y-3">
              {orders
                .filter((o) => {
                  if (orderFilter === "pending") return o.paymentStatus !== "completed";
                  if (orderFilter === "completed") return o.paymentStatus === "completed";
                  return true;
                })
                .map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F172A]">{ord.packageName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.paymentStatus === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}
                        >
                          {ord.paymentStatus === "completed"
                            ? "✓ Tahsil Edildi"
                            : ord.paymentMethod === "cash_register"
                            ? "Kasada Nakit Bekliyor"
                            : ord.paymentMethod === "pos_register"
                            ? "Kasada POS Bekliyor"
                            : "Havale Bekliyor"}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Sipariş: <strong>{ord.orderNumber}</strong> • Üye: {user?.fullName} ({user?.memberNo}) • {ord.createdAt}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Ödeme Metodu: <strong className="uppercase">{ord.paymentMethod}</strong> • Makbuz Kodu: {ord.receiptCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 border-black/[0.05] pt-2 md:pt-0">
                      <span className="text-base font-black text-[#0F172A]">{ord.formattedAmount}</span>

                      {ord.paymentStatus !== "completed" ? (
                        <button
                          onClick={() => approveOrder(ord.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-98"
                        >
                          ✓ Kasada Tahsil Et (Onayla)
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Fatura Kesildi</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      }

      case "members":
        return (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stüdyo Danışan Portföyü</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg uppercase text-[#0F172A] font-display">
                  Stüdyo Üye Rehberi & Biyomekanik CRM ({filteredMembers.length})
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Tüm kayıtlı üyelerin seans haklarını, sağlık notlarını, sakatlık uyarılarını ve gelişim metriklerini yönetin.
                </p>
              </div>

              {/* Actions: Add Member & Search */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsCreateMemberOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-98"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Yeni Üye Kaydet</span>
                </button>

                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="İsim, No veya Tel Ara..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredMembers.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 bg-[#F8FAFC] hover:bg-white border border-black/[0.04] hover:border-black/[0.1] rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all shadow-2xs"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {mem.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A]">{mem.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-200/50">
                          {mem.memberNo}
                        </span>
                        <span className="text-[10px] font-semibold text-[#64748B]">{mem.tier}</span>
                      </div>

                      {/* Injury warning pill if present */}
                      {mem.injuryAlert && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold rounded-lg">
                          <span>🚨 {mem.injuryAlert}</span>
                        </div>
                      )}

                      <p className="text-xs text-[#64748B]">
                        İletişim: <strong className="text-[#0F172A]">{mem.phone}</strong> • Antrenör: İlker Yüksel • Hedef: {mem.targetGoal || "Kuvvet & Biyomekanik"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between lg:justify-end border-t lg:border-t-0 border-black/[0.04] pt-3 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-[#64748B] block uppercase font-bold">KALAN SEANS</span>
                      <span className="text-base font-black text-emerald-600">{mem.remaining} / {mem.total}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(mem.name, mem.phone)}
                        className="px-2.5 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        title="WhatsApp Mesajı Gönder"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrmMember(mem)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Sağlık Kartı</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrmMember(mem)}
                        className="px-3 py-2 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+ Seans</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "inventory":
        return <AdminInventoryTab />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#0F172A] font-sans antialiased pb-28">
      {/* Top Admin Header Bar - Apple Frosted Liquid Glass */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          {/* Brand & Studio Status */}
          {/* Brand & Studio Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-xs tracking-tight shadow-2xs shrink-0">
              CF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse shrink-0" />
                <h1 className="font-bold text-xs sm:text-sm tracking-tight uppercase text-[#0F172A] truncate">
                  CORE & FIT OS
                </h1>
                <span className="hidden md:inline-block text-[10px] px-2 py-0.5 bg-slate-100 text-[#64748B] font-semibold rounded-full border border-black/[0.05] shrink-0">
                  Yönetici Paneli
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] hidden sm:block font-medium mt-0.5 truncate">
                Nişantaşı Private Studio • İlker Yüksel
              </p>
            </div>
          </div>

          {/* Header Actions: Clean Responsive Layout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Fast Desk Sale Button (Visible on md+) */}
            <button
              onClick={() => setIsQuickSaleOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition-all active:scale-98 shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>+ Hızlı Satış</span>
            </button>

            {/* Quick Manual Session Create Button (Visible on sm+) */}
            <button
              onClick={() => setIsCreateSessionOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-black text-white font-bold text-xs rounded-full shadow-xs transition-all active:scale-98 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Seans</span>
            </button>

            {/* Quick Turnike QR Button (Compact on mobile) */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 font-bold text-xs rounded-full transition-all active:scale-98 shadow-2xs shrink-0"
              title="Turnike QR Tarayıcı"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Turnike QR</span>
              <span className="sm:hidden text-[11px] font-bold">QR</span>
            </button>

            {/* View Mode Switcher (Desktop Only) */}
            <button
              onClick={() => setViewMode(viewMode === "app_frame" ? "responsive" : "app_frame")}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] rounded-full text-xs font-semibold text-[#0F172A] transition-all shadow-2xs shrink-0"
              title={viewMode === "app_frame" ? "Geniş Ekran Görünümüne Geç" : "iPhone Görünümüne Geç"}
            >
              {viewMode === "app_frame" ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Geniş</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>iPhone</span>
                </>
              )}
            </button>

            {/* Solo Owner & Head Coach Profile Badge (Visible on sm+ to prevent clash on mobile) */}
            <div className="hidden sm:flex items-center gap-2 pl-2 sm:pl-3 border-l border-black/[0.08] shrink-0">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80"
                  alt="İlker Yüksel"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-2xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="text-left leading-tight hidden md:block">
                <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                  <span>İlker Yüksel</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 font-bold rounded-md">
                    Kurucu
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] font-medium">Baş Antrenör</div>
              </div>
            </div>

            {/* Mobile Drawer Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] border border-black/[0.08] transition-all active:scale-95 flex items-center justify-center shrink-0"
              title="Yönetici Menüsünü Aç"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5 text-[#0F172A]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="pt-6">
        {viewMode === "app_frame" ? (
          /* iPhone 16 Pro Style Mobile App Frame for Admin */
          <div className="py-6 px-4 flex justify-center items-center">
            <div className="relative w-full max-w-[420px] bg-white rounded-[50px] border-[9px] border-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col h-[850px]">
              {/* iPhone Dynamic Island */}
              <div className="w-28 h-6 bg-slate-900 rounded-full mx-auto mt-2.5 shrink-0 z-30 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              </div>

              {/* In-Frame App Header */}
              <div className="px-5 pt-3 pb-2 border-b border-black/[0.05] flex items-center justify-between shrink-0">
                <span className="font-black text-xs uppercase tracking-tight text-[#0F172A]">
                  CORE & FIT OS
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsCreateSessionOpen(true)}
                    className="p-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Seans</span>
                  </button>
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Tara</span>
                  </button>
                </div>
              </div>

              {/* Scrollable App Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderTabContent()}
              </div>

              {/* Floating Dock Inside Frame */}
              <div className="shrink-0 pt-2 pb-2 px-3 flex items-center justify-center">
                <AdminFloatingNav
                  activeTab={adminTab}
                  setActiveTab={setAdminTab}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              </div>

              {/* iOS Home Indicator */}
              <div className="w-32 h-1 bg-black/20 rounded-full mx-auto my-1.5 shrink-0" />
            </div>
          </div>
        ) : (
          /* Wide Full-Width Responsive Dashboard */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pb-28 lg:pb-12">
            {/* Apple macOS / iOS Segmented Tab Navigation Bar (Web görünümde tam ekrana sığar, mobilde pürüzsüz kayar) */}
            <div className="p-1 sm:p-1.5 bg-black/[0.03] backdrop-blur-2xl border border-black/[0.05] rounded-2xl sm:rounded-[26px] flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar shadow-inner lg:grid lg:grid-cols-8 lg:overflow-x-visible lg:gap-1.5 w-full">
              {[
                { id: "overview", label: "Genel Bakış", icon: TrendingUp },
                { id: "turnstile", label: "Turnike & Hızlı QR", icon: QrCode },
                { id: "schedule", label: "Seans Programı", icon: Calendar, badge: bookedSessions.length },
                { id: "coach_slots", label: "Koç Randevu Saatleri", icon: Clock },
                { id: "cashier", label: "Kasa & Ödemeler", icon: CreditCard, badge: pendingOrdersCount },
                { id: "members", label: "Üye Rehberi (CRM)", icon: Users },
                { id: "inventory", label: "Envanter & Donanım", icon: Boxes },
                { id: "settings", label: "İşletme Ayarları", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 lg:px-1.5 xl:px-2.5 rounded-xl sm:rounded-2xl text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none shrink-0 lg:shrink lg:w-full ${
                      isActive
                        ? "bg-white text-[#0F172A] shadow-[0_2px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] font-bold"
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? "text-[#0F172A]" : "text-[#64748B]"}`} />
                    <span className="truncate">{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold shrink-0 ${
                          isActive ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Active Tab Header (When not on overview) */}
            {adminTab !== "overview" && (
              <div className="flex items-center justify-between py-1 px-1 sm:hidden">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-[#0F172A]">
                    {ADMIN_TAB_LABELS[adminTab] || "Yönetim Alanı"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTab("overview")}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors"
                >
                  ← Genel Bakış
                </button>
              </div>
            )}

            {/* Render Tab Body */}
            <div>{renderTabContent()}</div>
          </div>
        )}
      </main>

      {/* Floating Apple Glass Dock on Mobile Screens */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <AdminFloatingNav
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          onOpenScanner={() => setIsScannerOpen(true)}
        />
      </div>

      {/* MODAL 0: Manual Create Session */}
      <AdminCreateSessionModal
        isOpen={isCreateSessionOpen}
        onClose={() => setIsCreateSessionOpen(false)}
        defaultCoachName="İlker Yüksel"
      />

      {/* MODAL 1: Auto Optical QR Scanner Terminal */}
      <AdminQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        defaultCoach="İlker Yüksel"
      />

      {/* MODAL 2: Complete Session & Coach Note */}
      <AnimatePresence>
        {activeSessionToComplete && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A]"
            >
              <button
                onClick={() => setActiveSessionToComplete(null)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold font-display uppercase text-[#0F172A] mb-1">
                Seansı Tamamla & Koç Notu Gir
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                İlker Yüksel (Kurucu & Baş Antrenör) • {activeSessionToComplete.timeSlot} seansı
              </p>

              <form onSubmit={handleCompleteSession} className="space-y-3.5 text-xs font-sans">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    KOÇUN PERFORMANS DEĞERLENDİRMESİ
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={sessionCompleteNote}
                    onChange={(e) => setSessionCompleteNote(e.target.value)}
                    placeholder="Üyenin bugünkü formu, tamamlanan setler ve gelişim analizi..."
                    className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    ÖNEMLİ METRİK (PR / NABIZ / KCAL)
                  </label>
                  <input
                    type="text"
                    value={sessionCompleteMetric}
                    onChange={(e) => setSessionCompleteMetric(e.target.value)}
                    placeholder="Örn: 100 kg Bench Press PR • 520 kcal"
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSessionToComplete(null)}
                    className="px-4 py-2 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors"
                  >
                    Dersi Tamamla & Üye Paneline İşle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Add Extra Sessions */}
      <AnimatePresence>
        {isAddSessionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A]"
            >
              <button
                onClick={() => setIsAddSessionModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold font-display uppercase text-[#0F172A] mb-1">
                Üyeye Ekstra Seans Tanımla
              </h3>
              <p className="text-xs text-[#64748B] mb-5">
                {user?.fullName} ({user?.memberNo}) hesabına stüdyo yönetimi tarafından seans yükleyin.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 6, 12].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setAddSessionCount(cnt)}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                      addSessionCount === cnt
                        ? "border-[#0F172A] bg-slate-100 text-[#0F172A] ring-2 ring-[#0F172A]"
                        : "border-black/[0.08] text-[#64748B]"
                    }`}
                  >
                    +{cnt} Seans
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    adminAddSessions(addSessionCount);
                    setIsAddSessionModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase transition-colors"
                >
                  +{addSessionCount} Seansı Hesaba Yükle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Quick POS & Desk Sale Modal */}
      <AdminQuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
      />

      {/* MODAL 5: WhatsApp Direct Template Messenger */}
      <AdminWhatsAppModal
        isOpen={whatsAppData.isOpen}
        onClose={() => setWhatsAppData((prev) => ({ ...prev, isOpen: false }))}
        defaultMemberName={whatsAppData.name}
        defaultPhone={whatsAppData.phone}
        defaultSessionInfo={whatsAppData.sessionInfo}
      />

      {/* MODAL 6: Session Reschedule / Cancel / No-Show Modal */}
      <AdminSessionActionModal
        session={activeSessionForAction}
        onClose={() => setActiveSessionForAction(null)}
      />

      {/* MODAL 7: Member CRM Health & Biometrics Detail Card */}
      <AdminMemberDetailModal
        member={selectedCrmMember}
        onClose={() => setSelectedCrmMember(null)}
        onOpenWhatsApp={(name, phone) => handleOpenWhatsApp(name, phone)}
      />

      {/* MODAL 8: Create New Member Modal */}
      <AdminCreateMemberModal
        isOpen={isCreateMemberOpen}
        onClose={() => setIsCreateMemberOpen(false)}
      />

      {/* MODAL 9: Create New Session Modal */}
      <AdminCreateSessionModal
        isOpen={isCreateSessionOpen}
        onClose={() => {
          setIsCreateSessionOpen(false);
          setCreateSessionInitialDate(undefined);
          setCreateSessionInitialTimeSlot(undefined);
        }}
        defaultCoachName={selectedRole}
        initialDate={createSessionInitialDate}
        initialTimeSlot={createSessionInitialTimeSlot}
      />

      {/* MOBILE SLIDING DRAWER (Sağdan Sola Açılan Yönetici Menüsü) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Sliding Drawer Sheet (Right to Left) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-[320px] sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-xs">
                    CF
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-tight">
                      CORE & FIT OS
                    </h4>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                      Yönetici Menüsü
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white border border-black/[0.08] text-[#64748B] hover:text-[#0F172A] transition-colors active:scale-95 shadow-2xs"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Coach Profile Card */}
                <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80"
                    alt="İlker Yüksel"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-[#0F172A] truncate">İlker Yüksel</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-[#64748B]">Kurucu & Baş Antrenör</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-semibold text-emerald-700">Nişantaşı Studio Aktif</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsScannerOpen(true);
                      setIsMobileDrawerOpen(false);
                    }}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Turnike QR</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateSessionOpen(true);
                      setIsMobileDrawerOpen(false);
                    }}
                    className="p-2.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Yeni Seans</span>
                  </button>
                </div>

                {/* Navigation Items (All 8 Admin Tabs) */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 block mb-1.5">
                    YÖNETİM ALANLARI
                  </span>
                  {[
                    { id: "overview", label: "Genel Bakış", icon: TrendingUp },
                    { id: "turnstile", label: "Turnike & Hızlı QR", icon: QrCode },
                    { id: "schedule", label: "Seans Programı", icon: Calendar, badge: bookedSessions.length },
                    { id: "coach_slots", label: "Koç Randevu Saatleri", icon: Clock },
                    { id: "cashier", label: "Kasa & Ödemeler", icon: CreditCard, badge: pendingOrdersCount },
                    { id: "members", label: "Üye Rehberi (CRM)", icon: Users },
                    { id: "inventory", label: "Envanter & Donanım", icon: Boxes },
                    { id: "settings", label: "İşletme Ayarları", icon: Settings },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = adminTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setAdminTab(tab.id as any);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#0F172A] text-white shadow-xs font-bold"
                            : "text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-[#64748B]"}`} />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-black/[0.06] bg-slate-50/80 space-y-2">
                <Link
                  href="/portal"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-black/[0.08] hover:border-black/[0.16] rounded-xl text-xs font-bold text-[#0F172A] transition-all shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Müşteri Portalına Git</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  <span>Ana Web Sitesine Dön</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
