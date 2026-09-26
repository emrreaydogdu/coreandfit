"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, ArrowRight } from "lucide-react";
import { DUET_PACKAGES, DUET_DESCRIPTION, type PackageItem } from "@/data/packages";
import { finalPrice, formatTL } from "@/lib/pricing";

interface DuetModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (pkg: PackageItem) => void;
  ctaLabel?: string;
  referralDiscountActive?: boolean;
}

export const DuetModal: React.FC<DuetModalProps> = ({
  open,
  onClose,
  onSelect,
  ctaLabel = "Paketi Seç",
  referralDiscountActive = false,
}) => (
  <AnimatePresence>
    {open && (
      <div
        className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Düet Ders paketleri"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white text-[#0F172A] rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col"
        >
          <div className="p-5 sm:p-7 border-b border-black/[0.06] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">Düet Ders</h3>
            <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed pr-6">{DUET_DESCRIPTION}</p>
          </div>

          <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3">
            {DUET_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 sm:p-5 border border-black/[0.08] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-base font-bold">{pkg.name}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {pkg.sessionCount} ders • 2 kişi için
                  </p>
                  <p className="text-xl font-black mt-1.5">{formatTL(finalPrice(pkg, referralDiscountActive))}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(pkg)}
                  className="min-h-12 px-5 bg-[#0F172A] hover:bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
