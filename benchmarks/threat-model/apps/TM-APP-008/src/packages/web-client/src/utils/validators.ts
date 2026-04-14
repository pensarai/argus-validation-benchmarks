import { LoginSchema, RegisterSchema } from '@app/shared-types';
import { slug as slugRule } from '@app/shared-types';

/**
 * Client-side validation helpers wrapping shared-types schemas.
 */

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const result = LoginSchema.shape.email.safeParse(email);
  return result.success ? { valid: true } : { valid: false, error: result.error.errors[0].message };
}

export function validatePassword(password: string): { valid: boolean; strength: string; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/\d/.test(password)) errors.push('One digit');

  const strength = errors.length === 0 ? 'strong' : errors.length <= 1 ? 'good' : errors.length <= 2 ? 'fair' : 'weak';
  return { valid: errors.length === 0, strength, errors };
}

export function validateSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
