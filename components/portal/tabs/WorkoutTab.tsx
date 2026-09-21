"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Award,
  ChevronRight,
  Info,
  X,
  RotateCcw,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Activity,
  Heart,
} from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { WorkoutExercise } from "@/types/portal";

export const WorkoutTab: React.FC = () => {
  const {
    user,
    activeWorkout,
    completedExerciseIds,
    toggleExerciseCompleted,
    resetWorkoutProgress,
  } = useMember();

  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<WorkoutExercise | null>(null);

  const totalExercises = activeWorkout.exercises.length;
  const completedCount = activeWorkout.exercises.filter((ex) =>
    completedExerciseIds.includes(ex.id)
  ).length;
  const completionPercent = Math.round((completedCount / totalExercises) * 100);

  const getCategoryMeta = (cat: WorkoutExercise["category"]) => {
    switch (cat) {
      case "warmup":
        return { label: "ISINMA & DİNAMİK MOBİLİTE", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "strength":
        return { label: "ANA KUVVET & HİPERTROFİ", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "core":
        return { label: "CORE & PELVİK STABİLİTE", color: "bg-blue-50 text-blue-800 border-blue-200" };
      case "cooldown":
        return { label: "SOĞUMA & MİYOFASİYAL GEVŞEME", color: "bg-purple-50 text-purple-800 border-purple-200" };
    }
  };

  const handleOpenWhatsAppCoach = (exName?: string) => {
    const text = encodeURIComponent(
      `Merhaba İlker Hocam, antrenman programımdaki ${exName ? `"${exName}"` : "hareketler"} hakkında bir soru sormak istiyorum:`
    );
    window.open(`https://wa.me/905325550124?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Program Header - Apple Liquid Glass */}
      <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.06] rounded-[32px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                <span>KİŞİSELLEŞTİRİLMİŞ 1:1 ANTRENMAN PLANI</span>
              </span>
              <span className="text-[11px] px-2.5 py-1 bg-slate-100 text-[#475569] rounded-full font-semibold border border-black/[0.04]">
                {activeWorkout.phase}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-[#0F172A]">
              {activeWorkout.title}
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              {activeWorkout.subtitle}
            </p>

            {/* Coach Signature */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/[0.05]">
              <img
                src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=120&q=80"
                alt="İlker Yüksel"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30 shrink-0"
              />
              <div className="text-[11px] text-[#334155]">
                <strong className="text-[#0F172A] font-bold">{activeWorkout.coachName}</strong> • {activeWorkout.coachTitle}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 bg-[#F8FAFC] border border-black/[0.04] rounded-xl text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{activeWorkout.durationMinutes} Dk Seans</span>
              </div>
              <div className="px-3.5 py-1.5 bg-rose-50 border border-rose-200/60 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>{activeWorkout.intensity} Yoğunluk</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWhatsAppCoach()}
              className="px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Koça WhatsApp&apos;tan Soru Sor</span>
            </button>
          </div>
        </div>

        {/* Coach Special Note Callout */}
        {activeWorkout.coachNotes && (
          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold">Önemli Biyomekanik Koç Notu: </strong>
              <span>{activeWorkout.coachNotes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Workout Progress Bar */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="text-xs font-bold uppercase text-[#0F172A] tracking-wider font-display">
              BUGÜNKÜ ANTREMAN İLERLEMESİ
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
              %{completionPercent}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            {completedCount} / {totalExercises} Egzersiz Tamamlandı
          </p>
        </div>

        {/* Animated Visual Progress Bar */}
        <div className="w-full sm:flex-1 max-w-md mx-0 sm:mx-4">
          <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden p-0.5 border border-black/[0.04]">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Reset Progress Button */}
        {completedCount > 0 && (
          <button
            type="button"
            onClick={resetWorkoutProgress}
            className="text-[11px] text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-semibold transition-colors self-end sm:self-center shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-3.5">
        {activeWorkout.exercises.map((exercise, index) => {
          const isDone = completedExerciseIds.includes(exercise.id);
          const catMeta = getCategoryMeta(exercise.category);

          return (
            <div
              key={exercise.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDone
                  ? "bg-emerald-50/40 border-emerald-300/80 shadow-2xs"
                  : "bg-white border-black/[0.06] hover:border-black/[0.14] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Interactive Checkbox Button */}
                <button
                  type="button"
                  onClick={() => toggleExerciseCompleted(exercise.id)}
                  className={`mt-0.5 p-1 rounded-xl transition-all shrink-0 active:scale-90 ${
                    isDone
                      ? "text-emerald-600 bg-emerald-100/80 hover:bg-emerald-200"
                      : "text-slate-300 hover:text-slate-500 bg-slate-100 hover:bg-slate-200"
                  }`}
                  title={isDone ? "Tamamlandı olarak işaretlendi (Tıkla geri al)" : "Tamamla"}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 stroke-[2]" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider font-mono text-[#64748B] bg-slate-50">
                      SIRA #{index + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${catMeta.color}`}>
                      {catMeta.label}
                    </span>
                    {exercise.targetRpe && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {exercise.targetRpe}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold transition-all ${
                      isDone ? "line-through text-slate-500" : "text-[#0F172A]"
                    }`}
                  >
                    {exercise.name}
                  </h3>

                  <p className="text-xs text-[#64748B]">
                    🎯 <strong>Hedef:</strong> {exercise.targetMuscles}
                  </p>

                  {/* Sets, Reps, Rest & Target Weight Badge Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="px-2.5 py-1 bg-slate-100 text-[#0F172A] rounded-lg font-mono">
                      <strong>{exercise.sets}</strong> Set
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-[#0F172A] rounded-lg font-mono">
                      <strong>{exercise.reps}</strong>
                    </span>
                    {exercise.targetWeight && (
                      <span className="px-2.5 py-1 bg-emerald-100/70 text-emerald-900 rounded-lg font-mono font-bold">
                        Ağırlık: {exercise.targetWeight}
                      </span>
                    )}
                    {exercise.restSeconds > 0 && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px]">
                        Dinlenme: {exercise.restSeconds}s
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Form Detail & Coach Chat */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedExerciseForDetail(exercise)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Form Rehberi</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Exercise Form & Biomechanics Detail */}
      <AnimatePresence>
        {selectedExerciseForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0F172A] max-h-[90vh] overflow-y-auto space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedExerciseForDetail(null)}
                className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#0F172A] rounded-full bg-[#F1F5F9] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5">
                  BİYOMEKANİK FORM ANALİZİ
                </span>
                <h3 className="text-xl font-bold font-display text-[#0F172A]">
                  {selectedExerciseForDetail.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Hedef Kas Grubu: <strong>{selectedExerciseForDetail.targetMuscles}</strong>
                </p>
              </div>

              {/* Protocol Spec Pills */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] border border-black/[0.04] rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase block">SET & TEKRAR</span>
                  <strong className="text-sm text-[#0F172A] font-mono">
                    {selectedExerciseForDetail.sets} × {selectedExerciseForDetail.reps}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase block">DİNLENME</span>
                  <strong className="text-sm text-[#0F172A] font-mono">
                    {selectedExerciseForDetail.restSeconds}s
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase block">HEDEF AĞIRLIK</span>
                  <strong className="text-sm text-emerald-600 font-mono">
                    {selectedExerciseForDetail.targetWeight || "Vücut Ağırlığı"}
                  </strong>
                </div>
              </div>

              {/* Form Tips Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase text-[#0F172A] tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Doğru İcra & Biyomekanik İpuçları</span>
                </h4>
                <div className="space-y-1.5 bg-emerald-50/50 border border-emerald-200/50 p-3.5 rounded-2xl text-xs text-[#065F46]">
                  {selectedExerciseForDetail.formTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase text-rose-900 tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Sık Yapılan Hatalar (Kaçının)</span>
                </h4>
                <div className="space-y-1.5 bg-rose-50/50 border border-rose-200/50 p-3.5 rounded-2xl text-xs text-rose-950">
                  {selectedExerciseForDetail.commonMistakes.map((mistake, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppCoach(selectedExerciseForDetail.name)}
                  className="px-3 py-2 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/10 rounded-xl transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Bu Hareketi Koça Sor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleExerciseCompleted(selectedExerciseForDetail.id);
                    setSelectedExerciseForDetail(null);
                  }}
                  className="px-5 py-2.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {completedExerciseIds.includes(selectedExerciseForDetail.id)
                    ? "Tamamlandı Olarak Kaldır"
                    : "✓ Tamamlandı Olarak İşaretle"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
