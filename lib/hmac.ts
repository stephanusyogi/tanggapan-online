import { createHmac } from "node:crypto";

export function normalizeIdentifier(value: string): string {
  return value.trim().replace(/\D/g, "");
}

export function identifierToken(value: string, secret?: string): string {
  const normalized = normalizeIdentifier(value);
  if (!normalized) {
    throw new Error("Identifier must contain digits");
  }
  const hmacKey = secret || process.env.HMAC_SECRET || "";
  if (!hmacKey) {
    throw new Error("HMAC_SECRET environment variable is missing");
  }
  return createHmac("sha256", hmacKey).update(normalized, "utf8").digest("hex");
}
