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
  Activity,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { PortalTab } from "@/types/portal";
import { DashboardTab } from "@/components/portal/tabs/DashboardTab";
import { SessionsTab } from "@/components/portal/tabs/SessionsTab";
import { StoreTab } from "@/components/portal/tabs/StoreTab";
import { HistoryTab } from "@/components/portal/tabs/HistoryTab";
import { ProfileTab } from "@/components/portal/tabs/ProfileTab";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
    { id: "dashboard", label: "Panel", icon: Home },
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
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col selection:bg-[#E8FF36] selection:text-[#08090B]">
      {/* Top Global Utility Bar (Web & App Switcher) */}
      <header className="sticky top-0 z-40 bg-[#08090B]/95 backdrop-blur-md border-b border-[#191B20] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Studio Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-80"
              title="Web Sitesine Dön"
            >
              <ArrowLeft className="w-4 h-4 text-[#72757C] group-hover:text-white" />
              <div className="flex items-center gap-1.5 font-mono font-black text-sm text-white tracking-wider">
                <span>CORE & FIT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36]" />
              </div>
            </Link>

            <span className="text-[#333] hidden sm:inline">|</span>

            {/* Live Studio Occupancy Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#131519] border border-[#23272F] rounded-full text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[#A5A7AD]">Nişantaşı:</span>
              <span className="text-white font-bold">%35 Sakin</span>
            </div>
          </div>

          {/* Controls: View Mode, Theme, Web Site Link, Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* View Mode Switcher (Desktop Only) */}
            <button
              onClick={toggleViewMode}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#23272F] bg-[#131519] hover:border-[#343A46] rounded-xl text-xs font-mono text-[#A5A7AD] hover:text-white transition-all shadow-sm"
              title={
                viewMode === "app_frame"
                  ? "Tam Ekran Görünüme Geç"
                  : "Mobil Telefon Çerçevesine Geç"
              }
            >
              {viewMode === "app_frame" ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#E8FF36]" />
                  <span>Geniş Ekran</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#E8FF36]" />
                  <span>Mobil Çerçeve</span>
                </>
              )}
            </button>

            <ThemeToggle variant="icon" />

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-[#72757C] hover:text-white transition-colors"
            >
              <span>Web Sitesi</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* User Quick Pill */}
            <div
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 pl-2 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E8FF36] shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:inline text-xs font-mono font-bold text-white group-hover:text-[#E8FF36] transition-colors">
                {user.fullName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive OR App Frame */}
      <main className="flex-1 flex flex-col justify-start">
        {viewMode === "app_frame" ? (
          /* Phone Frame Container on Desktop */
          <div className="flex-1 py-8 px-4 flex items-center justify-center bg-[#050607]">
            <div className="relative w-full max-w-[420px] min-h-[840px] max-h-[92vh] bg-[#0A0C0E] border-[8px] border-[#1F242F] rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-1 ring-white/10">
              {/* Dynamic Island / Notch */}
              <div className="w-full pt-3 pb-2 px-6 flex items-center justify-between text-[11px] font-mono text-white select-none shrink-0">
                <span className="font-bold">09:41</span>
                <div className="w-24 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Mobile Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderActiveTab()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Fixed In-Frame Bottom Navigation Bar */}
              <nav className="shrink-0 bg-[#0E1015]/95 backdrop-blur-md border-t border-[#1F242F] py-2 px-3 flex items-center justify-around">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                        isActive
                          ? "text-[#E8FF36]"
                          : "text-[#72757C] hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[9px] font-mono tracking-wider">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Home Indicator Bar */}
              <div className="w-32 h-1 bg-white/30 rounded-full mx-auto my-1.5 shrink-0" />
            </div>
          </div>
        ) : (
          /* Full Width Responsive Dashboard Layout */
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Desktop Left Navigation Sidebar */}
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-20 bg-[#0D0F12] border border-[#23272F] rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-mono text-[#72757C] uppercase tracking-widest px-3 py-2 block">
                    UYGULAMA MENÜSÜ
                  </span>

                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all text-left ${
                          isActive
                            ? "bg-[#E8FF36] text-[#08090B] font-bold shadow-sm"
                            : "text-[#A5A7AD] hover:bg-[#131519] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>

                        {item.id === "sessions" && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isActive
                                ? "bg-[#08090B] text-[#E8FF36]"
                                : "bg-[#131519] text-[#E8FF36]"
                            }`}
                          >
                            {remainingSessions}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-4 mt-4 border-t border-[#191B20]">
                    <div className="p-3 bg-[#131519] rounded-xl border border-[#191B20] text-xs font-mono">
                      <span className="text-[10px] text-[#72757C] uppercase block mb-1">
                        ÜYELİK STATÜSÜ
                      </span>
                      <span className="font-bold text-white block">
                        {user.membershipTier}
                      </span>
                      <span className="text-[10px] text-[#E8FF36] block mt-1">
                        Aktif Hak: {remainingSessions} Seans
                      </span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Tab Content View */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderActiveTab()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation Bar for Mobile View (When not in app_frame mode on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E1015]/95 backdrop-blur-md border-t border-[#1F242F] py-2 px-4 flex items-center justify-around lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive ? "text-[#E8FF36]" : "text-[#72757C] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-mono tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
