"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { Header as AppleHeader } from "./Header.apple";
import { Header as ClassicHeader } from "./Header.classic";

export const Header: React.FC = () => {
  const { designMode, mounted } = useDesignMode();
  const pathname = usePathname();

  if (pathname?.startsWith("/portal") || pathname?.startsWith("/admin")) {
    return null;
  }

  if (mounted && designMode === "classic") {
    return <ClassicHeader />;
  }

  return <AppleHeader />;
};
