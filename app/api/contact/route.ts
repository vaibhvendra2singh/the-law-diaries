// app/api/contact/route.ts
// Handles contact form submissions with strict email validation & Resend email delivery

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, honeypot } = body;

    // 1. Honeypot check for spam bots
    if (honeypot && honeypot.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    // 2. Input validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email?.trim() || '';
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address (e.g. name@example.com)' }, { status: 400 });
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.ADMIN_EMAIL || 'lawdiaries01@gmail.com';

    // 3. Email delivery via Resend REST API
    if (apiKey) {
      try {
        const payload: Record<string, any> = {
          from: 'The Law Diaries <onboarding@resend.dev>',
          to: [recipientEmail],
          reply_to: cleanEmail,
          subject: `New Inquiry from ${name}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1A1A1A;">
              <h2 style="border-bottom: 2px solid #1A1A1A; padding-bottom: 10px;">New Inquiry — The Law Diaries</h2>
              <p><strong>From:</strong> ${name} (&lt;${cleanEmail}&gt;)</p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left: 2px solid #1A1A1A; padding-left: 15px; margin: 20px 0; color: #333; font-style: italic;">
                ${message.replace(/\n/g, '<br/>')}
              </blockquote>
            </div>
          `,
        };

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const resData = await response.json();
        if (!response.ok) {
          console.error('[Resend API Error details]:', resData);
        } else {
          console.log(`[Resend Success]: Email sent to ${recipientEmail}, ID:`, resData.id);
        }
      } catch (emailErr) {
        console.error('[Resend HTTP Error]:', emailErr);
      }
    } else {
      console.log(`[Contact Form Submission] Received:`, { name, email: cleanEmail, message });
    }

    return NextResponse.json({ success: true, message: 'Thank you for reaching out. Your message has been submitted.' });
  } catch (err) {
    console.error('Contact form processing error:', err);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
