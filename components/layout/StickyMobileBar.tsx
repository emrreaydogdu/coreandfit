"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDesignMode } from "@/components/providers/DesignModeProvider";
import { StickyMobileBar as AppleStickyMobileBar } from "./StickyMobileBar.apple";
import { StickyMobileBar as ClassicStickyMobileBar } from "./StickyMobileBar.classic";

export const StickyMobileBar: React.FC = () => {
  const pathname = usePathname();
  const { designMode, mounted } = useDesignMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMenu = () => {
      setIsMobileMenuOpen(
        document.body.classList.contains("mobile-menu-open") ||
        document.body.getAttribute("data-mobile-menu") === "open"
      );
    };

    checkMenu();

    const observer = new MutationObserver(checkMenu);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-mobile-menu"],
    });

    const handleCustomToggle = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === "boolean") {
        setIsMobileMenuOpen(customEvent.detail);
      } else {
        checkMenu();
      }
    };

    window.addEventListener("mobile-menu-toggle", handleCustomToggle);

    return () => {
      observer.disconnect();
      window.removeEventListener("mobile-menu-toggle", handleCustomToggle);
    };
  }, []);

  // Hide sticky bar when mobile drawer is open, or on checkout/booking/portal/admin pages
  if (
    isMobileMenuOpen ||
    pathname === "/on-gorusme" ||
    pathname === "/randevu" ||
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  if (mounted && designMode === "classic") {
    return <ClassicStickyMobileBar />;
  }

  return <AppleStickyMobileBar />;
};
