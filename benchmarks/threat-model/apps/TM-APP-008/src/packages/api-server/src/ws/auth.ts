import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../utils/logger';

/**
 * WebSocket authentication helper.
 * Extracts and verifies JWT from connection query params or initial message.
 * Shared logic with HTTP auth middleware.
 */

interface WsAuthPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationIds: string[];
}

export function verifyWsToken(token: string): WsAuthPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as WsAuthPayload;
    return decoded;
  } catch (err) {
    logger.warn('WebSocket: invalid token', { error: (err as Error).message });
    return null;
  }
}

export function extractTokenFromUrl(url: string, host: string): string | null {
  try {
    const parsedUrl = new URL(url, `http://${host}`);
    return parsedUrl.searchParams.get('token');
  } catch {
    return null;
  }
}
