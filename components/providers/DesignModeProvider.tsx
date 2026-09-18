"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DesignMode = "apple" | "classic";

interface DesignModeContextType {
  designMode: DesignMode;
  setDesignMode: (mode: DesignMode) => void;
  toggleDesignMode: () => void;
  mounted: boolean;
}

const DesignModeContext = createContext<DesignModeContextType>({
  designMode: "apple",
  setDesignMode: () => {},
  toggleDesignMode: () => {},
  mounted: false,
});

export const DesignModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designMode, setDesignModeState] = useState<DesignMode>("apple");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("coreandfit_design_mode") as DesignMode | null;
      if (saved === "apple" || saved === "classic") {
        setDesignModeState(saved);
        applyDesign(saved);
      } else {
        setDesignModeState("apple");
        applyDesign("apple");
      }
    } catch {
      applyDesign("apple");
    }
  }, []);

  const applyDesign = (mode: DesignMode) => {
    const root = document.documentElement;
    root.setAttribute("data-design", mode);
    if (mode === "classic") {
      root.classList.add("design-classic");
      root.classList.remove("design-apple");
    } else {
      root.classList.add("design-apple");
      root.classList.remove("design-classic");
    }
  };

  const setDesignMode = (newMode: DesignMode) => {
    setDesignModeState(newMode);
    applyDesign(newMode);
    try {
      localStorage.setItem("coreandfit_design_mode", newMode);
      window.dispatchEvent(new CustomEvent("coreandfit-design-change", { detail: newMode }));
    } catch {}
  };

  const toggleDesignMode = () => {
    const next = designMode === "apple" ? "classic" : "apple";
    setDesignMode(next);
  };

  useEffect(() => {
    const handleDesignChange = (e: Event) => {
      const customEvent = e as CustomEvent<DesignMode>;
      if (customEvent.detail && customEvent.detail !== designMode) {
        setDesignModeState(customEvent.detail);
        applyDesign(customEvent.detail);
      }
    };
    window.addEventListener("coreandfit-design-change", handleDesignChange);
    return () => window.removeEventListener("coreandfit-design-change", handleDesignChange);
  }, [designMode]);

  return (
    <DesignModeContext.Provider value={{ designMode, setDesignMode, toggleDesignMode, mounted }}>
      {children}
    </DesignModeContext.Provider>
  );
};

export const useDesignMode = () => useContext(DesignModeContext);
