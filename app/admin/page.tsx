// app/admin/page.tsx — Admin management dashboard with real-time post management

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdminPostsList from '@/components/AdminPostsList';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' },
  });

  const serializedPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    status: p.status,
    date: p.date.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* ── Top Center Pill Badge ── */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Admin Dashboard
        </div>
      </div>

      {/* ── Header Title & Actions ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Articles & Drafts
          </h1>
          <p className="font-serif text-sm text-neutral-500 mt-1">
            Manage, edit, publish, and delete your posts with instant live updates.
          </p>
        </div>

        <Link
          href="/admin/new"
          className="bg-black text-white px-6 py-2.5 rounded-full font-serif text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
        >
          + Create New Post
        </Link>
      </div>

      {/* ── Interactive Live Post List ── */}
      <AdminPostsList initialPosts={serializedPosts} />
    </div>
  );
}
