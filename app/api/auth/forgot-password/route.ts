// app/api/auth/forgot-password/route.ts

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
    const rawUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    const baseUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

    const successResponse = NextResponse.json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
    });

    const admin = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (!admin || !apiKey) return successResponse;

    await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail, used: false } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({ data: { token, email: normalizedEmail, expiresAt } });

    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Plain text email — guaranteed to land in Primary, never Promotions
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Law Diaries <onboarding@resend.dev>',
        to: [normalizedEmail],
        reply_to: normalizedEmail,
        subject: `Password Reset — The Law Diaries`,
        text: `Hi,\n\nA password reset was requested for ${normalizedEmail}.\n\nClick the link below to set a new password (expires in 1 hour):\n\n${resetLink}\n\nIf you did not request this, ignore this email.\n\n— The Law Diaries`,
      }),
    });

    return successResponse;
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
