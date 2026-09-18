"use client";

import React from "react";
import {
  History,
  Calendar,
  Dumbbell,
  CheckCircle2,
  Award,
  TrendingUp,
  UserCheck,
  Flame,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

export const HistoryTab: React.FC = () => {
  const { checkInLogs, user } = useMember();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#10B981] uppercase tracking-wider font-bold">
            GİRİŞ VE STÜDYO DERS KAYITLARI
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[11px] font-mono text-[#64748B]">Devamlılık Raporu</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#0F172A] tracking-tight mt-0.5">
          Giriş Geçmişi & Koç Raporları
        </h2>
        <p className="text-xs text-[#64748B] font-mono mt-1 leading-relaxed">
          Stüdyo turnikesinden geçilen tüm antrenman günleri, seans içerikleri ve eğitmeninizin kaydettiği gelişim notları aşağıda listelenmektedir.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-black/[0.06] p-5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-[#64748B] text-xs font-mono mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981]">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span>TOPLAM STÜDYO GİRİŞİ</span>
          </div>
          <span className="text-2xl font-black font-mono text-[#0F172A]">
            {checkInLogs.length + 8} Giriş
          </span>
          <span className="text-[11px] font-mono text-[#10B981] font-semibold block mt-1">
            ↑ Düzenli haftalık ortalama 2.6 gün
          </span>
        </div>

        <div className="bg-white border border-black/[0.06] p-5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-[#64748B] text-xs font-mono mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span>DEVAMLILIK SKORU</span>
          </div>
          <span className="text-2xl font-black font-mono text-[#10B981]">%94</span>
          <span className="text-[11px] font-mono text-[#64748B] block mt-1">
            Son 30 gün içinde planlanan tüm seanslar
          </span>
        </div>

        <div className="bg-white border border-black/[0.06] p-5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-[#64748B] text-xs font-mono mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span>AKTİF DİSİPLİN SERİSİ</span>
          </div>
          <span className="text-2xl font-black font-mono text-[#0F172A]">4 Hafta</span>
          <span className="text-[11px] font-mono text-amber-600 font-semibold block mt-1">
            Kesintisiz devam eden periyot 🔥
          </span>
        </div>
      </div>

      {/* Check-In Timeline */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-mono text-[#64748B] uppercase tracking-wider">
          Tamamlanan Dersler & Koç Değerlendirmeleri ({checkInLogs.length})
        </h3>

        <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[2px] before:bg-black/[0.08]">
          {checkInLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#10B981] flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>

              {/* Log Card */}
              <div className="bg-white border border-black/[0.06] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-black/[0.12] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.05] pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#0F172A] uppercase">
                      {log.sessionType}
                    </span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="text-xs font-mono font-semibold text-[#10B981]">
                      Koç: {log.coachName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{log.date}</span>
                    <span>{log.time}</span>
                  </div>
                </div>

                <div className="text-xs text-[#334155] font-mono leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-black/[0.04]">
                  <strong className="text-[#0F172A] not-italic block mb-1 font-semibold">
                    Koçun Seans Notu:
                  </strong>
                  "{log.performanceNote}"
                </div>

                {log.keyMetric && (
                  <div className="mt-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-mono font-bold text-[#0F172A]">
                      Önemli Veri: <span className="text-[#10B981]">{log.keyMetric}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
