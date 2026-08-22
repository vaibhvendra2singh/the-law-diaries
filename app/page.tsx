// app/page.tsx — Home / Blog page
// High-performance static page with 5-second revalidation

import { prisma } from '@/lib/prisma';
import ArticleList from '@/components/ArticleList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Law Diaries',
  description: 'Long-form commentary on law, policy, and current affairs.',
};

export const revalidate = 5;

export default async function HomePage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        tags: true,
        date: true,
      },
    });
  } catch (err) {
    console.error('Database connection error in HomePage:', err);
  }

  const serializedPosts = posts.map((p: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string;
    date: Date;
  }) => ({
    ...p,
    date: new Date(p.date).toISOString(),
  }));

  return <ArticleList initialPosts={serializedPosts} />;
}
