"use client";

import React from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Calendar,
  CreditCard,
  Users,
  QrCode,
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
}

const ADMIN_TABS: AdminTabItem[] = [
  { id: "overview", label: "Özet", icon: TrendingUp },
  { id: "turnstile", label: "Turnike", icon: QrCode },
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
      aria-label="Admin Liquid Glass Dock"
      className={`pointer-events-auto select-none ${className}`}
    >
      <div className="relative flex items-center gap-1 sm:gap-1.5 p-1.5 bg-white/85 hover:bg-white/95 backdrop-blur-2xl border border-white/70 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)] transition-all duration-300">
        {ADMIN_TABS.map((tab) => {
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
              {/* Active Animated Floating Capsule Pill */}
              {isActive && (
                <motion.div
                  layoutId="adminFloatingPillActive"
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
