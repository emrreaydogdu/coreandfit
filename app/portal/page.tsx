"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMember } from "@/context/MemberContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Loader2 } from "lucide-react";

export default function MemberPortalPage() {
  const { user, mounted } = useMember();
  const router = useRouter();

  useEffect(() => {
    if (mounted && !user) {
      router.push("/portal/giris");
    } else if (mounted && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center text-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#64748B]">
            Üye Paneli Yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  if (!user || user.role === "admin") {
    return null;
  }

  return <PortalLayout />;
}
