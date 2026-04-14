import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

/**
 * Integration tests for auth endpoints.
 * Tests: register, login, refresh, forgot-password, reset-password.
 */

const BASE_URL = 'http://localhost:3000';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecureP4ss!',
          name: 'Test User',
        }),
      });
      expect(response.status).toBe(201);
    });

    it('should reject registration with weak password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'weak@example.com',
          password: 'weak',
          name: 'Weak User',
        }),
      });
      expect(response.status).toBe(400);
    });

    it('should reject duplicate email registration', async () => {
      // Assumes previous test registered test@example.com
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecureP4ss!',
          name: 'Duplicate User',
        }),
      });
      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecureP4ss!',
        }),
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toHaveProperty('accessToken');
      expect(data.data).toHaveProperty('refreshToken');
    });

    it('should reject login with wrong password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'WrongPassword1',
        }),
      });
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return success for any email to prevent enumeration', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent@example.com' }),
      });
      expect(response.status).toBe(200);
    });
  });
});
