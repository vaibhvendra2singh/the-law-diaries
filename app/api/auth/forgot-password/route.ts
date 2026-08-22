// app/api/auth/forgot-password/route.ts
// Handles password reset requests for single-admin blog

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'lawdiaries01@gmail.com';
    const apiKey = process.env.RESEND_API_KEY;

    // Send email notification via Resend if email matches admin
    if (email.trim().toLowerCase() === adminEmail.toLowerCase() && apiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'The Law Diaries <onboarding@resend.dev>',
            to: [adminEmail],
            subject: 'Admin Password Reset Request',
            html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1A1A1A;">
                <h2 style="border-bottom: 2px solid #1A1A1A; padding-bottom: 10px;">Password Reset Request</h2>
                <p>A password reset was requested for <strong>${adminEmail}</strong>.</p>
                <p>To reset your admin password:</p>
                <ol style="line-height: 1.8;">
                  <li>Open your terminal in the project directory.</li>
                  <li>Run the setup command: <code>npm run setup</code></li>
                  <li>Enter your new secure password when prompted.</li>
                </ol>
                <p style="color: #666; font-size: 13px; margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error('Failed to send reset email:', err);
      }
    }

    // Always return success message for security (prevents user enumeration)
    return NextResponse.json({
      success: true,
      message: 'If the email matches the administrator account, password reset instructions have been sent.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
