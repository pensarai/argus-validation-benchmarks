import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '@app/shared-types';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

class AuthService {
  /**
   * Register a new user. Hashes password with bcryptjs (12 rounds).
   */
  async register(data: { email: string; password: string; name: string; displayName?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Email already registered', 409, 'DUPLICATE_EMAIL');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        displayName: data.displayName || null,
        passwordHash,
        role: 'user',
        metadata: {},
        organizationIds: [],
      },
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  /**
   * Authenticate user with email and password. Returns user + JWT tokens.
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate refresh tokens. Validates the old token and issues new pair.
   */
  async refreshTokens(oldRefreshToken: string) {
    const session = await prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    await prisma.session.delete({ where: { id: session.id } });

    const accessToken = this.generateAccessToken(session.user);
    const refreshToken = this.generateRefreshToken();

    await prisma.session.create({
      data: {
        userId: session.user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Initiate password reset by generating a reset token and queuing an email.
   */
  async initiatePasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.info('Password reset requested for non-existent email', { email });
      return; // Don't reveal whether the email exists
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    logger.info('Password reset token generated', { userId: user.id, token: resetToken });
    // In production, this would send an email with the reset link
  }

  /**
   * Reset password using a valid reset token.
   */
  async resetPassword(token: string, newPassword: string) {
    // In production, this would validate the token against stored reset tokens
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    logger.info('Password reset completed', { token: token.slice(0, 8) + '...' });
  }

  private generateAccessToken(user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationIds: string[];
  }): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationIds: user.organizationIds,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }
}

export const authService = new AuthService();
