import { PrismaClient } from '@prisma/client';

/**
 * Test helper functions for integration tests.
 */

const prisma = new PrismaClient();

export async function createTestUser(overrides: Partial<{
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}> = {}) {
  const defaults = {
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    passwordHash: '$2a$12$dummyhashvalue',
    role: 'user',
    organizationIds: [],
    metadata: {},
  };

  return prisma.user.create({
    data: { ...defaults, ...overrides },
  });
}

export async function getAuthToken(email: string, password: string): Promise<string> {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data.data?.accessToken || '';
}

export async function cleanupDatabase(): Promise<void> {
  const tables = ['comments', 'tasks', 'project_files', 'projects', 'webhooks', 'notifications', 'audit_logs', 'sessions', 'organizations', 'users'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
}

export { prisma };
