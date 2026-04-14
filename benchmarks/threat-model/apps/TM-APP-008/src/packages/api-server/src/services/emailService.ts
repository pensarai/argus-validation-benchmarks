import { config } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Email service stub.
 * In production, this would use an SMTP transport (nodemailer + SendGrid/SES).
 * In development, emails are logged to console.
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  async send(options: EmailOptions): Promise<void> {
    if (config.nodeEnv === 'development') {
      logger.info('Email sent (dev mode)', {
        to: options.to,
        subject: options.subject,
        bodyPreview: options.html.slice(0, 200),
      });
      return;
    }

    // Production: send via SMTP transport
    logger.info('Email queued', { to: options.to, subject: options.subject });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${config.corsOrigin.split(',')[0]}/reset-password?token=${resetToken}`;
    await this.send({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your account.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async sendInviteEmail(email: string, orgName: string, inviteToken: string): Promise<void> {
    const inviteUrl = `${config.corsOrigin.split(',')[0]}/invite?token=${inviteToken}`;
    await this.send({
      to: email,
      subject: `You've been invited to join ${orgName}`,
      html: `
        <h2>Organization Invite</h2>
        <p>You've been invited to join <strong>${orgName}</strong> on ProjectHub.</p>
        <p><a href="${inviteUrl}">Accept Invite</a></p>
        <p>This invite expires in 7 days.</p>
      `,
    });
  }

  async sendNotificationDigest(email: string, notifications: Array<{ title: string; message: string }>): Promise<void> {
    const notificationHtml = notifications
      .map((n) => `<li><strong>${n.title}</strong>: ${n.message}</li>`)
      .join('');
    await this.send({
      to: email,
      subject: 'Your ProjectHub Digest',
      html: `
        <h2>Daily Digest</h2>
        <p>Here's what happened since your last visit:</p>
        <ul>${notificationHtml}</ul>
      `,
    });
  }
}

export const emailService = new EmailService();
