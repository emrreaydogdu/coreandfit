"use client";

import React from "react";
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
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { PortalTab } from "@/types/portal";
import { DashboardTab } from "@/components/portal/tabs/DashboardTab";
import { SessionsTab } from "@/components/portal/tabs/SessionsTab";
import { StoreTab } from "@/components/portal/tabs/StoreTab";
import { HistoryTab } from "@/components/portal/tabs/HistoryTab";
import { ProfileTab } from "@/components/portal/tabs/ProfileTab";

export const PortalLayout: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    viewMode,
    toggleViewMode,
    remainingSessions,
  } = useMember();

  if (!user) return null;

  const NAV_ITEMS: { id: PortalTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Özet", icon: Home },
    { id: "sessions", label: "Seanslarım", icon: Calendar },
    { id: "store", label: "Paket Al", icon: Zap },
    { id: "history", label: "Girişlerim", icon: BarChart3 },
    { id: "profile", label: "Hesabım", icon: User },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
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
            <Link
              href="/"
              className="flex items-center gap-2 group transition-all text-[#64748B] hover:text-[#0F172A]"
              title="Web Sitesine Dön"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <div className="flex items-center gap-1.5 font-mono font-black text-sm tracking-tight text-[#0F172A]">
                <span>CORE & FIT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
            </Link>

            <span className="text-[#CBD5E1] hidden sm:inline">|</span>

            {/* Live Studio Occupancy Indicator (Apple Health Style Pill) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F1F5F9] border border-black/[0.04] rounded-full text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#64748B]">Nişantaşı Stüdyo:</span>
              <span className="text-[#0F172A] font-bold">%35 Sakin</span>
            </div>
          </div>

          {/* Controls: View Mode, Web Link, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
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

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors px-2 py-1"
            >
              <span>Web Sitesi</span>
              <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
            </Link>

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
                  {remainingSessions} Seans Kaldı
                </span>
              </div>
            </div>
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

              {/* Fixed In-Frame iOS Glass Bottom Tab Bar */}
              <nav className="shrink-0 bg-white/90 backdrop-blur-2xl border-t border-black/[0.06] py-2 px-3 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
                        isActive
                          ? "text-[#0F172A]"
                          : "text-[#94A3B8] hover:text-[#64748B]"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#0F172A] text-white shadow-sm"
                            : "bg-transparent text-inherit"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] tracking-tight ${
                          isActive ? "font-bold text-[#0F172A]" : "font-medium text-[#94A3B8]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* iOS Home Indicator */}
              <div className="w-32 h-1 bg-black/20 rounded-full mx-auto my-2 shrink-0" />
            </div>
          </div>
        ) : (
          /* Full Width Clean Apple Dashboard */
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
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
                          {remainingSessions} Seans
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

      {/* Fixed Native iOS Bottom Tab Bar on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-t border-black/[0.06] py-2 px-4 flex items-center justify-around lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.04)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive ? "text-[#0F172A]" : "text-[#94A3B8] hover:text-[#64748B]"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-[#0F172A] text-white shadow-sm" : "bg-transparent text-inherit"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] tracking-tight ${
                  isActive ? "font-bold text-[#0F172A]" : "font-medium text-[#94A3B8]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
