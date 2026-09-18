"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMember } from "@/context/MemberContext";
import { PaymentMethod } from "@/types/portal";

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
  } = useMember();

  // Role switch
  const [selectedRole, setSelectedRole] = useState<string>("Genel Stüdyo Yöneticisi");
  const [adminTab, setAdminTab] = useState<"overview" | "schedule" | "turnstile" | "cashier" | "members" | "coaches">("overview");

  // Filter states
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [memberSearch, setMemberSearch] = useState<string>("");

  // Turnstile check-in simulator state
  const [turnstileCoach, setTurnstileCoach] = useState<string>("Mert Aksoy");
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

  // Mock members list for CRM
  const studioMembers = [
    {
      id: "mem-1",
      name: user?.fullName || "Ege Mert",
      memberNo: user?.memberNo || "CF-89210",
      tier: user?.membershipTier || "VIP 1:1 Personal Training",
      remaining: remainingSessions,
      total: totalSessions,
      status: "Aktif",
      phone: user?.phone || "+90 532 555 0124",
      coach: "Mert Aksoy",
    },
    {
      id: "mem-2",
      name: "Burak Demir",
      memberNo: "CF-77102",
      tier: "Performance Athlete",
      remaining: 4,
      total: 12,
      status: "Aktif",
      phone: "+90 533 421 8899",
      coach: "Can Demir",
    },
    {
      id: "mem-3",
      name: "Deniz Aydın",
      memberNo: "CF-64019",
      tier: "VIP 1:1 Personal Training",
      remaining: 18,
      total: 24,
      status: "Aktif",
      phone: "+90 530 112 3344",
      coach: "Selin Yılmaz",
    },
    {
      id: "mem-4",
      name: "Zeynep Kaya",
      memberNo: "CF-51920",
      tier: "Studio Member",
      remaining: 1,
      total: 8,
      status: "Yenileme Bekliyor",
      phone: "+90 542 998 7766",
      coach: "Mert Aksoy",
    },
  ];

  const filteredMembers = studioMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.memberNo.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const pendingOrdersCount = orders.filter((o) => o.paymentStatus !== "completed").length;

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#0F172A] font-sans antialiased pb-20">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Üye Paneline Dön</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="font-bold text-sm tracking-tight uppercase">
                CORE & FIT STUDIO OS <span className="text-slate-400 font-normal">| Yönetici & Koç Portalı</span>
              </h1>
            </div>
          </div>

          {/* Role selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:inline">Görünüm:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-400"
            >
              <option value="Genel Stüdyo Yöneticisi">👑 Genel Stüdyo Yöneticisi</option>
              <option value="Mert Aksoy (Baş Antrenör)">🏋️ Mert Aksoy (Baş Antrenör)</option>
              <option value="Selin Yılmaz (Performans Koçu)">🤸 Selin Yılmaz (Performans Koçu)</option>
              <option value="Can Demir (Kondisyon Koçu)">🏃 Can Demir (Kondisyon Koçu)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
              <span>GÜNLÜK TURNİKE GİRİŞİ</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0F172A]">{checkInLogs.length + 34}</span>
              <span className="text-xs font-semibold text-emerald-600">↑ %14 artış</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block mt-1">Bugün tamamlanan seanslar</span>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
              <span>STÜDYO DOLULUK ORANI</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0F172A]">%70</span>
              <span className="text-xs text-[#64748B]">14 / 20 İstasyon</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block mt-1">Nişantaşı stüdyo anlık kapasite</span>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
              <span>AYLIK TOPLAM CİRO</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0F172A]">₺428.000</span>
              <span className="text-xs font-semibold text-emerald-600">Hedef: %107</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block mt-1">Eylül 2026 gerçekleşen ciro</span>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
              <span>BEKLEYEN KASA TAHSİLATI</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600">{pendingOrdersCount} Sipariş</span>
              <span className="text-xs font-semibold text-[#64748B]">Kasada / Havale</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block mt-1">Onay bekleyen ödemeler</span>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-black/[0.06]">
          {[
            { id: "overview", label: "Genel Bakış", icon: TrendingUp },
            { id: "schedule", label: "Seans Programı & Randevular", icon: Calendar, badge: bookedSessions.length },
            { id: "turnstile", label: "Turnike & Hızlı Giriş", icon: UserCheck },
            { id: "cashier", label: "Kasa & Ödeme Onayları", icon: CreditCard, badge: pendingOrdersCount },
            { id: "members", label: "Üye Yönetimi (CRM)", icon: Users },
            { id: "coaches", label: "Koç Performansları", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/10"
                    : "bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] border border-black/[0.05]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
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

        {/* TAB 1: OVERVIEW */}
        {adminTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule Snapshot */}
              <div className="lg:col-span-2 bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#10B981]" />
                    <h3 className="font-bold text-sm uppercase text-[#0F172A]">
                      Yaklaşan Seanslar ({bookedSessions.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setAdminTab("schedule")}
                    className="text-xs font-semibold text-[#2563EB] hover:underline"
                  >
                    Tüm Programı Gör →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookedSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-bold text-xs shrink-0">
                          <span>{sess.timeSlot}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-[#0F172A]">{user?.fullName || "Ege Mert"}</h4>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                              {sess.station}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            Koç: <strong className="text-[#0F172A] font-semibold">{sess.coachName}</strong> • {sess.focusArea}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveSessionToComplete(sess)}
                        className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold self-end sm:self-center transition-colors"
                      >
                        ✓ Seansı Tamamla
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Turnstile Action Widget */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">
                    Hızlı Turnike Geçişi
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Stüdyoya giriş yapan üyelerin seansını 1 tıkla düşürün ve koç antrenman notunu anında kaydedin.
                  </p>

                  <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Örnek Üye:</span>
                      <span className="font-bold text-white">{user?.fullName} ({user?.memberNo})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kalan Seans:</span>
                      <span className="font-bold text-emerald-400">{remainingSessions} Seans</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setAdminTab("turnstile")}
                  className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
                >
                  Turnike Terminalini Aç →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE & APPOINTMENTS */}
        {adminTab === "schedule" && (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
              <div>
                <h3 className="font-bold text-base uppercase text-[#0F172A]">
                  Koç Seans Programı & Randevu Takvimi
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Planlanmış tüm birebir seansları koç bazlı inceleyin ve yönetin.
                </p>
              </div>

              {/* Coach Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] font-medium">Koç:</span>
                <select
                  value={coachFilter}
                  onChange={(e) => setCoachFilter(e.target.value)}
                  className="p-2 border border-black/[0.08] rounded-xl text-xs font-medium bg-[#F8FAFC] text-[#0F172A]"
                >
                  <option value="all">Tüm Koçlar</option>
                  <option value="Mert Aksoy">Mert Aksoy</option>
                  <option value="Selin Yılmaz">Selin Yılmaz</option>
                  <option value="Can Demir">Can Demir</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {bookedSessions
                .filter((s) => coachFilter === "all" || s.coachName === coachFilter)
                .map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-black/[0.1] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <span className="text-[10px] opacity-70">SAAT</span>
                        <span className="text-sm">{sess.timeSlot}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#0F172A]">
                            {user?.fullName || "Ege Mert"}
                          </h4>
                          <span className="text-xs text-[#64748B]">({user?.memberNo})</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                            {sess.station}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mt-1 font-medium">
                          📅 {sess.date} • Koç: <strong className="text-[#0F172A]">{sess.coachName}</strong> ({sess.coachTitle})
                        </p>
                        <p className="text-xs text-[#334155] mt-1 bg-white p-2 rounded-lg border border-black/[0.04]">
                          🎯 <strong>Odak:</strong> {sess.focusArea} — {sess.notes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => setActiveSessionToComplete(sess)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition-colors shadow-2xs"
                      >
                        ✓ Seansı Tamamla & Not Gir
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: TURNSTILE SIMULATOR */}
        {adminTab === "turnstile" && (
          <div className="max-w-2xl mx-auto bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#0F172A] pt-2">
                Stüdyo Turnike & Giriş Terminali
              </h3>
              <p className="text-xs text-[#64748B]">
                Üyenin girişini onaylayın, kalan seansından 1 düşürün ve koç gelişim notunu işleyin.
              </p>
            </div>

            {turnstileSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{turnstileSuccessMsg}</span>
              </div>
            )}

            {/* Member Snapshot Card */}
            <div className="p-4 bg-[#F8FAFC] border border-black/[0.06] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30">
                  <img src={user?.avatarUrl} alt="Üye" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{user?.fullName}</h4>
                  <span className="text-xs text-[#64748B]">{user?.memberNo} • {user?.membershipTier}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#64748B] block">Kalan Seans</span>
                <span className="text-xl font-black text-emerald-600">{remainingSessions} / {totalSessions}</span>
              </div>
            </div>

            <form onSubmit={handleTurnstileSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                    EŞLİK EDEN KOÇ
                  </label>
                  <select
                    value={turnstileCoach}
                    onChange={(e) => setTurnstileCoach(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A]"
                  >
                    <option value="Mert Aksoy">Mert Aksoy (Baş Antrenör)</option>
                    <option value="Selin Yılmaz">Selin Yılmaz (Performans Koçu)</option>
                    <option value="Can Demir">Can Demir (Kondisyon Koçu)</option>
                  </select>
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
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  KOÇUN GELİŞİM & SEANS NOTU
                </label>
                <textarea
                  rows={3}
                  required
                  value={turnstileNote}
                  onChange={(e) => setTurnstileNote(e.target.value)}
                  placeholder="Üyenin performansı, set/tekrar sayıları ve postür geri bildirimleri..."
                  className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  ÖNE ÇIKAN VERİ / METRİK
                </label>
                <input
                  type="text"
                  value={turnstileMetric}
                  onChange={(e) => setTurnstileMetric(e.target.value)}
                  placeholder="Örn: 140 kg Deadlift PR • 580 kcal"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
              >
                Turnikeyi Aç & Seansı Başlat (1 Seans Düş)
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: CASHIER & ORDERS APPROVAL */}
        {adminTab === "cashier" && (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
              <div>
                <h3 className="font-bold text-base uppercase text-[#0F172A]">
                  Stüdyo Kasası & Ödeme Onayları ({orders.length})
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Kasada nakit, POS veya banka havalesi ile oluşturulan siparişleri onaylayın.
                </p>
              </div>

              {/* Order filter */}
              <div className="flex items-center gap-2">
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="p-2 border border-black/[0.08] rounded-xl text-xs font-medium bg-[#F8FAFC] text-[#0F172A]"
                >
                  <option value="all">Tüm Siparişler</option>
                  <option value="pending">Sadece Onay Bekleyenler</option>
                  <option value="completed">Ödenenler</option>
                </select>
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
        )}

        {/* TAB 5: MEMBERS CRM */}
        {adminTab === "members" && (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
              <div>
                <h3 className="font-bold text-base uppercase text-[#0F172A]">
                  Stüdyo Üye Rehberi & Seans Bakiye Yönetimi
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Tüm kayıtlı üyelerin seans haklarını, sağlık notlarını ve durumlarını görüntüleyin.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="İsim veya Üye No Ara..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredMembers.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {mem.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A]">{mem.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                          {mem.memberNo}
                        </span>
                        <span className="text-[10px] font-semibold text-[#64748B]">{mem.tier}</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        İletişim: {mem.phone} • Atanan Koç: <strong className="text-[#0F172A]">{mem.coach}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-[#64748B] block uppercase font-bold">KALAN SEANS</span>
                      <span className="text-base font-black text-emerald-600">{mem.remaining} / {mem.total}</span>
                    </div>

                    <button
                      onClick={() => setIsAddSessionModalOpen(true)}
                      className="px-3.5 py-2 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Seans Tanımla</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COACHES PERFORMANCE */}
        {adminTab === "coaches" && (
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="border-b border-black/[0.05] pb-4">
              <h3 className="font-bold text-base uppercase text-[#0F172A]">
                Eğitmen & Koç Performans Metrikleri
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Stüdyo antrenörlerimizin aylık seans sayıları, doluluk oranları ve üye memnuniyet skorları.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: "Mert Aksoy",
                  title: "Baş Antrenör (Head Coach)",
                  sessionsMonth: 42,
                  satisfaction: "%98",
                  revenue: "₺194.000",
                  specialty: "Biyomekanik, Deadlift & Güç",
                },
                {
                  name: "Selin Yılmaz",
                  title: "Kıdemli Performans Koçu",
                  sessionsMonth: 38,
                  satisfaction: "%96",
                  revenue: "₺152.000",
                  specialty: "Mobilite, Fonksiyonel Güç & Core",
                },
                {
                  name: "Can Demir",
                  title: "Kondisyon & Atletizm Koçu",
                  sessionsMonth: 29,
                  satisfaction: "%95",
                  revenue: "₺82.000",
                  specialty: "HIIT, VO2 Max & Hız",
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="p-5 bg-[#F8FAFC] border border-black/[0.05] rounded-3xl space-y-4 shadow-2xs"
                >
                  <div>
                    <h4 className="font-bold text-base text-[#0F172A]">{c.name}</h4>
                    <span className="text-xs text-emerald-600 font-semibold">{c.title}</span>
                    <p className="text-[11px] text-[#64748B] mt-1">{c.specialty}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-black/[0.05]">
                    <div className="p-2 bg-white rounded-xl">
                      <span className="text-[10px] text-[#64748B] block">SEANS</span>
                      <span className="font-black text-sm text-[#0F172A]">{c.sessionsMonth}</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl">
                      <span className="text-[10px] text-[#64748B] block">MEMNUNİYET</span>
                      <span className="font-black text-sm text-emerald-600">{c.satisfaction}</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl">
                      <span className="text-[10px] text-[#64748B] block">CİRO</span>
                      <span className="font-black text-xs text-[#0F172A]">{c.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Complete Session & Enter Coach Note */}
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
                {activeSessionToComplete.coachName} • {activeSessionToComplete.timeSlot} seansı
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

      {/* MODAL: Add Sessions to Member */}
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
    </div>
  );
};
