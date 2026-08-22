// app/api/auth/forgot-password/route.ts
// Generates a secure reset token, stores in DB, emails a plain reset link.

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

    // Send plain-style email (same format as contact form — lands in Primary)
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
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1A1A1A;">
            <h2 style="border-bottom: 2px solid #1A1A1A; padding-bottom: 10px;">Password Reset Request</h2>
            <p>A password reset was requested for <strong>${normalizedEmail}</strong>.</p>
            <p>Click the link below to set a new password. This link expires in <strong>1 hour</strong>.</p>
            <p><a href="${resetLink}" style="color: #1A1A1A;">${resetLink}</a></p>
            <p style="color: #666; font-size: 13px; margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
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
