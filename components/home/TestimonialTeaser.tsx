"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { TestimonialTeaser as AppleTestimonialTeaser } from "./TestimonialTeaser.apple";
import { TestimonialTeaser as ClassicTestimonialTeaser } from "./TestimonialTeaser.classic";

export const TestimonialTeaser: React.FC = () => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicTestimonialTeaser />;
  }

  return <AppleTestimonialTeaser />;
};
