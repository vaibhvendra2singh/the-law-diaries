// app/api/posts/[slug]/comments/route.ts
// GET  /api/posts/[slug]/comments  → list comments for a post (public)
// POST /api/posts/[slug]/comments  → submit a comment (public, with honeypot)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ── GET: list comments ────────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findFirst({
      where: { slug: params.slug, status: 'published' },
      select: { id: true },
    });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, body: true, createdAt: true },
      // email is intentionally excluded from the response
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// ── POST: submit a comment ───────────────────────────────────────────────────
// Rate limiting: basic in-memory store (resets on server restart).
// For production consider Redis or a DB-based rate limiter.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;         // max 5 comments
const RATE_WINDOW = 60 * 1000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Basic IP-based rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, email, comment, honeypot } = body;

    // Honeypot check — bots fill hidden fields, humans leave them blank
    if (honeypot && honeypot.trim() !== '') {
      // Silently accept but don't save (don't reveal the check to bots)
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!comment?.trim()) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }
    if (comment.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment must be under 2000 characters' }, { status: 400 });
    }

    const post = await prisma.post.findFirst({
      where: { slug: params.slug, status: 'published' },
      select: { id: true },
    });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const newComment = await prisma.comment.create({
      data: {
        postId:   post.id,
        name:     name.trim().slice(0, 100),
        email:    email?.trim().slice(0, 200) ?? '',
        body:     comment.trim(),
        honeypot: honeypot ?? '',
      },
    });

    return NextResponse.json({
      id:        newComment.id,
      name:      newComment.name,
      body:      newComment.body,
      createdAt: newComment.createdAt,
    }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}
