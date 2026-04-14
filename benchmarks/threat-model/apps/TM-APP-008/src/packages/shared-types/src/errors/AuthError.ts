import { AppError } from './AppError';

/**
 * Authentication and authorization error.
 * Pre-defined error types for common auth failure scenarios.
 */
export class AuthError extends AppError {
  constructor(
    type: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TOKEN_EXPIRED' | 'INVALID_CREDENTIALS' | 'INVALID_TOKEN',
    message?: string
  ) {
    const defaults: Record<string, { status: number; msg: string }> = {
      UNAUTHORIZED: { status: 401, msg: 'Authentication required' },
      FORBIDDEN: { status: 403, msg: 'Insufficient permissions' },
      TOKEN_EXPIRED: { status: 401, msg: 'Token has expired' },
      INVALID_CREDENTIALS: { status: 401, msg: 'Invalid email or password' },
      INVALID_TOKEN: { status: 401, msg: 'Invalid authentication token' },
    };

    const def = defaults[type];
    super(message || def.msg, def.status, type, true);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
