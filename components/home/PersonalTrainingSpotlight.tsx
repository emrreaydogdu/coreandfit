"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { PersonalTrainingSpotlight as ApplePersonalTrainingSpotlight } from "./PersonalTrainingSpotlight.apple";
import { PersonalTrainingSpotlight as ClassicPersonalTrainingSpotlight } from "./PersonalTrainingSpotlight.classic";

export const PersonalTrainingSpotlight: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicPersonalTrainingSpotlight />;
  }

  return <ApplePersonalTrainingSpotlight />;
};
