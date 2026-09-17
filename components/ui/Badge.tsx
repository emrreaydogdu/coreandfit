import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "muted" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "accent",
  className,
}) => {
  const styles = {
    accent:
      "bg-[#E8FF36]/10 text-[#E8FF36] border border-[#E8FF36]/30 font-semibold",
    muted: "bg-[#131519] text-[#A5A7AD] border border-[#23272F]",
    outline: "bg-transparent text-white/90 border border-white/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider",
        styles[variant],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF36]" />
      {children}
    </span>
  );
};
