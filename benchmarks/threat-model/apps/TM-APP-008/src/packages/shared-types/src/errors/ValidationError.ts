import { AppError } from './AppError';
import { ZodError, ZodIssue } from 'zod';

/**
 * Validation error with field-level error details.
 * Normalizes Zod errors into a consistent format.
 */
export class ValidationError extends AppError {
  public readonly fieldErrors: Array<{ field: string; message: string }>;

  constructor(zodError: ZodError);
  constructor(message: string, fieldErrors: Array<{ field: string; message: string }>);
  constructor(
    messageOrError: string | ZodError,
    fieldErrors?: Array<{ field: string; message: string }>
  ) {
    if (messageOrError instanceof ZodError) {
      const normalizedErrors = messageOrError.errors.map((issue: ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      super('Validation failed', 400, 'VALIDATION_ERROR', true, { errors: normalizedErrors });
      this.fieldErrors = normalizedErrors;
    } else {
      super(messageOrError, 400, 'VALIDATION_ERROR', true, { errors: fieldErrors });
      this.fieldErrors = fieldErrors || [];
    }
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
