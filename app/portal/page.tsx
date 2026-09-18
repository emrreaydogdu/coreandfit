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
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#08090B] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#E8FF36] animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#72757C]">
            Üye Paneli Yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <PortalLayout />;
}
