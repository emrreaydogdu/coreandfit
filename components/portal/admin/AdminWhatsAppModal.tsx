"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Calendar,
  CreditCard,
  Award,
  Sparkles,
  Phone,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";

interface AdminWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMemberName?: string;
  defaultPhone?: string;
  defaultSessionInfo?: {
    date: string;
    timeSlot: string;
    focusArea?: string;
  };
}

export const AdminWhatsAppModal: React.FC<AdminWhatsAppModalProps> = ({
  isOpen,
  onClose,
  defaultMemberName,
  defaultPhone,
  defaultSessionInfo,
}) => {
  const { studioSettings } = useMember();

  const recipientName = defaultMemberName || "Ege Mert";
  const recipientPhone = (defaultPhone || "+90 532 555 0124").replace(/\s+/g, "");

  const [activeTemplate, setActiveTemplate] = useState<
    "reminder" | "remaining" | "payment" | "feedback"
  >("reminder");

  const templates = {
    reminder: `Merhaba ${recipientName}, Core & Fit Nişantaşı stüdyomuzda bugün${
      defaultSessionInfo ? ` saat ${defaultSessionInfo.timeSlot}` : " planlanan saatte"
    } İlker Hoca ile 1:1 Personal Training seansınız bulunmaktadır. Biyomekanik hazırlık için 10 dakika öncesinde hazır olmanızı rica eder, keyifli bir antrenman dileriz. 💪`,

    remaining: `Merhaba ${recipientName}, Core & Fit stüdyomuzdaki mevcut seans paketinizde son 1 seansınız kalmıştır. Antrenman programınızın ve kuvvet gelişiminizin kesintiye uğramaması adına yeni dönem seans rezervasyonunuzu stüdyodan veya panelinizden yenileyebilirsiniz. Detaylar için buradayız!`,

    payment: `Merhaba ${recipientName}, Core & Fit stüdyo paket ödemeniz için stüdyomuz banka bilgileri:\n\nBanka: ${
      studioSettings.bankAccounts[0]?.bankName || "Garanti BBVA"
    }\nAlıcı: ${studioSettings.legalTitle}\nIBAN: ${
      studioSettings.bankAccounts[0]?.iban || "TR34 0006 2000 1234 5678 9012 34"
    }\n\nÖdeme sonrası dekontu bu numaraya iletmeniz halinde seanslarınız hesabınıza anında tanımlanacaktır.`,

    feedback: `Tebrikler ${recipientName}! Bugünkü antrenmanda sergilediğin form ve core stabilizasyonu harikaydı. 👏 Dinlenme sürecinde bol su tüketmeyi ve kas toparlanması için kaliteli protein alımını ihmal etme. Bir sonraki seansta görüşmek üzere!`,
  };

  const [messageText, setMessageText] = useState(templates.reminder);
  const [copied, setCopied] = useState(false);

  // Sync template change
  const handleSelectTemplate = (t: "reminder" | "remaining" | "payment" | "feedback") => {
    setActiveTemplate(t);
    setMessageText(templates[t]);
  };

  if (!isOpen) return null;

  const handleSendWhatsApp = () => {
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, "_blank");
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          className="relative w-full max-w-lg bg-white rounded-t-[36px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hızlı WhatsApp İletişim Hub</span>
            </div>
            <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#0F172A]">
              WhatsApp Şablon Bildirimi Gönder
            </h3>
            <p className="text-xs text-[#64748B]">
              Alıcı: <strong className="text-[#0F172A]">{recipientName}</strong> ({recipientPhone})
            </p>
          </div>

          {/* Template Buttons */}
          <div className="space-y-2 mb-4">
            <label className="text-[10px] font-bold text-[#64748B] uppercase block">
              HAZIR STÜDYO ŞABLONLARI
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "reminder", label: "Randevu Hatırlatma", icon: Calendar },
                { id: "remaining", label: "Kalan Seans / Yenileme", icon: Award },
                { id: "payment", label: "Kasa & IBAN Bilgisi", icon: CreditCard },
                { id: "feedback", label: "Tebrik & Koç Notu", icon: Sparkles },
              ].map((tpl) => {
                const Icon = tpl.icon;
                const isActive = activeTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isActive
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold"
                        : "border-black/[0.06] bg-[#F8FAFC] text-[#64748B] hover:bg-white"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-[#64748B]"}`} />
                    <span className="text-xs leading-tight">{tpl.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-[#64748B] uppercase">
                GÖNDERİLECEK MESAJ METNİ
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Kopyalandı!" : "Metni Kopyala"}</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3 bg-[#F8FAFC] border border-black/[0.08] rounded-2xl text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#64748B]"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp İle Gönder →</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
