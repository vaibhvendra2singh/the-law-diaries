// app/api/posts/id/[id]/route.ts
// PUT    /api/posts/id/[id]  → update post (admin only)
// DELETE /api/posts/id/[id]  → delete post (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ── PUT: update a post ───────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, authorName, authorBio, tags, status, date } = body;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title      !== undefined && { title:      title.trim() }),
        ...(slug       !== undefined && { slug:       slug.trim().toLowerCase() }),
        ...(excerpt    !== undefined && { excerpt:    excerpt.trim() }),
        ...(content    !== undefined && { content }),
        ...(authorName !== undefined && { authorName: authorName.trim() }),
        ...(authorBio  !== undefined && { authorBio:  authorBio.trim() }),
        ...(tags       !== undefined && { tags: JSON.stringify(tags) }),
        ...(status     !== undefined && { status }),
        ...(date       !== undefined && { date: new Date(date) }),
      },
    });

    try {
      revalidatePath('/admin');
      revalidatePath('/');
      revalidatePath('/archive');
      revalidatePath('/rss.xml');
      if (updated?.slug) {
        revalidatePath(`/posts/${updated.slug}`);
      }
    } catch (e) {
      console.warn('Revalidation error:', e);
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// ── DELETE: delete a post ────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    const deleted = await prisma.post.delete({ where: { id } });

    try {
      revalidatePath('/admin');
      revalidatePath('/');
      revalidatePath('/archive');
      revalidatePath('/rss.xml');
      if (deleted?.slug) {
        revalidatePath(`/posts/${deleted.slug}`);
      }
    } catch (e) {
      console.warn('Revalidation error:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
