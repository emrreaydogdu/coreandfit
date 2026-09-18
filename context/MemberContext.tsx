"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MemberUser,
  BookedSession,
  CheckInLog,
  OrderItem,
  PortalTab,
  PaymentMethod,
  SavedCard,
  UserAddress,
  StudioSettings,
  StudioBankAccount,
  CoachScheduleProfile,
  CoachDaySchedule,
  CoachTimeSlot,
} from "@/types/portal";
import {
  DEMO_USER,
  INITIAL_BOOKED_SESSIONS,
  INITIAL_CHECKIN_LOGS,
  INITIAL_ORDERS,
  PORTAL_PACKAGES,
  DEFAULT_STUDIO_SETTINGS,
  DEFAULT_COACH_SCHEDULES,
} from "@/data/portal-mock";

interface MemberContextType {
  user: MemberUser | null;
  isAuthenticated: boolean;
  mounted: boolean;
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  viewMode: "app_frame" | "responsive";
  setViewMode: (mode: "app_frame" | "responsive") => void;
  toggleViewMode: () => void;

  // Seans Durumları
  remainingSessions: number;
  totalSessions: number;
  packageExpiry: string;
  bookedSessions: BookedSession[];
  checkInLogs: CheckInLog[];
  orders: OrderItem[];

  // İşletme & Stüdyo Ayarları
  studioSettings: StudioSettings;
  updateStudioSettings: (newSettings: Partial<StudioSettings>) => void;
  addStudioBankAccount: (account: Omit<StudioBankAccount, "id">) => void;
  removeStudioBankAccount: (accountId: string) => void;

  // Koç Randevu Saatleri & Müsaitlik
  coachSchedules: CoachScheduleProfile[];
  updateCoachDayStatus: (coachId: string, dayKey: string, isWorkingDay: boolean) => void;
  toggleCoachSlotAvailability: (coachId: string, dayKey: string, slotId: string) => void;
  addCoachSlot: (coachId: string, dayKey: string, time: string, label?: string) => void;
  removeCoachSlot: (coachId: string, dayKey: string, slotId: string) => void;
  copyCoachScheduleToWeekdays: (coachId: string, sourceDayKey: string) => void;

  // Yönetici Manuel Seans Planlama
  adminCreateSession: (data: {
    memberId?: string;
    memberName: string;
    memberNo?: string;
    coachId: string;
    coachName: string;
    coachTitle?: string;
    coachAvatar?: string;
    date: string;
    timeSlot: string;
    focusArea: string;
    station: string;
    notes?: string;
    deductCredit: boolean;
  }) => { success: boolean; message: string; session: BookedSession };

  // Fonksiyonlar
  login: (email: string, pass: string) => boolean;
  loginDemo: () => void;
  logout: () => void;
  register: (userData: { fullName: string; email: string; phone: string }) => void;
  bookSession: (data: {
    coachId: string;
    coachName: string;
    coachTitle: string;
    coachAvatar: string;
    date: string;
    timeSlot: string;
    focusArea: string;
    station: string;
    notes?: string;
  }) => { success: boolean; message: string };
  cancelSession: (sessionId: string) => { success: boolean; message: string };
  purchasePackage: (data: {
    packageId: string;
    paymentMethod: PaymentMethod;
    cardDetails?: {
      cardNumber: string;
      cardHolder: string;
      expiry: string;
      cvv: string;
    };
  }) => { success: boolean; order: OrderItem };

  // Profil & Bilgi Güncelleme
  updateUserProfile: (data: Partial<MemberUser>) => void;
  addSavedCard: (card: Omit<SavedCard, "id">) => void;
  removeSavedCard: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;
  updateAddress: (address: UserAddress) => void;

  // Yönetici & Koç İşlemleri
  approveOrder: (orderId: string) => void;
  adminCheckInMember: (data: {
    coachName: string;
    sessionType: string;
    performanceNote: string;
    keyMetric?: string;
  }) => { success: boolean; message: string };
  adminAddSessions: (count: number) => void;
  completeBookedSession: (sessionId: string, coachNote: string, metric?: string) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "cf_member_user",
  REMAINING: "cf_member_remaining_sessions",
  TOTAL: "cf_member_total_sessions",
  EXPIRY: "cf_member_package_expiry",
  BOOKED: "cf_member_booked_sessions",
  CHECKIN: "cf_member_checkin_logs",
  ORDERS: "cf_member_orders",
  VIEW_MODE: "cf_member_view_mode",
  STUDIO_SETTINGS: "cf_studio_settings",
  COACH_SCHEDULES: "cf_coach_schedules",
};

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<MemberUser | null>(null);
  const [activeTab, setActiveTab] = useState<PortalTab>("dashboard");
  const [viewMode, setViewMode] = useState<"app_frame" | "responsive">("responsive");

  const [remainingSessions, setRemainingSessions] = useState<number>(9);
  const [totalSessions, setTotalSessions] = useState<number>(12);
  const [packageExpiry, setPackageExpiry] = useState<string>("28 Ekim 2026");
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>(INITIAL_BOOKED_SESSIONS);
  const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>(INITIAL_CHECKIN_LOGS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [studioSettings, setStudioSettings] = useState<StudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [coachSchedules, setCoachSchedules] = useState<CoachScheduleProfile[]>(DEFAULT_COACH_SCHEDULES);

  // LocalStorage senkronizasyonu
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Varsayılan olarak hazır demo kullanıcı oturumu açık olsun (müşteriye anında çalışan deneyim)
        setUser(DEMO_USER);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
      }

      const savedRemaining = localStorage.getItem(STORAGE_KEYS.REMAINING);
      if (savedRemaining) setRemainingSessions(parseInt(savedRemaining, 10));

      const savedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL);
      if (savedTotal) setTotalSessions(parseInt(savedTotal, 10));

      const savedExpiry = localStorage.getItem(STORAGE_KEYS.EXPIRY);
      if (savedExpiry) setPackageExpiry(savedExpiry);

      const savedBooked = localStorage.getItem(STORAGE_KEYS.BOOKED);
      if (savedBooked) setBookedSessions(JSON.parse(savedBooked));

      const savedCheckIn = localStorage.getItem(STORAGE_KEYS.CHECKIN);
      if (savedCheckIn) setCheckInLogs(JSON.parse(savedCheckIn));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSettings = localStorage.getItem(STORAGE_KEYS.STUDIO_SETTINGS);
      if (savedSettings) {
        setStudioSettings(JSON.parse(savedSettings));
      } else {
        setStudioSettings(DEFAULT_STUDIO_SETTINGS);
        localStorage.setItem(STORAGE_KEYS.STUDIO_SETTINGS, JSON.stringify(DEFAULT_STUDIO_SETTINGS));
      }

      const savedSchedules = localStorage.getItem(STORAGE_KEYS.COACH_SCHEDULES);
      if (savedSchedules) {
        setCoachSchedules(JSON.parse(savedSchedules));
      } else {
        setCoachSchedules(DEFAULT_COACH_SCHEDULES);
        localStorage.setItem(STORAGE_KEYS.COACH_SCHEDULES, JSON.stringify(DEFAULT_COACH_SCHEDULES));
      }

      const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      if (savedViewMode === "app_frame" || savedViewMode === "responsive") {
        setViewMode(savedViewMode);
      }
    } catch (e) {
      console.error("Storage error:", e);
    } finally {
      setMounted(true);
    }
  }, []);

  const saveToStorage = (key: string, value: any) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      }
    } catch (e) {
      console.error("Failed to save to storage:", e);
    }
  };

  const toggleViewMode = () => {
    const nextMode = viewMode === "app_frame" ? "responsive" : "app_frame";
    setViewMode(nextMode);
    saveToStorage(STORAGE_KEYS.VIEW_MODE, nextMode);
  };

  const login = (email: string, pass: string): boolean => {
    // Basit doğrulama veya demo
    const loggedUser: MemberUser = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
    };
    setUser(loggedUser);
    saveToStorage(STORAGE_KEYS.USER, loggedUser);
    return true;
  };

  const loginDemo = () => {
    setUser(DEMO_USER);
    saveToStorage(STORAGE_KEYS.USER, DEMO_USER);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error(e);
    }
  };

  const register = (userData: { fullName: string; email: string; phone: string }) => {
    const newUser: MemberUser = {
      id: `user-${Date.now()}`,
      memberNo: `CF-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      avatarUrl: DEMO_USER.avatarUrl,
      membershipTier: "VIP 1:1 Personal Training",
      joinDate: "Bugün",
    };
    setUser(newUser);
    saveToStorage(STORAGE_KEYS.USER, newUser);
  };

  // Yeni Seans Ayırtma
  const bookSession = (data: {
    coachId: string;
    coachName: string;
    coachTitle: string;
    coachAvatar: string;
    date: string;
    timeSlot: string;
    focusArea: string;
    station: string;
    notes?: string;
  }) => {
    if (remainingSessions <= 0) {
      return {
        success: false,
        message: "Kayıtlı seans krediniz kalmamıştır. Lütfen 'Paket Al' sekmesinden yeni seans yükleyiniz.",
      };
    }

    const newSession: BookedSession = {
      id: `sess-${Date.now()}`,
      coachId: data.coachId,
      coachName: data.coachName,
      coachTitle: data.coachTitle,
      coachAvatar: data.coachAvatar,
      date: data.date,
      timeSlot: data.timeSlot,
      focusArea: data.focusArea,
      station: data.station,
      status: "confirmed",
      notes: data.notes,
      createdAt: "Bugün",
    };

    const nextBooked = [newSession, ...bookedSessions];
    const nextRemaining = remainingSessions - 1;

    setBookedSessions(nextBooked);
    setRemainingSessions(nextRemaining);

    saveToStorage(STORAGE_KEYS.BOOKED, nextBooked);
    saveToStorage(STORAGE_KEYS.REMAINING, nextRemaining.toString());

    return {
      success: true,
      message: `${data.date} saat ${data.timeSlot} için ${data.coachName} ile seansınız onaylandı. 1 seans bakiyenizden düşüldü.`,
    };
  };

  // Seans İptal Etme
  const cancelSession = (sessionId: string) => {
    const targetSession = bookedSessions.find((s) => s.id === sessionId);
    if (!targetSession) {
      return { success: false, message: "Seans bulunamadı." };
    }

    const nextBooked = bookedSessions.filter((s) => s.id !== sessionId);
    const nextRemaining = remainingSessions + 1; // Kredi iade edilir

    setBookedSessions(nextBooked);
    setRemainingSessions(nextRemaining);

    saveToStorage(STORAGE_KEYS.BOOKED, nextBooked);
    saveToStorage(STORAGE_KEYS.REMAINING, nextRemaining.toString());

    return {
      success: true,
      message: "Seans başarıyla iptal edildi ve 1 seans krediniz bakiyenize iade edildi.",
    };
  };

  // Paket Satın Alma (Online Kart, Kasada Nakit, Kasada POS, Havale)
  const purchasePackage = (data: {
    packageId: string;
    paymentMethod: PaymentMethod;
    cardDetails?: {
      cardNumber: string;
      cardHolder: string;
      expiry: string;
      cvv: string;
    };
  }) => {
    const pkg = PORTAL_PACKAGES.find((p) => p.id === data.packageId) || PORTAL_PACKAGES[0];

    const isOnline = data.paymentMethod === "online_card";
    const status = isOnline
      ? "completed"
      : data.paymentMethod === "bank_transfer"
      ? "pending_transfer"
      : "pending_cashier";

    const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = `${now.getDate()} ${
      ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"][
        now.getMonth()
      ]
    } ${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: `CF-ORD-${now.getFullYear()}-${randomOrderNum}`,
      packageId: pkg.id,
      packageName: pkg.name,
      sessionCount: pkg.sessionCount,
      amount: pkg.price,
      formattedAmount: pkg.formattedPrice,
      paymentMethod: data.paymentMethod,
      paymentStatus: status,
      createdAt: formattedDate,
      receiptCode: `REC-${randomOrderNum}-${data.paymentMethod.toUpperCase()}`,
      paidAt: isOnline ? formattedDate : undefined,
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    saveToStorage(STORAGE_KEYS.ORDERS, nextOrders);

    // Seans bakiyesini güncelle
    const nextRemaining = remainingSessions + pkg.sessionCount;
    const nextTotal = totalSessions + pkg.sessionCount;
    setRemainingSessions(nextRemaining);
    setTotalSessions(nextTotal);

    saveToStorage(STORAGE_KEYS.REMAINING, nextRemaining.toString());
    saveToStorage(STORAGE_KEYS.TOTAL, nextTotal.toString());

    return {
      success: true,
      order: newOrder,
    };
  };

  const updateUserProfile = (data: Partial<MemberUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    saveToStorage(STORAGE_KEYS.USER, updated);
  };

  const addSavedCard = (newCardData: Omit<SavedCard, "id">) => {
    if (!user) return;
    const newCard: SavedCard = {
      ...newCardData,
      id: `card-${Date.now()}`,
    };
    const currentCards = user.savedCards || [];
    const updatedCards = newCard.isDefault
      ? [...currentCards.map((c) => ({ ...c, isDefault: false })), newCard]
      : [...currentCards, newCard];
    updateUserProfile({ savedCards: updatedCards });
  };

  const removeSavedCard = (cardId: string) => {
    if (!user || !user.savedCards) return;
    const updatedCards = user.savedCards.filter((c) => c.id !== cardId);
    updateUserProfile({ savedCards: updatedCards });
  };

  const setDefaultCard = (cardId: string) => {
    if (!user || !user.savedCards) return;
    const updatedCards = user.savedCards.map((c) => ({
      ...c,
      isDefault: c.id === cardId,
    }));
    updateUserProfile({ savedCards: updatedCards });
  };

  const updateAddress = (address: UserAddress) => {
    updateUserProfile({ address });
  };

  const approveOrder = (orderId: string) => {
    const updatedOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          paymentStatus: "completed" as const,
          paidAt: new Date().toLocaleString("tr-TR"),
        };
      }
      return ord;
    });
    setOrders(updatedOrders);
    saveToStorage(STORAGE_KEYS.ORDERS, updatedOrders);
  };

  const adminCheckInMember = (data: {
    coachName: string;
    sessionType: string;
    performanceNote: string;
    keyMetric?: string;
  }) => {
    if (remainingSessions <= 0) {
      return { success: false, message: "Üyenin kalan seans bakiyesi bulunmuyor (0 Seans)!" };
    }
    const nextRemaining = remainingSessions - 1;
    setRemainingSessions(nextRemaining);
    saveToStorage(STORAGE_KEYS.REMAINING, nextRemaining.toString());

    const now = new Date();
    const trMonths = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
    const formattedDate = `${now.getDate()} ${trMonths[now.getMonth()]} ${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newLog: CheckInLog = {
      id: `log-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      coachName: data.coachName,
      sessionType: data.sessionType,
      performanceNote: data.performanceNote,
      keyMetric: data.keyMetric,
    };

    const nextLogs = [newLog, ...checkInLogs];
    setCheckInLogs(nextLogs);
    saveToStorage(STORAGE_KEYS.CHECKIN, nextLogs);

    return {
      success: true,
      message: `Turnike girişi onaylandı! 1 Seans düşüldü. Kalan: ${nextRemaining}`,
    };
  };

  const adminAddSessions = (count: number) => {
    const nextRemaining = remainingSessions + count;
    const nextTotal = totalSessions + count;
    setRemainingSessions(nextRemaining);
    setTotalSessions(nextTotal);
    saveToStorage(STORAGE_KEYS.REMAINING, nextRemaining.toString());
    saveToStorage(STORAGE_KEYS.TOTAL, nextTotal.toString());
  };

  const completeBookedSession = (sessionId: string, coachNote: string, metric?: string) => {
    const sess = bookedSessions.find((s) => s.id === sessionId);
    if (!sess) return;

    const updatedBooked = bookedSessions.map((s) =>
      s.id === sessionId ? { ...s, status: "completed" as const } : s
    );
    setBookedSessions(updatedBooked);
    saveToStorage(STORAGE_KEYS.BOOKED, updatedBooked);

    adminCheckInMember({
      coachName: sess.coachName,
      sessionType: sess.focusArea,
      performanceNote: coachNote,
      keyMetric: metric,
    });
  };

  // İşletme Ayarları Yönetimi
  const updateStudioSettings = (newSettings: Partial<StudioSettings>) => {
    setStudioSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveToStorage(STORAGE_KEYS.STUDIO_SETTINGS, updated);
      return updated;
    });
  };

  const addStudioBankAccount = (account: Omit<StudioBankAccount, "id">) => {
    setStudioSettings((prev) => {
      const newAcc: StudioBankAccount = {
        ...account,
        id: `bank-${Date.now()}`,
      };
      const updated = {
        ...prev,
        bankAccounts: [...prev.bankAccounts, newAcc],
      };
      saveToStorage(STORAGE_KEYS.STUDIO_SETTINGS, updated);
      return updated;
    });
  };

  const removeStudioBankAccount = (accountId: string) => {
    setStudioSettings((prev) => {
      const updated = {
        ...prev,
        bankAccounts: prev.bankAccounts.filter((b) => b.id !== accountId),
      };
      saveToStorage(STORAGE_KEYS.STUDIO_SETTINGS, updated);
      return updated;
    });
  };

  // Koç Randevu Saatleri & Müsaitlik Yönetimi
  const updateCoachDayStatus = (coachId: string, dayKey: string, isWorkingDay: boolean) => {
    setCoachSchedules((prev) => {
      const updated = prev.map((coach) => {
        if (coach.coachId !== coachId) return coach;
        return {
          ...coach,
          weeklySchedule: coach.weeklySchedule.map((day) => {
            if (day.dayKey !== dayKey) return day;
            return { ...day, isWorkingDay };
          }),
        };
      });
      saveToStorage(STORAGE_KEYS.COACH_SCHEDULES, updated);
      return updated;
    });
  };

  const toggleCoachSlotAvailability = (coachId: string, dayKey: string, slotId: string) => {
    setCoachSchedules((prev) => {
      const updated = prev.map((coach) => {
        if (coach.coachId !== coachId) return coach;
        return {
          ...coach,
          weeklySchedule: coach.weeklySchedule.map((day) => {
            if (day.dayKey !== dayKey) return day;
            return {
              ...day,
              slots: day.slots.map((slot) => {
                if (slot.id !== slotId) return slot;
                return { ...slot, isAvailable: !slot.isAvailable };
              }),
            };
          }),
        };
      });
      saveToStorage(STORAGE_KEYS.COACH_SCHEDULES, updated);
      return updated;
    });
  };

  const addCoachSlot = (coachId: string, dayKey: string, time: string, label?: string) => {
    setCoachSchedules((prev) => {
      const updated = prev.map((coach) => {
        if (coach.coachId !== coachId) return coach;
        return {
          ...coach,
          weeklySchedule: coach.weeklySchedule.map((day) => {
            if (day.dayKey !== dayKey) return day;
            const newSlot: CoachTimeSlot = {
              id: `${dayKey}-custom-${Date.now()}`,
              time,
              isAvailable: true,
              label,
            };
            return {
              ...day,
              slots: [...day.slots, newSlot],
            };
          }),
        };
      });
      saveToStorage(STORAGE_KEYS.COACH_SCHEDULES, updated);
      return updated;
    });
  };

  const removeCoachSlot = (coachId: string, dayKey: string, slotId: string) => {
    setCoachSchedules((prev) => {
      const updated = prev.map((coach) => {
        if (coach.coachId !== coachId) return coach;
        return {
          ...coach,
          weeklySchedule: coach.weeklySchedule.map((day) => {
            if (day.dayKey !== dayKey) return day;
            return {
              ...day,
              slots: day.slots.filter((s) => s.id !== slotId),
            };
          }),
        };
      });
      saveToStorage(STORAGE_KEYS.COACH_SCHEDULES, updated);
      return updated;
    });
  };

  const copyCoachScheduleToWeekdays = (coachId: string, sourceDayKey: string) => {
    setCoachSchedules((prev) => {
      const targetCoach = prev.find((c) => c.coachId === coachId);
      if (!targetCoach) return prev;
      const sourceDay = targetCoach.weeklySchedule.find((d) => d.dayKey === sourceDayKey);
      if (!sourceDay) return prev;

      const weekdays = ["pzt", "sal", "car", "per", "cum"];
      const updated = prev.map((coach) => {
        if (coach.coachId !== coachId) return coach;
        return {
          ...coach,
          weeklySchedule: coach.weeklySchedule.map((day) => {
            if (!weekdays.includes(day.dayKey)) return day;
            return {
              ...day,
              isWorkingDay: sourceDay.isWorkingDay,
              slots: sourceDay.slots.map((s) => ({ ...s, id: `${day.dayKey}-${s.id.split("-").slice(1).join("-")}` })),
            };
          }),
        };
      });
      saveToStorage(STORAGE_KEYS.COACH_SCHEDULES, updated);
      return updated;
    });
  };

  // Yönetici Tarafından Manuel Seans Oluşturma
  const adminCreateSession = (data: {
    memberId?: string;
    memberName: string;
    memberNo?: string;
    coachId: string;
    coachName: string;
    coachTitle?: string;
    coachAvatar?: string;
    date: string;
    timeSlot: string;
    focusArea: string;
    station: string;
    notes?: string;
    deductCredit: boolean;
  }) => {
    const newSession: BookedSession = {
      id: `sess-adm-${Date.now()}`,
      memberId: data.memberId || user?.id,
      memberName: data.memberName,
      memberNo: data.memberNo || user?.memberNo,
      coachId: data.coachId,
      coachName: data.coachName,
      coachTitle: data.coachTitle || "Kıdemli Koç",
      coachAvatar:
        data.coachAvatar ||
        "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
      date: data.date,
      timeSlot: data.timeSlot,
      focusArea: data.focusArea,
      station: data.station,
      status: "confirmed",
      notes: data.notes,
      createdAt: "Yönetici Tarafından Eklendi",
    };

    const nextBooked = [newSession, ...bookedSessions];
    setBookedSessions(nextBooked);
    saveToStorage(STORAGE_KEYS.BOOKED, nextBooked);

    let creditMsg = "";
    if (data.deductCredit && remainingSessions > 0) {
      const nextRemaining = remainingSessions - 1;
      setRemainingSessions(nextRemaining);
      saveToStorage(STORAGE_KEYS.REMAINING, nextRemaining.toString());
      creditMsg = ` (1 seans kredisi düşüldü, kalan: ${nextRemaining})`;
    }

    return {
      success: true,
      message: `${data.memberName} için ${data.date} saat ${data.timeSlot} seansı başarıyla oluşturuldu!${creditMsg}`,
      session: newSession,
    };
  };

  return (
    <MemberContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        mounted,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        toggleViewMode,
        remainingSessions,
        totalSessions,
        packageExpiry,
        bookedSessions,
        checkInLogs,
        orders,
        studioSettings,
        updateStudioSettings,
        addStudioBankAccount,
        removeStudioBankAccount,
        coachSchedules,
        updateCoachDayStatus,
        toggleCoachSlotAvailability,
        addCoachSlot,
        removeCoachSlot,
        copyCoachScheduleToWeekdays,
        adminCreateSession,
        login,
        loginDemo,
        logout,
        register,
        bookSession,
        cancelSession,
        purchasePackage,
        updateUserProfile,
        addSavedCard,
        removeSavedCard,
        setDefaultCard,
        updateAddress,
        approveOrder,
        adminCheckInMember,
        adminAddSessions,
        completeBookedSession,
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
