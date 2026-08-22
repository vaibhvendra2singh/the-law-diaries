// app/api/auth/forgot-password/route.ts
// Generates a secure reset token, stores in DB, emails a real clickable reset link.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const apiKey = process.env.RESEND_API_KEY;
    const baseUrl = process.env.NEXTAUTH_URL?.startsWith('http')
      ? process.env.NEXTAUTH_URL
      : `https://${process.env.NEXTAUTH_URL}`;

    // Always return success to prevent user enumeration
    const successResponse = NextResponse.json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
    });

    // Check if admin exists
    const admin = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin || !apiKey) return successResponse;

    // Delete any existing unused tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: normalizedEmail, used: false },
    });

    // Generate secure token valid for 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { token, email: normalizedEmail, expiresAt },
    });

    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Law Diaries <onboarding@resend.dev>',
        to: [normalizedEmail],
        subject: 'Reset Your Admin Password',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1A1A1A;">
            <h2 style="font-size: 22px; font-weight: bold; border-bottom: 2px solid #1A1A1A; padding-bottom: 12px; margin-bottom: 20px;">
              Password Reset Request
            </h2>
            <p style="font-size: 15px; line-height: 1.6;">
              We received a request to reset the password for <strong>${normalizedEmail}</strong>.
            </p>
            <p style="font-size: 15px; line-height: 1.6;">
              Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}"
                style="display: inline-block; background: #1A1A1A; color: #fff; text-decoration: none;
                       font-family: Georgia, serif; font-size: 14px; font-weight: bold; letter-spacing: 0.1em;
                       padding: 14px 32px; border-radius: 999px;">
                RESET PASSWORD
              </a>
            </div>
            <p style="font-size: 13px; color: #666; line-height: 1.6;">
              If the button does not work, copy and paste this link:<br/>
              <a href="${resetLink}" style="color: #1A1A1A; word-break: break-all;">${resetLink}</a>
            </p>
            <p style="font-size: 13px; color: #999; margin-top: 24px;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
      }),
    });

    return successResponse;
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
