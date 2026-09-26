import type { PackageItem } from "@/data/packages";

// Arkadaşını Getir referans indirimi. Tek merkezden hesaplanır; indirimli fiyat hiçbir yerde elle yazılmaz.
export const REFERRAL_DISCOUNT_RATE = 0.1;

export const discountRateFor = (pkg: PackageItem, referralDiscountActive: boolean) =>
  referralDiscountActive && pkg.referralEligible ? REFERRAL_DISCOUNT_RATE : 0;

export const finalPrice = (pkg: PackageItem, referralDiscountActive: boolean) =>
  Math.round(pkg.basePrice * (1 - discountRateFor(pkg, referralDiscountActive)));

// 15000 → "15.000 TL"
export const formatTL = (amount: number) => `${amount.toLocaleString("tr-TR")} TL`;
