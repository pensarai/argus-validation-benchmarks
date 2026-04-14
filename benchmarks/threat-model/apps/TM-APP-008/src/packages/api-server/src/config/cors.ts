import { CorsOptions } from 'cors';
import { config } from './env';

/**
 * CORS configuration with allowed origins from environment.
 */
export function getCorsOptions(): CorsOptions {
  const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim());

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400,
  };
}
