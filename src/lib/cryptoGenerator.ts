import { randomBytes } from "crypto";

export function generateCryptoKey(): string {
    const longKey = 32;
    const newKey = randomBytes(longKey).toString("hex")
    return newKey;
}

