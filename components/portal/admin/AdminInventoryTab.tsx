"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Boxes,
  Wrench,
  Plus,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

export const AdminInventoryTab: React.FC = () => {
  const {
    inventoryItems,
    updateInventoryQty,
    addInventoryItem,
    maintenanceTasks,
    toggleMaintenanceStatus,
  } = useMember();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<"sarf" | "icecek" | "hijyen" | "ekipman">("icecek");
  const [newItemQty, setNewItemQty] = useState(24);
  const [newItemUnit, setNewItemUnit] = useState("Adet");
  const [newItemMin, setNewItemMin] = useState(10);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredItems = inventoryItems.filter(
    (item) => filterCategory === "all" || item.category === filterCategory
  );

  const criticalItemsCount = inventoryItems.filter((i) => i.quantity <= i.minThreshold).length;

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addInventoryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      minThreshold: newItemMin,
    });

    setNewItemName("");
    setIsAddingItem(false);
    setToastMsg("Yeni envanter kalemi başarıyla eklendi.");
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Hero */}
      <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.06] rounded-[32px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Boxes className="w-3.5 h-3.5 text-blue-600" />
            <span>Stüdyo Donanım & Sarf Lojistiği</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
            Envanter, İkram Barı & Ekipman Bakım Yönetimi
          </h3>
          <p className="text-xs text-[#64748B] max-w-xl leading-relaxed">
            Stüdyo içindeki cam şişe su, havlu, dezenfektan ve protein ürünlerinin stoklarını anlık takip edin; lüks fitness donanımlarının periyodik servis tarihlerini denetleyin.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              KRİTİK STOK
            </span>
            <span className={`text-xl font-black ${criticalItemsCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {criticalItemsCount} Kalem
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="px-4 py-3 bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-sm active:scale-98 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Stok Ekle</span>
          </button>
        </div>
      </div>

      {/* Add Item Inline Form */}
      {isAddingItem && (
        <form
          onSubmit={handleAddItemSubmit}
          className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-sm space-y-3.5 text-xs"
        >
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
            <h4 className="font-bold text-sm text-[#0F172A] uppercase">Yeni Envanter Kalemi Tanımla</h4>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="text-xs text-[#64748B] hover:text-[#0F172A]"
            >
              Kapat ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                Ürün / Malzeme Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Organik Çilekli BCAA İçeceği"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                Kategori
              </label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
              >
                <option value="icecek">İçecek & Su</option>
                <option value="sarf">Sarf & Havlu</option>
                <option value="hijyen">Hijyen & Temizlik</option>
                <option value="ekipman">Ekipman Parçası</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  Miktar
                </label>
                <input
                  type="number"
                  min={0}
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
                  Birim
                </label>
                <input
                  type="text"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full p-2.5 bg-[#F8FAFC] border border-black/[0.08] rounded-xl text-xs text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 border rounded-xl text-xs text-[#64748B]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase"
            >
              Kaydet & Envantere Ekle
            </button>
          </div>
        </form>
      )}

      {/* Section 1: Inventory Stock Cards */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div>
            <h4 className="font-bold text-base uppercase text-[#0F172A]">
              Sarf Malzeme & İkram Barı Stokları ({inventoryItems.length})
            </h4>
            <p className="text-xs text-[#64748B]">
              Tek tıkla stok miktarını güncelleyin, azalan malzemeleri anında fark edin.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "Tümü" },
              { id: "icecek", label: "İçecekler" },
              { id: "sarf", label: "Havlular & Sarf" },
              { id: "hijyen", label: "Hijyen" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterCategory === cat.id
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Stock Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => {
            const isCritical = item.quantity <= item.minThreshold;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isCritical
                    ? "bg-amber-50/40 border-amber-200/80 shadow-xs"
                    : "bg-[#F8FAFC] border-black/[0.04] hover:border-black/[0.1] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] block">
                      {item.category.toUpperCase()}
                    </span>
                    <h5 className="font-bold text-xs text-[#0F172A] leading-snug mt-0.5">
                      {item.name}
                    </h5>
                  </div>
                  {isCritical && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full shrink-0 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Kritik Stok</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black text-[#0F172A] tracking-tight">
                      {item.quantity}
                    </span>
                    <span className="text-xs text-[#64748B] ml-1 font-medium">{item.unit}</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">
                    Son Giriş: {item.lastRestocked}
                  </span>
                </div>

                {/* Quick Increment / Decrement Steppers */}
                <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#64748B]">Hızlı Güncelle:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateInventoryQty(item.id, -1)}
                      className="w-7 h-7 bg-white hover:bg-slate-100 border border-black/[0.08] rounded-lg text-xs font-bold text-[#0F172A] flex items-center justify-center transition-colors active:scale-95"
                      title="1 Azalt"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInventoryQty(item.id, 1)}
                      className="w-7 h-7 bg-white hover:bg-emerald-50 border border-black/[0.08] hover:border-emerald-300 rounded-lg text-xs font-bold text-emerald-700 flex items-center justify-center transition-colors active:scale-95"
                      title="1 Ekle"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInventoryQty(item.id, 10)}
                      className="px-2 h-7 bg-slate-900 hover:bg-black text-white rounded-lg text-[10px] font-bold flex items-center justify-center transition-colors active:scale-95"
                      title="10 Ekle (Koli)"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Equipment Maintenance & Calibration Log */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-base uppercase text-[#0F172A]">
                Donanım & İstasyon Bakım Takvimi ({maintenanceTasks.length})
              </h4>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Kuvvet istasyonları, motorlu koşu bantları ve biyometri donanımlarının servis durumları.
            </p>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
            🛡️ Bizzat Kurucu İlker Yüksel Tarafından Denetlenir
          </span>
        </div>

        <div className="space-y-3">
          {maintenanceTasks.map((task) => {
            const isAttention = task.status === "attention";

            return (
              <div
                key={task.id}
                className="p-4 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm text-[#0F172A]">{task.equipmentName}</h5>
                    <span className="px-2 py-0.5 bg-slate-200 text-[#334155] text-[10px] font-bold rounded-md">
                      {task.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        isAttention
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isAttention ? "⚠ Kontrol Gerekli" : "✓ Mükemmel Durumda"}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] italic">
                    &ldquo;{task.notes}&rdquo;
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Son Kontrol: <strong>{task.lastChecked}</strong> • Sonraki Servis: <strong>{task.nextDueDate}</strong> • Sorumlu: {task.assignedTo}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleMaintenanceStatus(task.id)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bakım Yapıldı Olarak İşle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
