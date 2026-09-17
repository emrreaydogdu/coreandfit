import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  isExternal,
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-200 select-none uppercase disabled:opacity-50 disabled:pointer-events-none text-center";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 min-h-[38px] rounded-none tracking-wider",
    md: "text-xs md:text-sm px-5 py-2.5 min-h-[44px] rounded-none tracking-wider font-semibold",
    lg: "text-sm md:text-base px-7 py-3.5 min-h-[50px] rounded-none tracking-wider font-bold",
  };

  const variantStyles = {
    primary:
      "bg-white text-[#08090B] hover:bg-[#F4F4F1] border border-white active:scale-[0.98]",
    accent:
      "bg-[#E8FF36] text-[#08090B] font-bold hover:bg-[#D4EB2B] border border-[#E8FF36] active:scale-[0.98] shadow-[0_0_20px_rgba(232,255,54,0.15)]",
    secondary:
      "bg-[#131519] text-[#FFFFFF] hover:bg-[#191B20] border border-[#23272F] active:scale-[0.98]",
    outline:
      "bg-transparent text-[#FFFFFF] hover:text-white hover:bg-white/5 border border-[#343A46] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#A5A7AD] hover:text-white hover:bg-white/5 border border-transparent",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth ? "w-full" : "",
    className
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
