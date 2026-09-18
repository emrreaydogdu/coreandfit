"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { SystemSection as AppleSystemSection } from "./SystemSection.apple";
import { SystemSection as ClassicSystemSection } from "./SystemSection.classic";

export const SystemSection: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicSystemSection />;
  }

  return <AppleSystemSection />;
};
