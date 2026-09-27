import { createHmac, timingSafeEqual } from "node:crypto";

// PayTR iFrame API. Kaynak: dev.paytr.com › iFrame API 1. ve 2. Adım.
// Mağaza bilgileri yalnızca sunucu ortam değişkenlerinden okunur; veritabanına ve admin paneline yazılmaz.

const TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";
export const PAYTR_IFRAME_BASE = "https://www.paytr.com/odeme/guvenli/";

export interface PaytrConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
  baseUrl: string;
  noInstallment: boolean;
  maxInstallment: number;
}

export function paytrConfig(): PaytrConfig | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID?.trim() ?? "";
  const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim() ?? "";
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim() ?? "";
  const baseUrl = (process.env.APP_BASE_URL?.trim() ?? "").replace(/\/+$/, "");
  if (!/^\d{1,20}$/.test(merchantId) || !merchantKey || !merchantSalt || !/^https:\/\//.test(baseUrl)) return null;
  const maxInstallment = Number(process.env.PAYTR_MAX_INSTALLMENT ?? "0");
  return {
    merchantId,
    merchantKey,
    merchantSalt,
    // Açıkça "0" yazılmadıkça test modunda kalır; yanlışlıkla canlı çekim yapılmaz.
    testMode: process.env.PAYTR_TEST_MODE !== "0",
    baseUrl,
    noInstallment: process.env.PAYTR_NO_INSTALLMENT !== "0",
    maxInstallment: Number.isInteger(maxInstallment) && maxInstallment >= 0 && maxInstallment <= 12 ? maxInstallment : 0,
  };
}

const hmacBase64 = (key: string, data: string) => createHmac("sha256", key).update(data, "utf8").digest("base64");

// E-posta Türkçe karakter içermemeli, en fazla 100 karakter (PayTR kısıtı).
const asciiEmail = (email: string) => (/^[\x21-\x7e]{3,100}$/.test(email) ? email : "odeme@coreandfit.com.tr");

export interface TokenRequest {
  merchantOid: string;
  userIp: string;
  email: string;
  amountTl: number;
  basketItemName: string;
  userName: string;
  userPhone: string;
  userAddress: string;
}

export async function requestIframeToken(config: PaytrConfig, req: TokenRequest): Promise<string> {
  if (!/^[A-Za-z0-9]{1,64}$/.test(req.merchantOid)) throw new Error("merchant_oid alfanumerik olmalı");
  if (!Number.isInteger(req.amountTl) || req.amountTl <= 0) throw new Error("Geçersiz tutar");

  const paymentAmount = String(req.amountTl * 100);
  const basket = Buffer.from(JSON.stringify([[req.basketItemName.slice(0, 100), req.amountTl.toFixed(2), 1]]), "utf8").toString("base64");
  const noInstallment = config.noInstallment ? "1" : "0";
  const maxInstallment = String(config.maxInstallment);
  const currency = "TL";
  const testMode = config.testMode ? "1" : "0";
  const email = asciiEmail(req.email);

  const hashStr =
    config.merchantId + req.userIp + req.merchantOid + email + paymentAmount + basket + noInstallment + maxInstallment + currency + testMode;
  const paytrToken = hmacBase64(config.merchantKey, hashStr + config.merchantSalt);

  const resultUrl = (state: "basarili" | "basarisiz") => `${config.baseUrl}/portal/odeme?durum=${state}`;
  const body = new URLSearchParams({
    merchant_id: config.merchantId,
    user_ip: req.userIp,
    merchant_oid: req.merchantOid,
    email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: basket,
    debug_on: config.testMode ? "1" : "0",
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: req.userName.slice(0, 60),
    user_address: (req.userAddress || "Türkiye").slice(0, 400),
    user_phone: (req.userPhone || "0000000000").slice(0, 20),
    merchant_ok_url: resultUrl("basarili"),
    merchant_fail_url: resultUrl("basarisiz"),
    timeout_limit: "30",
    currency,
    test_mode: testMode,
    lang: "tr",
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { status?: string; token?: string; reason?: string } | null;
  if (!res.ok || data?.status !== "success" || !data.token || !/^[A-Za-z0-9]{10,200}$/.test(data.token)) {
    throw new Error(`PayTR token alınamadı: ${data?.reason ?? `HTTP ${res.status}`}`.slice(0, 300));
  }
  return data.token;
}

export interface CallbackFields {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
  paymentAmount: string;
  currency: string;
  testMode: string;
  failedReasonCode: string;
  failedReasonMsg: string;
}

// Bildirim imzası: base64(HMAC-SHA256(merchant_oid + merchant_salt + status + total_amount, merchant_key))
export function verifyCallbackHash(config: PaytrConfig, fields: CallbackFields): boolean {
  const expected = Buffer.from(hmacBase64(config.merchantKey, fields.merchantOid + config.merchantSalt + fields.status + fields.totalAmount));
  const received = Buffer.from(fields.hash);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function readCallbackFields(form: FormData): CallbackFields {
  const get = (key: string, max = 200) => {
    const value = form.get(key);
    return typeof value === "string" ? value.slice(0, max) : "";
  };
  return {
    merchantOid: get("merchant_oid", 64),
    status: get("status", 20),
    totalAmount: get("total_amount", 20),
    hash: get("hash", 100),
    paymentAmount: get("payment_amount", 20),
    currency: get("currency", 5),
    testMode: get("test_mode", 2),
    failedReasonCode: get("failed_reason_code", 10),
    failedReasonMsg: get("failed_reason_msg", 300),
  };
}

export const maskMerchantId = (id: string) => (id.length <= 4 ? "****" : `${id.slice(0, 2)}${"*".repeat(id.length - 4)}${id.slice(-2)}`);
