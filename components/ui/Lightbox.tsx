"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string | null;
  imageAlt?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
}) => {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Kapat"
        className="absolute top-6 right-6 p-2 bg-[#131519] border border-[#23272F] text-white hover:text-[#E8FF36] transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-5xl w-full max-h-[85vh] aspect-[16/10]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageSrc}
          alt={imageAlt || "Stüdyo Detay Görseli"}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
};
