import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from './auth';

const SENSITIVE_FIELDS = ['password', 'passwordHash', 'token', 'refreshToken', 'secret', 'apiKey'];

/**
 * Request logging middleware using winston.
 * Logs method, path, status code, response time, request ID, user ID (if authenticated).
 * Filters sensitive fields from logged request bodies.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const authReq = req as AuthenticatedRequest;

    const logData: Record<string, unknown> = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.headers['x-request-id'],
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    if (authReq.user) {
      logData.userId = authReq.user.id;
    }

    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      for (const field of SENSITIVE_FIELDS) {
        if (sanitizedBody[field]) {
          sanitizedBody[field] = '[REDACTED]';
        }
      }
      logData.body = sanitizedBody;
    }

    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
}
