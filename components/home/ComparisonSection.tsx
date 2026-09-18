"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { ComparisonSection as AppleComparisonSection } from "./ComparisonSection.apple";
import { ComparisonSection as ClassicComparisonSection } from "./ComparisonSection.classic";

export const ComparisonSection: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicComparisonSection />;
  }

  return <AppleComparisonSection />;
};
