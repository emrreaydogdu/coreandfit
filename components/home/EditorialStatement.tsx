"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { EditorialStatement as AppleEditorialStatement } from "./EditorialStatement.apple";
import { EditorialStatement as ClassicEditorialStatement } from "./EditorialStatement.classic";

export const EditorialStatement: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicEditorialStatement />;
  }

  return <AppleEditorialStatement />;
};
