"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { Header as AppleHeader } from "./Header.apple";
import { Header as ClassicHeader } from "./Header.classic";

export const Header: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicHeader />;
  }

  return <AppleHeader />;
};
