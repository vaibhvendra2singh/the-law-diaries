// app/api/posts/[slug]/route.ts
// GET /api/posts/[slug]  → single post by slug (public)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug:   params.slug,
        status: 'published',
      },
    });

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
