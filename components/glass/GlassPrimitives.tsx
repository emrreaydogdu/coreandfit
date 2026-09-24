"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

/** Sabit aurora arka planı: cam yüzeylerin arkasında kırılacak renk alanı. */
export const GlassBackdrop: React.FC = () => (
  <div className="cg-backdrop" aria-hidden="true">
    <div className="cg-orb cg-orb-1" />
    <div className="cg-orb cg-orb-2" />
    <div className="cg-orb cg-orb-3" />
    <div className="cg-grain" />
  </div>
);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Ağır, bulanıklıktan netleşen giriş animasyonu. */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 40 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(10px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

export const Stagger: React.FC<{ children: React.ReactNode; className?: string; gap?: number }> = ({
  children,
  className,
  gap = 0.09,
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    transition={{ staggerChildren: gap }}
  >
    {children}
  </motion.div>
);

export const StaggerChild: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: EASE } },
    }}
  >
    {children}
  </motion.div>
);

/** Mikro etiket: bölüm başlıklarının üstündeki eyebrow. */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span className={cn("cg-chip", className)}>
    <span className="cg-chip-dot" />
    {children}
  </span>
);
