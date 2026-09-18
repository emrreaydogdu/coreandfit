"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Home,
  CheckCircle2,
  Calendar,
  Target,
  User,
  Zap,
  BarChart3,
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
  { id: "profile", label: "Profil", icon: User },
];

export const FloatingGlassNav: React.FC<FloatingGlassNavProps> = ({
  activeTab,
  setActiveTab,
  className = "",
}) => {
  return (
    <nav
      aria-label="Apple Glass Navigation Bar"
      className={`pointer-events-auto select-none ${className}`}
    >
      {/* Outer Floating Glass Capsule */}
      <div className="relative flex items-center gap-1.5 p-1.5 bg-[#0B131E]/80 hover:bg-[#0B131E]/85 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.4),0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center p-3 rounded-full transition-all duration-200 outline-none ${
                isActive ? "text-white" : "text-white/55 hover:text-white"
              }`}
              title={tab.label}
            >
              {/* Active Animated Floating Pill Background (Apple VisionOS / Dynamic Island Style) */}
              {isActive && (
                <motion.div
                  layoutId="appleFloatingPillActive"
                  className="absolute inset-0 bg-white/18 border border-white/25 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.2)]"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
