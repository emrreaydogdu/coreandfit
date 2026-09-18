"use client";

import React from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Calendar,
  CreditCard,
  Users,
  QrCode,
  Zap,
} from "lucide-react";

export type AdminTab = "overview" | "schedule" | "turnstile" | "cashier" | "members";

interface AdminFloatingNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onOpenScanner?: () => void;
  className?: string;
}

interface AdminTabItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  isAction?: boolean;
}

const ADMIN_TABS: AdminTabItem[] = [
  { id: "overview", label: "Özet", icon: TrendingUp },
  { id: "turnstile", label: "Turnike & QR", icon: QrCode },
  { id: "schedule", label: "Program", icon: Calendar },
  { id: "cashier", label: "Kasa", icon: CreditCard },
  { id: "members", label: "Üyeler", icon: Users },
];

export const AdminFloatingNav: React.FC<AdminFloatingNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  className = "",
}) => {
  return (
    <nav
      aria-label="Admin Floating Dock"
      className={`pointer-events-auto select-none ${className}`}
    >
      <div className="relative flex items-center gap-1.5 p-1.5 bg-[#0B131E]/85 hover:bg-[#0B131E]/90 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.4),0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300">
        {ADMIN_TABS.map((tab) => {
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
              {/* Active Animated Floating Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="adminFloatingPillActive"
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
