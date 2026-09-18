"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { HeroSection as AppleHeroSection } from "./HeroSection.apple";
import { HeroSection as ClassicHeroSection } from "./HeroSection.classic";

export const HeroSection: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicHeroSection />;
  }

  return <AppleHeroSection />;
};
