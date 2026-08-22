import { prisma } from '@/lib/prisma';
import ArchiveList from '@/components/ArchiveList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'All articles, organised by date with live search.',
};

export const revalidate = 5;

export default async function ArchivePage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { date: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, date: true },
    });
  } catch (err) {
    console.error('Database connection error in ArchivePage:', err);
  }

  const serializedPosts = posts.map((p) => ({
    ...p,
    excerpt: p.excerpt ?? '',
    date: new Date(p.date).toISOString(),
  }));

  return <ArchiveList posts={serializedPosts} />;
}
