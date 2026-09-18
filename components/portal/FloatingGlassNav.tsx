"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Home,
  CheckCircle2,
  Calendar,
  Target,
  User,
} from "lucide-react";
import { PortalTab } from "@/types/portal";

interface FloatingGlassNavProps {
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  className?: string;
}

interface TabItem {
  id: PortalTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: "dashboard", label: "Özet", icon: Home },
  { id: "sessions", label: "Seanslar", icon: CheckCircle2 },
  { id: "history", label: "Girişler", icon: Calendar },
  { id: "store", label: "Paketler", icon: Target },
  { id: "profile", label: "Hesabım", icon: User },
];

export const FloatingGlassNav: React.FC<FloatingGlassNavProps> = ({
  activeTab,
  setActiveTab,
  className = "",
}) => {
  return (
    <nav
      aria-label="Liquid Glass Navigation Bar"
      className={`pointer-events-auto select-none ${className}`}
    >
      {/* Outer Floating Liquid White Glass Capsule */}
      <div className="relative flex items-center gap-1 sm:gap-1.5 p-1.5 bg-white/80 hover:bg-white/90 backdrop-blur-2xl border border-white/70 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)] transition-all duration-300">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 sm:px-4 rounded-2xl transition-all duration-200 outline-none min-w-[56px] sm:min-w-[64px] ${
                isActive ? "text-white" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title={tab.label}
            >
              {/* Active Animated Floating Liquid Capsule Pill */}
              {isActive && (
                <motion.div
                  layoutId="appleFloatingPillActive"
                  className="absolute inset-0 bg-[#0F172A] rounded-2xl shadow-[0_4px_16px_rgba(15,23,42,0.22)]"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 ${
                    isActive ? "scale-105 stroke-[2.3] text-white" : "stroke-[1.8] text-[#64748B]"
                  }`}
                />
              </span>

              {/* Text Label Underneath */}
              <span
                className={`relative z-10 text-[10px] font-sans mt-0.5 tracking-tight transition-colors duration-200 ${
                  isActive ? "text-white font-bold" : "text-[#64748B] font-medium"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
