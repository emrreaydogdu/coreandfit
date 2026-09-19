import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string) {
  return phone;
}

let lockCount = 0;
let previousScrollY = 0;

/**
 * Bulletproof body scroll lock for mobile Safari (iOS), Android Chrome, and desktop.
 * Uses position: fixed on body + top offset preservation + overscroll containment.
 */
export function lockBodyScroll() {
  if (typeof window === "undefined") return;

  lockCount++;
  if (lockCount > 1) return; // already locked

  previousScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  // Lock html
  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.overscrollBehavior = "none";
  document.documentElement.classList.add("mobile-menu-open");

  // Lock body with fixed positioning to prevent iOS rubber-banding or background movement
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${previousScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.overscrollBehavior = "none";
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }
  document.body.setAttribute("data-mobile-menu", "open");
  document.body.setAttribute("data-scroll-locked", "true");
  document.body.classList.add("mobile-menu-open");

  window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: true }));
}

export function unlockBodyScroll() {
  if (typeof window === "undefined") return;

  if (lockCount > 0) {
    lockCount--;
  }
  if (lockCount > 0) return; // still locked by another consumer

  const savedTop = document.body.style.top;
  const scrollY = previousScrollY || (savedTop ? parseInt(savedTop, 10) * -1 : 0);

  // Unlock html
  document.documentElement.style.overflow = "";
  document.documentElement.style.overscrollBehavior = "";
  document.documentElement.classList.remove("mobile-menu-open");

  // Unlock body
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.height = "";
  document.body.style.paddingRight = "";
  document.body.style.overscrollBehavior = "";
  document.body.removeAttribute("data-mobile-menu");
  document.body.removeAttribute("data-scroll-locked");
  document.body.classList.remove("mobile-menu-open");

  window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: false }));

  // Restore scroll position instantly
  window.scrollTo({
    top: scrollY,
    behavior: "instant" as ScrollBehavior,
  });
}

