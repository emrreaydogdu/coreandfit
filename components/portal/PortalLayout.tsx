"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Calendar,
  Zap,
  BarChart3,
  User,
  Smartphone,
  Monitor,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Dumbbell,
  QrCode,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { PortalTab } from "@/types/portal";
import { DashboardTab } from "@/components/portal/tabs/DashboardTab";
import { SessionsTab } from "@/components/portal/tabs/SessionsTab";
import { WorkoutTab } from "@/components/portal/tabs/WorkoutTab";
import { StoreTab } from "@/components/portal/tabs/StoreTab";
import { HistoryTab } from "@/components/portal/tabs/HistoryTab";
import { ProfileTab } from "@/components/portal/tabs/ProfileTab";
import { FloatingGlassNav } from "@/components/portal/FloatingGlassNav";
import { QuickQrModal } from "@/components/portal/QuickQrModal";
import { todayIso } from "@/lib/slots";
import { ACTIVE_BOOKING_STATUSES } from "@/lib/training";

export const PortalLayout: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    viewMode,
    toggleViewMode,
    remainingSessions,
    bookedSessions,
    isQuickQrOpen,
    setIsQuickQrOpen,
    isAdmin,
    canGoBack,
    goBack,
  } = useMember();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  if (!user) return null;

  const nextSession = bookedSessions
    .filter((s) => ACTIVE_BOOKING_STATUSES.includes(s.status) && s.date >= todayIso())
    .sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot))[0];

  const NAV_ITEMS: { id: PortalTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Özet", icon: Home },
    { id: "workout", label: "Program", icon: Dumbbell },
    { id: "sessions", label: "Seanslarım", icon: Calendar },
    { id: "history", label: "Gelişim", icon: BarChart3 },
    { id: "store", label: "Paket Al", icon: Zap },
    { id: "profile", label: "Hesabım", icon: User },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "workout":
        return <WorkoutTab />;
      case "sessions":
        return <SessionsTab />;
      case "store":
        return <StoreTab />;
      case "history":
        return <HistoryTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#0F172A] flex flex-col font-sans selection:bg-[#0F172A] selection:text-white antialiased">
      {/* Apple-Style Glass Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] py-3.5 px-4 sm:px-8 shadow-[0_1px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand & Studio Indicator */}
          <div className="flex items-center gap-3 sm:gap-4">
            {canGoBack && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Geri Dön"
                className="inline-flex items-center justify-center gap-1.5 min-h-9 min-w-9 px-2 sm:px-3 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-semibold text-[#0F172A] whitespace-nowrap transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Geri Dön</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 font-sans font-black text-sm tracking-tight text-[#0F172A] whitespace-nowrap">
              <span>CORE & FIT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </div>

            {/* Next Upcoming Session dynamic pill */}
            {nextSession && (
              <button
                type="button"
                onClick={() => setActiveTab("sessions")}
                className="hidden xl:flex items-center gap-2 px-3 py-1 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-full text-[11px] font-semibold text-emerald-900 transition-colors"
                title="Gelecek Seansı Gör"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  Sonraki: {nextSession.date} {nextSession.timeSlot.split(" - ")[0]}
                </span>
              </button>
            )}
          </div>

          {/* Controls: Turnike QR, View Mode, Web Link, Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Turnike QR Button */}
            <button
              type="button"
              onClick={() => setIsQuickQrOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 group"
              title="Stüdyo Giriş Turnike QR Geçiş Kartı"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Turnike QR</span>
              <span className="sm:hidden text-[11px]">QR</span>
            </button>

            {/* View Mode Switcher (Desktop Only) */}
            <button
              onClick={toggleViewMode}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-black/[0.08] hover:border-black/[0.18] rounded-full text-xs font-semibold text-[#334155] hover:text-[#0F172A] transition-all shadow-sm"
              title={
                viewMode === "app_frame"
                  ? "Tam Ekran Dashboard Görünümüne Geç"
                  : "Apple Telefon Çerçevesine Geç"
              }
            >
              {viewMode === "app_frame" ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>Geniş Ekran</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>iPhone Görünümü</span>
                </>
              )}
            </button>

            {/* User Profile Pill */}
            <div
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-white hover:bg-[#F8FAFC] border border-black/[0.08] rounded-full cursor-pointer transition-all shadow-sm group"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-tight">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-[#10B981] font-semibold leading-none mt-0.5">
                  {remainingSessions} Ders Kaldı
                </span>
              </div>
            </div>

            {/* Mobile Drawer Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] border border-black/[0.08] transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-2xs"
              title="Menüyü Aç"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5 text-[#0F172A]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {viewMode === "app_frame" ? (
          /* Apple iPhone 16 Pro Natural Titanium Frame on Desktop */
          <div className="flex-1 py-10 px-4 flex items-center justify-center bg-[#E6E9F0]">
            <div className="relative w-full max-w-[410px] h-[860px] max-h-[92vh] bg-[#F8F9FA] border-[10px] border-[#2C2D32] rounded-[52px] shadow-[0_30px_90px_rgba(15,23,42,0.25)] flex flex-col overflow-hidden ring-1 ring-black/20">
              {/* Apple Dynamic Island & Status Bar */}
              <div className="w-full pt-3 pb-2 px-7 flex items-center justify-between text-[11px] font-semibold text-[#0F172A] select-none shrink-0 bg-white/70 backdrop-blur-md">
                <span>09:41</span>
                {/* Dynamic Island */}
                <div className="w-24 h-5 bg-[#0F172A] rounded-full mx-auto flex items-center justify-end px-2 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#0F172A]">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-[#0F172A] rounded-sm p-0.5 flex items-center">
                    <div className="w-full h-full bg-[#0F172A] rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Inside Screen */}
              <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none bg-[#F8F9FA]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {renderActiveTab()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Glass Pill Bar in iPhone Frame */}
              <div className="shrink-0 pt-2 pb-2 px-3 flex items-center justify-center">
                <FloatingGlassNav activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>

              {/* iOS Home Indicator */}
              <div className="w-32 h-1 bg-black/20 rounded-full mx-auto my-1.5 shrink-0" />
            </div>
          </div>
        ) : (
          /* Full Width Clean Apple Dashboard */
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 lg:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Desktop Left Navigation Sidebar */}
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-20 bg-white border border-black/[0.06] rounded-3xl p-4 space-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3.5 py-2 block">
                    UYGULAMA MENÜSÜ
                  </span>

                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold tracking-tight transition-all text-left ${
                          isActive
                            ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/10"
                            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>

                        {item.id === "workout" && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            Aktif
                          </span>
                        )}

                        {item.id === "sessions" && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#F1F5F9] text-[#0F172A]"
                            }`}
                          >
                            {remainingSessions}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-4 mt-4 border-t border-black/[0.06]">
                    <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-black/[0.04]">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                          ÜYELİK STATÜSÜ
                        </span>
                      </div>
                      <span className="font-bold text-xs text-[#0F172A] block mt-1">
                        {user.membershipTier}
                      </span>
                      <div className="mt-2.5 pt-2 border-t border-black/[0.06] flex items-center justify-between text-xs">
                        <span className="text-[#64748B]">Kalan Seans:</span>
                        <span className="font-bold text-[#10B981]">
                          {remainingSessions} Ders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Tab Content View */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {renderActiveTab()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Apple Glass Capsule Bottom Nav Bar on Mobile & Tablets */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <FloatingGlassNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Dynamic Floating Quick Turnike Pass Modal */}
      <QuickQrModal
        isOpen={isQuickQrOpen}
        onClose={() => setIsQuickQrOpen(false)}
      />

      {/* MOBILE SLIDING DRAWER (Sağdan Sola Açılan Müşteri Menüsü) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Dark Backdrop Overlay */}
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
                      CORE & FIT
                    </h4>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                      Üye Portalı
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
                {/* Member Profile Card */}
                <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.05] rounded-2xl flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-[#0F172A] truncate">{user.fullName}</span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono">{user.memberNo}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 bg-emerald-100/80 text-emerald-800 font-bold text-[10px] rounded-md">
                        {remainingSessions} Ders Hakkı
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Turnike Pass Card Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickQrOpen(true);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full p-3.5 bg-gradient-to-r from-[#0F172A] to-slate-800 hover:from-black hover:to-slate-900 text-white rounded-2xl flex items-center justify-between shadow-xs transition-all active:scale-98 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold block leading-tight">Turnike QR Kartı</span>
                      <span className="text-[10px] text-slate-300">Stüdyo Hızlı Giriş & Cihaz Tanıtımı</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Navigation Items (All 6 Member Portal Tabs) */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 block mb-1.5">
                    PORTAL BÖLÜMLERİ
                  </span>
                  {NAV_ITEMS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
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
                        {tab.id === "sessions" && remainingSessions > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {remainingSessions}
                          </span>
                        )}
                        {tab.id === "workout" && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                              isActive ? "bg-emerald-400 text-black" : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            Aktif
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              {isAdmin && (
                <div className="p-4 border-t border-black/[0.06] bg-slate-50/80">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-black/[0.08] hover:border-black/[0.16] rounded-xl text-xs font-bold text-[#0F172A] transition-all shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Yönetici Paneline Geç</span>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
