"use client";

import React from "react";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { FaqAccordion as AppleFaqAccordion } from "./FaqAccordion.apple";
import { FaqAccordion as ClassicFaqAccordion } from "./FaqAccordion.classic";
import { type FaqItem } from "@/data/faq";

interface FaqAccordionProps {
  items?: FaqItem[];
  limit?: number;
  title?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = (props) => {
  const { designMode, mounted } = useDesignMode();

  if (mounted && designMode === "classic") {
    return <ClassicFaqAccordion {...props} />;
  }

  return <AppleFaqAccordion {...props} />;
};
