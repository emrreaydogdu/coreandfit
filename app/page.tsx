"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { HomePageApple } from "./page.apple";
import { HomePageClassic } from "./page.classic";

export default function HomePage() {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <HomePageClassic />;
  }

  return <HomePageApple />;
}
