"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { GoalSelector as AppleGoalSelector } from "./GoalSelector.apple";
import { GoalSelector as ClassicGoalSelector } from "./GoalSelector.classic";

export const GoalSelector: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicGoalSelector />;
  }

  return <AppleGoalSelector />;
};
