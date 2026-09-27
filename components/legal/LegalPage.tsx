import React from "react";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/config/business";

// Yasal sayfalar (KVKK, açık rıza, gizlilik, çerez) için ortak düzen.
export const LEGAL_LINKS = [
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/acik-riza-metni", label: "Açık Rıza Metni" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
];

export const controllerName = () => BUSINESS_CONFIG.legal.controllerTitle ?? BUSINESS_CONFIG.fullName;
export const controllerAddress = () => BUSINESS_CONFIG.legal.address ?? BUSINESS_CONFIG.displayLocation;

export const LegalPage: React.FC<{ title: string; intro: React.ReactNode; current: string; children: React.ReactNode }> = ({
  title,
  intro,
  current,
  children,
}) => (
  <div className="pt-28 pb-20 bg-[#08090B] text-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8FF36] block mb-3">YASAL BİLGİLENDİRME</span>
      <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-display mb-4">{title}</h1>
      <p className="text-xs font-mono text-[#72757C] mb-8">Son güncelleme: {BUSINESS_CONFIG.legal.lastUpdated}</p>

      <nav aria-label="Yasal metinler" className="flex flex-wrap gap-2 mb-6">
        {LEGAL_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 border text-[11px] font-mono uppercase tracking-wider transition-colors ${
              l.href === current ? "border-[#E8FF36] text-[#E8FF36]" : "border-[#23272F] text-[#A5A7AD] hover:border-[#343A46]"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="bg-[#0D0F12] border border-[#23272F] p-6 sm:p-12 space-y-6 text-xs sm:text-sm text-[#A5A7AD] leading-relaxed">
        <div className="space-y-3">{intro}</div>
        {children}
        <div className="pt-6 border-t border-[#191B20] text-xs font-mono text-[#72757C] space-y-1">
          <p>Veri sorumlusu: {controllerName()}</p>
          <p>Adres: {controllerAddress()}</p>
          <p>
            E-posta: {BUSINESS_CONFIG.email} • Telefon: {BUSINESS_CONFIG.phone}
            {BUSINESS_CONFIG.legal.kepAddress ? ` • KEP: ${BUSINESS_CONFIG.legal.kepAddress}` : ""}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-base font-bold text-white uppercase font-display pt-4">{children}</h2>
);

export const List: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1.5">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export const Table: React.FC<{ head: string[]; rows: React.ReactNode[][] }> = ({ head, rows }) => (
  <div className="overflow-x-auto border border-[#23272F]">
    <table className="w-full text-left text-xs min-w-[520px]">
      <thead className="bg-[#111317] text-white">
        <tr>
          {head.map((h) => (
            <th key={h} className="p-3 font-semibold align-top">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#191B20]">
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="p-3 align-top">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong className="text-white">{children}</strong>;
