"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMember } from "@/context/MemberContext";
import { AdminPortal } from "@/components/portal/admin/AdminPortal";

// Yönetici paneli yalnızca admin oturumunda açılır. Asıl yetki kontrolü API'de yapılır; bu katman yönlendirme içindir.
export const AdminGate: React.FC = () => {
  const { user, mounted } = useMember();
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;
    if (!user) router.replace("/portal/giris");
    else if (user.role !== "admin") router.replace("/portal");
  }, [mounted, user, router]);

  if (!mounted || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <AdminPortal />;
};
