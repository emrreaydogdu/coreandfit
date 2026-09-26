"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type {
  AdminSnapshot,
  AvailabilityData,
  BodyMeasurementRecord,
  BookedSession,
  CoachScheduleProfile,
  CoachTimeSlot,
  MemberGift,
  MemberSnapshot,
  MemberStatus,
  MemberUser,
  OrderItem,
  PaymentMethod,
  PortalTab,
  ReferralSummary,
  SavedCard,
  StudioBankAccount,
  StudioMemberCRM,
  StudioSettings,
  UserAddress,
} from "@/types/portal";
import { ACTIVE_BOOKING_STATUSES, type ProgramDay } from "@/lib/training";
import { slotStatus, todayIso, timeSlotsOverlap, type SlotUnavailableReason } from "@/lib/slots";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

type MeasurementInput = Omit<BodyMeasurementRecord, "id" | "memberId">;

interface MemberContextType {
  user: MemberUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  mounted: boolean;
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  canGoBack: boolean;
  goBack: () => void;
  viewMode: "app_frame" | "responsive";
  toggleViewMode: () => void;
  refresh: () => Promise<void>;

  // Üye verisi (yönetici için bookedSessions tüm randevulardır)
  remainingSessions: number;
  totalSessions: number;
  packageExpiry: string;
  bookedSessions: BookedSession[];
  bodyMeasurements: BodyMeasurementRecord[];
  program: ProgramDay[];
  gifts: MemberGift[];
  orders: OrderItem[];
  referral: ReferralSummary | null;
  bankAccounts: StudioBankAccount[];

  // Kimlik
  login: (email: string, password: string) => Promise<{ ok: true; role: string } | { ok: false; error: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) => Promise<{ ok: true; referralApplied: boolean } | { ok: false; error: string }>;
  logout: () => Promise<void>;

  // Üye işlemleri
  bookSession: (data: { date: string; timeSlot: string; workoutType: string; memberNote?: string }) => Promise<ActionResult>;
  cancelSession: (sessionId: string) => Promise<ActionResult>;
  purchasePackage: (data: { packageId: string; paymentMethod: PaymentMethod }) => Promise<
    { ok: true; order: OrderItem } | { ok: false; error: string }
  >;
  addBodyMeasurement: (m: MeasurementInput) => Promise<ActionResult>;
  updateUserProfile: (data: Partial<MemberUser>) => Promise<ActionResult>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<ActionResult>;
  addSavedCard: (card: Omit<SavedCard, "id">) => Promise<ActionResult>;
  removeSavedCard: (cardId: string) => Promise<ActionResult>;
  setDefaultCard: (cardId: string) => Promise<ActionResult>;
  updateAddress: (address: UserAddress) => Promise<ActionResult>;

  // Müsaitlik
  coachSchedules: CoachScheduleProfile[];
  coachBlockedDateSlots: Record<string, string[]>;
  checkSlotAvailability: (
    date: string,
    timeSlot: string,
    ignoreBookingId?: string
  ) => { isAvailable: true } | { isAvailable: false; reason: SlotUnavailableReason };

  // Yönetici verisi
  crmMembers: StudioMemberCRM[];
  adminOrders: OrderItem[];
  adminMeasurements: BodyMeasurementRecord[];
  adminGifts: MemberGift[];
  studioSettings: StudioSettings | null;

  // Yönetici işlemleri
  adminCreateSession: (data: {
    memberId: string;
    date: string;
    timeSlot: string;
    workoutType: string;
    internalNote?: string;
    deductCredit: boolean;
  }) => Promise<ActionResult>;
  confirmBooking: (sessionId: string) => Promise<ActionResult>;
  cancelBookedSession: (sessionId: string, refundCredit: boolean, reason?: string) => Promise<ActionResult>;
  completeBookedSession: (sessionId: string, internalNote?: string) => Promise<ActionResult>;
  rescheduleBookedSession: (sessionId: string, newDate: string, newTime: string) => Promise<ActionResult>;
  approveOrder: (orderId: string) => Promise<ActionResult>;
  adminQuickSale: (data: {
    memberId: string;
    packageId: string;
    paymentMethod: PaymentMethod;
    extraDiscountPercent?: number;
  }) => Promise<{ ok: true; order: OrderItem } | { ok: false; error: string }>;
  addNewMember: (data: {
    fullName: string;
    email: string;
    phone: string;
    initialSessions: number;
    injuryAlert?: string;
    targetGoal?: string;
  }) => Promise<{ ok: true; memberNo: string; tempPassword: string } | { ok: false; error: string }>;
  updateMemberDetails: (
    memberId: string,
    patch: {
      status?: MemberStatus;
      injuryAlert?: string;
      targetGoal?: string;
      healthNotes?: string;
      program?: ProgramDay[];
      referralCodeDisabled?: boolean;
    }
  ) => Promise<ActionResult>;
  updateMemberSessions: (memberId: string, delta: number) => Promise<ActionResult>;
  adminAddMeasurement: (memberId: string, m: MeasurementInput) => Promise<ActionResult>;
  createGift: (data: { memberId: string | null; title: string; description: string }) => Promise<ActionResult>;
  updateGiftStatus: (giftId: string, status: MemberGift["status"]) => Promise<ActionResult>;
  adminCheckIn: (memberRef: string) => Promise<ActionResult>;
  updateStudioSettings: (newSettings: Partial<StudioSettings>) => Promise<ActionResult>;
  addStudioBankAccount: (account: Omit<StudioBankAccount, "id">) => Promise<ActionResult>;
  removeStudioBankAccount: (accountId: string) => Promise<ActionResult>;
  updateCoachDayStatus: (coachId: string, dayKey: string, isWorkingDay: boolean) => void;
  toggleCoachSlotAvailability: (coachId: string, dayKey: string, slotId: string) => void;
  addCoachSlot: (coachId: string, dayKey: string, time: string, label?: string) => void;
  removeCoachSlot: (coachId: string, dayKey: string, slotId: string) => void;
  copyCoachScheduleToWeekdays: (coachId: string, sourceDayKey: string) => void;
  toggleCoachSlotForDate: (date: string, timeSlot: string) => void;

  // Hızlı turnike QR penceresi
  isQuickQrOpen: boolean;
  setIsQuickQrOpen: (open: boolean) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const VIEW_MODE_KEY = "cf_member_view_mode";

async function api<T>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.error) || "İşlem tamamlanamadı. Lütfen tekrar deneyin.");
  return data as T;
}

const failure = (error: unknown) => ({
  ok: false as const,
  error: error instanceof Error ? error.message : "İşlem tamamlanamadı.",
});

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [snapshot, setSnapshot] = useState<MemberSnapshot | null>(null);
  const [admin, setAdmin] = useState<AdminSnapshot | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [activeTab, setActiveTabState] = useState<PortalTab>("dashboard");
  // "Geri Dön" için portal içi sekme geçmişi
  const [tabHistory, setTabHistory] = useState<PortalTab[]>([]);
  const [viewMode, setViewMode] = useState<"app_frame" | "responsive">("responsive");
  const [isQuickQrOpen, setIsQuickQrOpen] = useState(false);

  const user = snapshot?.user ?? null;
  const isAdmin = user?.role === "admin";

  const loadAvailability = useCallback(async () => {
    setAvailability(await api<AvailabilityData>("/api/availability"));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const me = await api<MemberSnapshot | null>("/api/me");
      setSnapshot(me);
      if (!me) {
        setAdmin(null);
        setAvailability(null);
        return;
      }
      if (me.user.role === "admin") {
        setAdmin(await api<AdminSnapshot>("/api/admin"));
      } else {
        await loadAvailability();
      }
    } catch {
      setSnapshot(null);
    }
  }, [loadAvailability]);

  // İlk yüklemede oturumu sunucudan okur; state güncellemeleri istek tamamlandıktan sonra gelir.
  useEffect(() => {
    const load = async () => {
      await refresh();
      try {
        const saved = localStorage.getItem(VIEW_MODE_KEY);
        if (saved === "app_frame" || saved === "responsive") setViewMode(saved);
      } catch {}
      setMounted(true);
    };
    void load();
  }, [refresh]);

  const setActiveTab = (tab: PortalTab) => {
    if (tab === activeTab) return;
    setTabHistory((h) => [...h, activeTab].slice(-20));
    setActiveTabState(tab);
  };

  const goBack = () => {
    const previous = tabHistory[tabHistory.length - 1] ?? "dashboard";
    setTabHistory((h) => h.slice(0, -1));
    setActiveTabState(previous);
  };

  const toggleViewMode = () => {
    const next = viewMode === "app_frame" ? "responsive" : "app_frame";
    setViewMode(next);
    try {
      localStorage.setItem(VIEW_MODE_KEY, next);
    } catch {}
  };

  // Üye uçları güncel snapshot döndürür; müsaitlik de tazelenir.
  const memberAction = async (url: string, method: string, body?: unknown, successMessage?: string): Promise<ActionResult> => {
    try {
      setSnapshot(await api<MemberSnapshot>(url, { method, body }));
      await loadAvailability();
      return { ok: true, message: successMessage };
    } catch (error) {
      return failure(error);
    }
  };

  // Yönetici uçları güncel yönetici tablosunu döndürür.
  const adminAction = async (url: string, method: string, body?: unknown, successMessage?: string): Promise<ActionResult> => {
    try {
      setAdmin(await api<AdminSnapshot>(url, { method, body }));
      return { ok: true, message: successMessage };
    } catch (error) {
      return failure(error);
    }
  };

  // ---------------------------------------------------------------- Kimlik
  const login: MemberContextType["login"] = async (email, password) => {
    try {
      const res = await api<{ role: string }>("/api/auth/login", { method: "POST", body: { email, password } });
      await refresh();
      return { ok: true, role: res.role };
    } catch (error) {
      return failure(error);
    }
  };

  const register: MemberContextType["register"] = async (data) => {
    try {
      const res = await api<{ referralApplied: boolean }>("/api/auth/register", { method: "POST", body: data });
      await refresh();
      return { ok: true, referralApplied: res.referralApplied };
    } catch (error) {
      return failure(error);
    }
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => null);
    setSnapshot(null);
    setAdmin(null);
    setAvailability(null);
    setTabHistory([]);
    setActiveTabState("dashboard");
  };

  // ---------------------------------------------------------------- Üye
  const bookSession: MemberContextType["bookSession"] = (data) =>
    memberAction("/api/me/bookings", "POST", data, "Randevu talebiniz alındı. Onaylandığında bu ekranda göreceksiniz.");

  const cancelSession: MemberContextType["cancelSession"] = (sessionId) =>
    memberAction(`/api/me/bookings/${sessionId}`, "DELETE", undefined, "Randevu iptal edildi, ders hakkınız iade edildi.");

  const purchasePackage: MemberContextType["purchasePackage"] = async (data) => {
    try {
      const res = await api<{ order: OrderItem; snapshot: MemberSnapshot }>("/api/me/orders", { method: "POST", body: data });
      setSnapshot(res.snapshot);
      return { ok: true, order: res.order };
    } catch (error) {
      return failure(error);
    }
  };

  const addBodyMeasurement: MemberContextType["addBodyMeasurement"] = (m) =>
    memberAction("/api/me/measurements", "POST", m, "Ölçüm kaydedildi.");

  const updateUserProfile: MemberContextType["updateUserProfile"] = (data) =>
    memberAction("/api/me", "PATCH", { profile: data }, "Bilgileriniz güncellendi.");

  const changePassword: MemberContextType["changePassword"] = (currentPassword, newPassword) =>
    memberAction("/api/me", "PATCH", { currentPassword, newPassword }, "Şifreniz güncellendi.");

  const savedCards = user?.savedCards ?? [];
  const addSavedCard: MemberContextType["addSavedCard"] = (card) => {
    const newCard = { ...card, id: `card-${Date.now()}` };
    const cards = newCard.isDefault ? [...savedCards.map((c) => ({ ...c, isDefault: false })), newCard] : [...savedCards, newCard];
    return updateUserProfile({ savedCards: cards });
  };
  const removeSavedCard: MemberContextType["removeSavedCard"] = (cardId) =>
    updateUserProfile({ savedCards: savedCards.filter((c) => c.id !== cardId) });
  const setDefaultCard: MemberContextType["setDefaultCard"] = (cardId) =>
    updateUserProfile({ savedCards: savedCards.map((c) => ({ ...c, isDefault: c.id === cardId })) });
  const updateAddress: MemberContextType["updateAddress"] = (address) => updateUserProfile({ address });

  // ---------------------------------------------------------------- Müsaitlik
  const coachSchedules = admin?.coachSchedules ?? availability?.coachSchedules ?? [];
  const coachBlockedDateSlots = admin?.blocked ?? availability?.blocked ?? {};
  const occupied = admin
    ? admin.bookings.filter((b) => ACTIVE_BOOKING_STATUSES.includes(b.status))
    : availability?.occupied ?? [];

  const checkSlotAvailability: MemberContextType["checkSlotAvailability"] = (date, timeSlot, ignoreBookingId) => {
    if (date < todayIso()) return { isAvailable: false, reason: "past" };
    return slotStatus({ occupied, blocked: coachBlockedDateSlots, coachSchedules }, date, timeSlot, ignoreBookingId);
  };

  // ---------------------------------------------------------------- Yönetici
  const adminCreateSession: MemberContextType["adminCreateSession"] = async (data) => {
    try {
      const res = await api<{ result: { creditDeducted: boolean }; snapshot: AdminSnapshot }>("/api/admin/bookings", {
        method: "POST",
        body: data,
      });
      setAdmin(res.snapshot);
      return { ok: true, message: res.result.creditDeducted ? "Randevu oluşturuldu, 1 ders hakkı düşüldü." : "Randevu oluşturuldu." };
    } catch (error) {
      return failure(error);
    }
  };

  const confirmBooking: MemberContextType["confirmBooking"] = (id) =>
    adminAction(`/api/admin/bookings/${id}`, "PATCH", { action: "confirm" }, "Randevu onaylandı.");
  const cancelBookedSession: MemberContextType["cancelBookedSession"] = (id, refund, reason) =>
    adminAction(`/api/admin/bookings/${id}`, "PATCH", { action: "cancel", refund, reason }, "Randevu iptal edildi.");
  const completeBookedSession: MemberContextType["completeBookedSession"] = (id, internalNote) =>
    adminAction(`/api/admin/bookings/${id}`, "PATCH", { action: "complete", internalNote }, "Seans tamamlandı.");
  const rescheduleBookedSession: MemberContextType["rescheduleBookedSession"] = (id, date, timeSlot) =>
    adminAction(`/api/admin/bookings/${id}`, "PATCH", { action: "reschedule", date, timeSlot }, "Randevu yeni saate taşındı.");
  const approveOrder: MemberContextType["approveOrder"] = (id) =>
    adminAction(`/api/admin/orders/${id}`, "PATCH", undefined, "Ödeme tahsil edildi.");

  const adminQuickSale: MemberContextType["adminQuickSale"] = async (data) => {
    try {
      const res = await api<{ order: OrderItem; snapshot: AdminSnapshot }>("/api/admin/orders", { method: "POST", body: data });
      setAdmin(res.snapshot);
      return { ok: true, order: res.order };
    } catch (error) {
      return failure(error);
    }
  };

  const addNewMember: MemberContextType["addNewMember"] = async (data) => {
    try {
      const res = await api<{ created: { memberNo: string; tempPassword: string }; snapshot: AdminSnapshot }>(
        "/api/admin/members",
        { method: "POST", body: data }
      );
      setAdmin(res.snapshot);
      return { ok: true, memberNo: res.created.memberNo, tempPassword: res.created.tempPassword };
    } catch (error) {
      return failure(error);
    }
  };

  const updateMemberDetails: MemberContextType["updateMemberDetails"] = (memberId, patch) =>
    adminAction(`/api/admin/members/${memberId}`, "PATCH", patch, "Üye bilgileri güncellendi.");
  const updateMemberSessions: MemberContextType["updateMemberSessions"] = (memberId, delta) =>
    adminAction(`/api/admin/members/${memberId}`, "PATCH", { sessionsDelta: delta }, "Ders hakkı güncellendi.");
  const adminAddMeasurement: MemberContextType["adminAddMeasurement"] = (memberId, m) =>
    adminAction(`/api/admin/members/${memberId}/measurements`, "POST", m, "Ölçüm kaydedildi.");
  const createGift: MemberContextType["createGift"] = (data) =>
    adminAction("/api/admin/gifts", "POST", data, "Hediye tanımlandı.");
  const updateGiftStatus: MemberContextType["updateGiftStatus"] = (id, status) =>
    adminAction(`/api/admin/gifts/${id}`, "PATCH", { status }, "Hediye durumu güncellendi.");

  const adminCheckIn: MemberContextType["adminCheckIn"] = async (memberRef) => {
    try {
      const res = await api<{ result: { memberName: string; remaining: number; usedBooking: boolean }; snapshot: AdminSnapshot }>(
        "/api/admin/checkin",
        { method: "POST", body: { member: memberRef } }
      );
      setAdmin(res.snapshot);
      const { memberName, remaining, usedBooking } = res.result;
      return {
        ok: true,
        message: usedBooking
          ? `${memberName} girişi onaylandı. Bugünkü randevusu tamamlandı olarak işaretlendi.`
          : `${memberName} girişi onaylandı. 1 ders düşüldü, kalan: ${remaining}.`,
      };
    } catch (error) {
      return failure(error);
    }
  };

  const saveSettings = (body: {
    studioSettings?: StudioSettings;
    coachSchedules?: CoachScheduleProfile[];
    blocked?: Record<string, string[]>;
  }) => adminAction("/api/admin/settings", "PUT", body, "Ayarlar kaydedildi.");

  const studioSettings = admin?.studioSettings ?? null;

  const updateStudioSettings: MemberContextType["updateStudioSettings"] = (newSettings) =>
    studioSettings ? saveSettings({ studioSettings: { ...studioSettings, ...newSettings } }) : Promise.resolve(failure(null));
  const addStudioBankAccount: MemberContextType["addStudioBankAccount"] = (account) =>
    studioSettings
      ? saveSettings({
          studioSettings: { ...studioSettings, bankAccounts: [...studioSettings.bankAccounts, { ...account, id: `bank-${Date.now()}` }] },
        })
      : Promise.resolve(failure(null));
  const removeStudioBankAccount: MemberContextType["removeStudioBankAccount"] = (accountId) =>
    studioSettings
      ? saveSettings({
          studioSettings: { ...studioSettings, bankAccounts: studioSettings.bankAccounts.filter((b) => b.id !== accountId) },
        })
      : Promise.resolve(failure(null));

  // Koç takvimi: yeni durum yerelde hesaplanır, anında gösterilir ve sunucuya yazılır.
  const mutateSchedules = (fn: (schedules: CoachScheduleProfile[]) => CoachScheduleProfile[]) => {
    if (!admin) return;
    const next = fn(admin.coachSchedules);
    setAdmin({ ...admin, coachSchedules: next });
    void saveSettings({ coachSchedules: next });
  };

  const mapDay = (
    coachId: string,
    dayKey: string,
    fn: (day: CoachScheduleProfile["weeklySchedule"][number]) => CoachScheduleProfile["weeklySchedule"][number]
  ) =>
    mutateSchedules((all) =>
      all.map((coach) =>
        coach.coachId !== coachId
          ? coach
          : { ...coach, weeklySchedule: coach.weeklySchedule.map((d) => (d.dayKey === dayKey ? fn(d) : d)) }
      )
    );

  const updateCoachDayStatus: MemberContextType["updateCoachDayStatus"] = (coachId, dayKey, isWorkingDay) =>
    mapDay(coachId, dayKey, (d) => ({ ...d, isWorkingDay }));
  const toggleCoachSlotAvailability: MemberContextType["toggleCoachSlotAvailability"] = (coachId, dayKey, slotId) =>
    mapDay(coachId, dayKey, (d) => ({
      ...d,
      slots: d.slots.map((s) => (s.id === slotId ? { ...s, isAvailable: !s.isAvailable } : s)),
    }));
  const addCoachSlot: MemberContextType["addCoachSlot"] = (coachId, dayKey, time, label) =>
    mapDay(coachId, dayKey, (d) => ({
      ...d,
      slots: [...d.slots, { id: `${dayKey}-custom-${Date.now()}`, time, isAvailable: true, label } as CoachTimeSlot],
    }));
  const removeCoachSlot: MemberContextType["removeCoachSlot"] = (coachId, dayKey, slotId) =>
    mapDay(coachId, dayKey, (d) => ({ ...d, slots: d.slots.filter((s) => s.id !== slotId) }));
  const copyCoachScheduleToWeekdays: MemberContextType["copyCoachScheduleToWeekdays"] = (coachId, sourceDayKey) =>
    mutateSchedules((all) =>
      all.map((coach) => {
        if (coach.coachId !== coachId) return coach;
        const source = coach.weeklySchedule.find((d) => d.dayKey === sourceDayKey);
        if (!source) return coach;
        const weekdays = ["pzt", "sal", "car", "per", "cum"];
        return {
          ...coach,
          weeklySchedule: coach.weeklySchedule.map((day) =>
            weekdays.includes(day.dayKey)
              ? {
                  ...day,
                  isWorkingDay: source.isWorkingDay,
                  slots: source.slots.map((s) => ({ ...s, id: `${day.dayKey}-${s.id.split("-").slice(1).join("-")}` })),
                }
              : day
          ),
        };
      })
    );

  const toggleCoachSlotForDate: MemberContextType["toggleCoachSlotForDate"] = (date, timeSlot) => {
    if (!admin) return;
    const current = admin.blocked[date] || [];
    const exists = current.some((s) => timeSlotsOverlap(s, timeSlot));
    const blocked = {
      ...admin.blocked,
      [date]: exists ? current.filter((s) => !timeSlotsOverlap(s, timeSlot)) : [...current, timeSlot],
    };
    setAdmin({ ...admin, blocked });
    void saveSettings({ blocked });
  };

  return (
    <MemberContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        mounted,
        activeTab,
        setActiveTab,
        canGoBack: tabHistory.length > 0 || activeTab !== "dashboard",
        goBack,
        viewMode,
        toggleViewMode,
        refresh,
        remainingSessions: snapshot?.remainingSessions ?? 0,
        totalSessions: snapshot?.totalSessions ?? 0,
        packageExpiry: snapshot?.packageExpiry ?? "",
        bookedSessions: admin ? admin.bookings : snapshot?.bookings ?? [],
        bodyMeasurements: snapshot?.measurements ?? [],
        program: snapshot?.program ?? [],
        gifts: snapshot?.gifts ?? [],
        orders: snapshot?.orders ?? [],
        referral: snapshot?.referral ?? null,
        bankAccounts: snapshot?.bankAccounts ?? [],
        login,
        register,
        logout,
        bookSession,
        cancelSession,
        purchasePackage,
        addBodyMeasurement,
        updateUserProfile,
        changePassword,
        addSavedCard,
        removeSavedCard,
        setDefaultCard,
        updateAddress,
        coachSchedules,
        coachBlockedDateSlots,
        checkSlotAvailability,
        crmMembers: admin?.members ?? [],
        adminOrders: admin?.orders ?? [],
        adminMeasurements: admin?.measurements ?? [],
        adminGifts: admin?.gifts ?? [],
        studioSettings,
        adminCreateSession,
        confirmBooking,
        cancelBookedSession,
        completeBookedSession,
        rescheduleBookedSession,
        approveOrder,
        adminQuickSale,
        addNewMember,
        updateMemberDetails,
        updateMemberSessions,
        adminAddMeasurement,
        createGift,
        updateGiftStatus,
        adminCheckIn,
        updateStudioSettings,
        addStudioBankAccount,
        removeStudioBankAccount,
        updateCoachDayStatus,
        toggleCoachSlotAvailability,
        addCoachSlot,
        removeCoachSlot,
        copyCoachScheduleToWeekdays,
        toggleCoachSlotForDate,
        isQuickQrOpen,
        setIsQuickQrOpen,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
};
