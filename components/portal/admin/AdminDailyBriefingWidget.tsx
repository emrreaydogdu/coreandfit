"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  Plus,
  FileText,
  Sparkles,
  ClipboardList,
  Save,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

export const AdminDailyBriefingWidget: React.FC = () => {
  const {
    dailyChecklist,
    toggleChecklistItem,
    addChecklistItem,
    dailyNotes,
    updateDailyNotes,
  } = useMember();

  const [newChecklistText, setNewChecklistText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [localNotes, setLocalNotes] = useState(dailyNotes);
  const [notesSaved, setNotesSaved] = useState(false);

  const completedCount = dailyChecklist.filter((c) => c.completed).length;

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addChecklistItem(newChecklistText.trim(), "acilis");
    setNewChecklistText("");
    setIsAddingItem(false);
  };

  const handleSaveNotes = () => {
    updateDailyNotes(localNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.06] rounded-[32px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase text-[#0F172A] tracking-tight">
                Günlük Stüdyo İşleyiş Brifingi & Checklist
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full">
                {completedCount} / {dailyChecklist.length} Hazır
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Stüdyo açılışı, hijyen kontrolleri ve antrenör günlük operasyon defteri.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="px-3 py-1.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Görev Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Interactive Daily Checklist */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            GÜNLÜK HİJYEN & AÇILIŞ KONTROL LİSTESİ
          </span>

          {isAddingItem && (
            <form onSubmit={handleAddChecklist} className="flex gap-2 mb-2">
              <input
                type="text"
                required
                placeholder="Yeni kontrol maddesi..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 p-2 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Ekle
              </button>
            </form>
          )}

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {dailyChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.completed
                    ? "bg-emerald-50/40 border-emerald-200/50 text-emerald-900"
                    : "bg-[#F8FAFC] border-black/[0.04] text-[#334155] hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-xs ${
                      item.completed ? "line-through text-[#64748B]" : "font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                {item.time && (
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold shrink-0">
                    {item.time}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Daily Scratchpad / Coach Notes */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                ANTRENÖR GÜNLÜK NOT DEFTERİ & HATIRLATICILAR
              </span>
              {notesSaved && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Kaydedildi
                </span>
              )}
            </div>
            <textarea
              rows={6}
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Günün önemli stüdyo notları, danışan istekleri, malzeme siparişleri..."
              className="w-full p-3.5 bg-[#F8FAFC] border border-black/[0.08] rounded-2xl text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#94A3B8]">
              Notlar tarayıcıda otomatik saklanır.
            </span>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notu Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
