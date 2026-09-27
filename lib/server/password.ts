import { scrypt, scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

export const PASSWORD_MIN = 8;
// Çok uzun parolalar scrypt maliyetini büyütür; üst sınır hizmet dışı bırakma denemelerini engeller.
export const PASSWORD_MAX = 128;

const KEY_LENGTH = 64;

const scryptAsync = (password: string, salt: Buffer, length: number) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, length, (error, key) => (error ? reject(error) : resolve(key)))
  );

// Biçim: scrypt$<salt hex>$<hash hex>
const format = (salt: Buffer, hash: Buffer) => `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;

// Yalnızca uygulama açılışındaki tohumlama için (istek sırasında kullanılmaz).
export function hashPasswordSync(password: string): string {
  const salt = randomBytes(16);
  return format(salt, scryptSync(password, salt, KEY_LENGTH));
}

// scrypt iş parçacığı havuzunda çalışır, olay döngüsünü kilitlemez.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  return format(salt, await scryptAsync(password, salt, KEY_LENGTH));
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (password.length > PASSWORD_MAX) return false;
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Kayıtlı olmayan e-postalarda da aynı süre harcanır; yanıt süresinden hesap varlığı anlaşılamaz.
let dummyHash: string | null = null;
export async function burnPasswordTime(password: string) {
  dummyHash ??= hashPasswordSync(randomBytes(16).toString("hex"));
  await verifyPassword(password.slice(0, PASSWORD_MAX), dummyHash);
}
