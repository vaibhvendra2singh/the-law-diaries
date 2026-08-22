// app/api/admin/posts/route.ts
// GET /api/admin/posts → all posts incl. drafts (admin only)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, title: true, slug: true,
      status: true, date: true, updatedAt: true,
      excerpt: true, tags: true,
    },
  });
  return NextResponse.json(posts);
}
