import crypto from 'crypto';

/**
 * Cryptographic utilities for token generation and verification.
 */

/**
 * Generate a random token (32 bytes as hex string).
 */
export function generateToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash a token with SHA-256 for secure storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a prefixed API key for identification.
 * Format: pk_live_{random_string} or pk_test_{random_string}
 */
export function generateApiKey(isProduction: boolean = true): string {
  const prefix = isProduction ? 'pk_live_' : 'pk_test_';
  const randomPart = crypto.randomBytes(24).toString('base64url');
  return `${prefix}${randomPart}`;
}

/**
 * Verify an API key by comparing its hash against stored hash.
 */
export function verifyApiKey(providedKey: string, storedHash: string): boolean {
  const providedHash = hashToken(providedKey);
  return crypto.timingSafeEqual(
    Buffer.from(providedHash, 'hex'),
    Buffer.from(storedHash, 'hex')
  );
}
