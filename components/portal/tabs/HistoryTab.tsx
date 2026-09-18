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
          <span className="text-[11px] font-mono text-[#E8FF36] uppercase tracking-wider font-bold">
            GİRİŞ VE STÜDYO DERS KAYITLARI
          </span>
          <span className="text-[#72757C]">•</span>
          <span className="text-[11px] font-mono text-[#A5A7AD]">Devamlılık Raporu</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-white tracking-tight mt-0.5">
          Giriş Geçmişi & Koç Raporları
        </h2>
        <p className="text-xs text-[#A5A7AD] font-mono mt-1 leading-relaxed">
          Stüdyo turnikesinden geçilen tüm antrenman günleri, seans içerikleri ve eğitmeninizin kaydettiği gelişim notları aşağıda listelenmektedir.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D0F12] border border-[#23272F] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[#72757C] text-xs font-mono mb-1">
            <UserCheck className="w-4 h-4 text-[#E8FF36]" />
            <span>TOPLAM STÜDYO GİRİŞİ</span>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            {checkInLogs.length + 8} Giriş
          </span>
          <span className="text-[10px] font-mono text-[#25D366] block mt-1">
            ↑ Düzenli haftalık ortalama 2.6 gün
          </span>
        </div>

        <div className="bg-[#0D0F12] border border-[#23272F] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[#72757C] text-xs font-mono mb-1">
            <TrendingUp className="w-4 h-4 text-[#E8FF36]" />
            <span>DEVAMLILIK SKORU</span>
          </div>
          <span className="text-2xl font-black font-mono text-[#E8FF36]">%94</span>
          <span className="text-[10px] font-mono text-[#A5A7AD] block mt-1">
            Son 30 gün içinde planlanan tüm seanslar
          </span>
        </div>

        <div className="bg-[#0D0F12] border border-[#23272F] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[#72757C] text-xs font-mono mb-1">
            <Flame className="w-4 h-4 text-[#E8FF36]" />
            <span>AKTİF DİSİPLİN SERİSİ</span>
          </div>
          <span className="text-2xl font-black font-mono text-white">4 Hafta</span>
          <span className="text-[10px] font-mono text-[#E8FF36] block mt-1">
            Kesintisiz devam eden periyot 🔥
          </span>
        </div>
      </div>

      {/* Check-In Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-mono text-[#A5A7AD] uppercase tracking-wider">
          Tamamlanan Dersler & Koç Değerlendirmeleri ({checkInLogs.length})
        </h3>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#23272F]">
          {checkInLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#08090B] border-2 border-[#E8FF36] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36]" />
              </div>

              {/* Log Card */}
              <div className="bg-[#0D0F12] border border-[#23272F] rounded-2xl p-5 hover:border-[#343A46] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#191B20] pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      {log.sessionType}
                    </span>
                    <span className="text-[#72757C]">•</span>
                    <span className="text-xs font-mono text-[#E8FF36]">
                      Koç: {log.coachName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#72757C]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{log.date}</span>
                    <span>{log.time}</span>
                  </div>
                </div>

                <p className="text-xs text-[#A5A7AD] font-mono leading-relaxed bg-[#131519] p-3 rounded-xl border border-[#191B20]">
                  <strong className="text-white not-italic block mb-1">
                    Koçun Seans Notu:
                  </strong>
                  "{log.performanceNote}"
                </p>

                {log.keyMetric && (
                  <div className="mt-3 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#E8FF36]" />
                    <span className="text-xs font-mono font-bold text-white">
                      Önemli Veri: {log.keyMetric}
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
