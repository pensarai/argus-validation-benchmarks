import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { config } from './env';

let prisma: PrismaClient;

/**
 * Initializes the Prisma client with connection pooling.
 * Handles graceful shutdown by disconnecting the client.
 * Logs slow queries in development mode.
 */
export async function initDatabase(): Promise<void> {
  prisma = new PrismaClient({
    datasources: {
      db: { url: config.databaseUrl },
    },
    log: config.nodeEnv === 'development'
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ]
      : [{ emit: 'stdout', level: 'error' }],
  });

  // Log slow queries in development
  if (config.nodeEnv === 'development') {
    (prisma.$on as any)('query', (e: any) => {
      if (e.duration > 100) {
        logger.warn('Slow query detected', {
          query: e.query,
          duration: `${e.duration}ms`,
        });
      }
    });
  }

  await prisma.$connect();
  logger.info('Prisma client connected to database');

  process.on('beforeExit', async () => {
    await prisma.$disconnect();
    logger.info('Prisma client disconnected');
  });
}

export function getDatabase(): PrismaClient {
  if (!prisma) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return prisma;
}
