"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { Footer as AppleFooter } from "./Footer.apple";
import { Footer as ClassicFooter } from "./Footer.classic";

export const Footer: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicFooter />;
  }

  return <AppleFooter />;
};
