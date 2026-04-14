import { z } from 'zod';

/**
 * Reusable Zod refinements with descriptive error messages.
 */

/**
 * Ensures a string does not contain consecutive spaces.
 */
export const noConsecutiveSpaces = z.string().refine(
  (val) => !/\s{2,}/.test(val),
  { message: 'Must not contain consecutive spaces' }
);

/**
 * Ensures a string has no leading or trailing whitespace.
 */
export const noLeadingTrailingWhitespace = z.string().refine(
  (val) => val === val.trim(),
  { message: 'Must not have leading or trailing whitespace' }
);

/**
 * Validates that a date range is valid (start < end, max span configurable).
 */
export function validDateRange(maxDays: number = 365) {
  return z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        if (startDate >= endDate) return false;
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= maxDays;
      },
      { message: `Date range must be valid and span at most ${maxDays} days` }
    );
}

/**
 * Validates a URL-safe slug format.
 */
export const validSlug = z.string().refine(
  (val) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
  { message: 'Must be a valid slug (lowercase letters, numbers, hyphens only)' }
);

/**
 * Strong password refinement with specific feedback.
 */
export const strongPassword = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Password must be at least 8 characters' });
  }
  if (!/[a-z]/.test(val)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Password must contain a lowercase letter' });
  }
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Password must contain an uppercase letter' });
  }
  if (!/\d/.test(val)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Password must contain a digit' });
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Password should contain a special character' });
  }
});

/**
 * Validates that a value is not an empty string after trimming.
 */
export const nonEmptyTrimmed = z.string().refine(
  (val) => val.trim().length > 0,
  { message: 'Must not be empty or whitespace-only' }
);
