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
          <div className="space-y-6">
            {/* Solo Coach & Studio Model Executive Banner - Apple Liquid Glass */}
            <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.06] rounded-[32px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>TEK YETKİLİ BAŞ ANTRENÖR YÖNETİMİNDE (1:1)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
                    İlker Yüksel — Birebir Stüdyo İşletim Merkezi
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
                    Core & Fit Nişantaşı Studio, kurucu baş antrenör İlker Yüksel tarafından bizzat işletilmekte ve yönetilmektedir. Stüdyomuzda asistan veya stajyer antrenör çalıştırılmaz; her üye doğrudan 10+ yıl deneyimli kurucumuzla 1:1 biyomekanik ve kuvvet çalışır.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold text-[#334155]">
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 shrink-0">
                  <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">GÜNLÜK SEANS</span>
                    <span className="text-lg font-black text-[#0F172A]">{bookedSessions.length} / 8 Planlı</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">1:1 Özel Kapasite</span>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">MOLA ARALIĞI</span>
                    <span className="text-lg font-black text-[#0F172A]">15 Dakika</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Hijyen & Hazırlık</span>
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
                        className="p-5 bg-[#F8FAFC] hover:bg-white border border-black/[0.05] hover:border-black/[0.12] rounded-2xl transition-all space-y-3.5 shadow-2xs"
                      >
                        {/* Session Top Bar: Time, Station, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.04] pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="px-3 py-1 bg-[#0F172A] text-white rounded-xl flex items-center gap-1.5 shadow-2xs">
                              <Clock className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs font-black tracking-tight">{startTime}</span>
                              {endTime && <span className="text-[10px] text-slate-300 font-medium">- {endTime}</span>}
                              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1 py-0.2 rounded ml-1">
                                60 DK
                              </span>
                            </div>

                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase">
                              {stationName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Birebir (1:1) Seans</span>
                            </span>
                            <span className="text-[11px] font-mono text-[#64748B]">📅 {sess.date}</span>
                          </div>
                        </div>

                        {/* Member & Coach Card Duo */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Member */}
                          <div className="p-3 bg-white rounded-xl border border-black/[0.04] space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] uppercase">
                              <span>DANIŞAN</span>
                              <span className="text-emerald-600 font-bold">{remainingSessions} Seans Hak</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                {memberName.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-[#0F172A] leading-tight">
                                  {memberName} <span className="text-[#64748B] font-mono text-[10px]">({memberNo})</span>
                                </h4>
                                <p className="text-[10px] text-[#64748B]">VIP 1:1 Personal Training</p>
                              </div>
                            </div>
                          </div>

                          {/* Coach (İlker Yüksel) */}
                          <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase">
                              <span>BAŞ ANTRENÖR</span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">1:1 Solo</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80"
                                alt="İlker Yüksel"
                                className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-400/40 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-xs text-white leading-tight flex items-center gap-1">
                                  <span>{coachName}</span>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                </h4>
                                <p className="text-[10px] text-slate-300">Kurucu & Baş Antrenör • NSCA-CSCS</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Focus & Protocol */}
                        <div className="p-3 bg-white rounded-xl border border-black/[0.04] space-y-1 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                              🎯 ODAK
                            </span>
                            <span className="font-bold text-[#0F172A]">{focusArea}</span>
                          </div>
                          <p className="text-[11px] text-[#475569] leading-relaxed italic pl-1 border-l-2 border-emerald-500 mt-1">
                            &ldquo;{notes}&rdquo;
                          </p>
                        </div>

                        {/* Footer Readiness & Complete Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#64748B] flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md">
                              <Check className="w-3 h-3 text-emerald-600" />
                              İstasyon Sterilize
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Nabız Bandı Hazır
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenWhatsApp(memberName, "+90 532 555 0124", {
                                  date: sess.date,
                                  timeSlot: sess.timeSlot,
                                  focusArea,
                                })
                              }
                              className="px-2.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                              title="WhatsApp Hatırlatması Gönder"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveSessionForAction(sess)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Seansı Ertele veya İptal Et"
                            >
                              <RotateCcw className="w-3 h-3 text-[#64748B]" />
                              <span>Ertele / İptal</span>
                            </button>

                            <button
                              onClick={() => setActiveSessionToComplete(sess)}
                              className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs active:scale-98 flex items-center gap-1"
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-xs tracking-tight shadow-2xs shrink-0">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse shrink-0" />
                <h1 className="font-bold text-xs sm:text-sm tracking-tight uppercase text-[#0F172A]">
                  CORE & FIT STUDIO OS
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 bg-slate-100 text-[#64748B] font-semibold rounded-full border border-black/[0.05]">
                  Yönetim Paneli
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] hidden sm:block font-medium mt-0.5">
                Nişantaşı Private Studio • İlker Yüksel
              </p>
            </div>
          </div>

          {/* Header Actions: Quick Sale, Manual Session, Auto QR Scanner, View Mode & Solo Coach Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Fast Desk Sale Button */}
            <button
              onClick={() => setIsQuickSaleOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition-all active:scale-98"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Hızlı Satış</span>
              <span className="sm:hidden">+ Satış</span>
            </button>

            {/* Quick Manual Session Create Button */}
            <button
              onClick={() => setIsCreateSessionOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-[#0F172A] hover:bg-black text-white font-bold text-xs rounded-full shadow-xs transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">+ Manuel Seans</span>
              <span className="sm:hidden">+ Seans</span>
            </button>

            {/* Quick Auto QR Scanner Button */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 font-bold text-xs rounded-full transition-all active:scale-98 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Turnike QR</span>
            </button>

            {/* View Mode Switcher (Desktop Only) */}
            <button
              onClick={() => setViewMode(viewMode === "app_frame" ? "responsive" : "app_frame")}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] rounded-full text-xs font-semibold text-[#0F172A] transition-all shadow-2xs"
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

            {/* Solo Owner & Head Coach Profile Badge (Apple Style) */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-black/[0.08]">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Top KPI Metric Cards - Apple Glass Aesthetic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/85 backdrop-blur-xl border border-black/[0.05] rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                  <span className="tracking-tight text-[11px] font-bold uppercase">GÜNLÜK TURNİKE GİRİŞİ</span>
                  <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#0F172A] tracking-tight">{checkInLogs.length + 34}</span>
                  <span className="text-xs font-semibold text-emerald-600">↑ %14 artış</span>
                </div>
                <span className="text-[11px] text-[#94A3B8] block mt-1">Bugün tamamlanan seanslar</span>
              </div>

              <div className="bg-white/85 backdrop-blur-xl border border-black/[0.05] rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                  <span className="tracking-tight text-[11px] font-bold uppercase">STÜDYO DOLULUK ORANI</span>
                  <div className="w-8 h-8 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#0F172A] tracking-tight">%70</span>
                  <span className="text-xs text-[#64748B]">14 / 20 İstasyon</span>
                </div>
                <span className="text-[11px] text-[#94A3B8] block mt-1">Nişantaşı anlık kapasite</span>
              </div>

              <div className="bg-white/85 backdrop-blur-xl border border-black/[0.05] rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                  <span className="tracking-tight text-[11px] font-bold uppercase">AYLIK TOPLAM CİRO</span>
                  <div className="w-8 h-8 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#0F172A] tracking-tight">₺428.000</span>
                  <span className="text-xs font-semibold text-emerald-600">Hedef: %107</span>
                </div>
                <span className="text-[11px] text-[#94A3B8] block mt-1">Eylül 2026 gerçekleşen ciro</span>
              </div>

              <div className="bg-white/85 backdrop-blur-xl border border-black/[0.05] rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                  <span className="tracking-tight text-[11px] font-bold uppercase">BEKLEYEN KASA TAHSİLATI</span>
                  <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                    <Banknote className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-600 tracking-tight">{pendingOrdersCount} Sipariş</span>
                  <span className="text-xs font-semibold text-[#64748B]">Kasada / Havale</span>
                </div>
                <span className="text-[11px] text-[#94A3B8] block mt-1">Onay bekleyen ödemeler</span>
              </div>
            </div>

            {/* Apple macOS / iOS Segmented Tab Navigation Bar */}
            <div className="p-1.5 bg-black/[0.03] backdrop-blur-2xl border border-black/[0.05] rounded-[26px] flex items-center gap-1.5 overflow-x-auto shadow-inner">
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
                    className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none ${
                      isActive
                        ? "bg-white text-[#0F172A] shadow-[0_2px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] font-bold"
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#0F172A]" : "text-[#64748B]"}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
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

            {/* Render Tab Body */}
            <div>{renderTabContent()}</div>
          </div>
        )}
      </main>

      {/* Floating Apple Glass Dock on Mobile Screens */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
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
    </div>
  );
};
