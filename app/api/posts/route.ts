// app/api/posts/route.ts
// GET  /api/posts     → list published posts (public)
// POST /api/posts     → create new post (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ── GET: list published posts (public) ───────────────────────────────────────
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { date: 'desc' },
      select: {
        id: true, title: true, slug: true,
        excerpt: true, tags: true, date: true,
        authorName: true, authorBio: true,
      },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// ── POST: create a new post (admin only) ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, authorName, authorBio, tags, status, date } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'title and slug are required' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title:      title.trim(),
        slug:       slug.trim().toLowerCase().replace(/\s+/g, '-'),
        excerpt:    excerpt?.trim() ?? '',
        content:    content ?? '',
        authorName: authorName?.trim() || 'Samir Kapri',
        authorBio:  authorBio?.trim() || '',
        tags:       JSON.stringify(tags ?? []),
        status:     status ?? 'draft',
        date:       date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
