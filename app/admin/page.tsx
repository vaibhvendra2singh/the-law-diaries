// app/admin/page.tsx — Admin management dashboard with Delete Post control

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeletePostButton from '@/components/DeletePostButton';

export const dynamic = 'force-dynamic';

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' },
  });

  const totalCount     = posts.length;
  const publishedCount = posts.filter((p: { status: string }) => p.status === 'published').length;
  const draftCount     = posts.filter((p: { status: string }) => p.status === 'draft').length;

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
            Manage, edit, publish, and delete your posts.
          </p>
        </div>

        <Link
          href="/admin/new"
          className="bg-black text-white px-6 py-2.5 rounded-full font-serif text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
        >
          + Create New Post
        </Link>
      </div>

      {/* ── Stat Overview Cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white text-center shadow-sm">
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{totalCount}</p>
          <p className="font-serif text-xs text-neutral-500 uppercase tracking-widest mt-1">Total Posts</p>
        </div>
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white text-center shadow-sm">
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{publishedCount}</p>
          <p className="font-serif text-xs text-neutral-500 uppercase tracking-widest mt-1">Published</p>
        </div>
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white text-center shadow-sm">
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{draftCount}</p>
          <p className="font-serif text-xs text-neutral-500 uppercase tracking-widest mt-1">Drafts</p>
        </div>
      </div>

      {/* ── Posts List Table ── */}
      {posts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-300 rounded-2xl bg-white">
          <p className="font-serif text-base text-neutral-600 mb-4">
            No posts found in database.
          </p>
          <Link
            href="/admin/new"
            className="inline-block bg-black text-white px-6 py-2.5 rounded-full font-serif text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {posts.map((post: { id: number; title: string; slug: string; excerpt?: string | null; status: string; date: Date }) => (
              <div key={post.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Title & Metadata */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-sans text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold ${
                        post.status === 'published'
                          ? 'bg-black text-white'
                          : 'border border-neutral-400 text-neutral-600'
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="font-serif text-xs text-neutral-400">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] leading-snug">
                    <Link href={`/posts/${post.slug}`} className="hover:text-neutral-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="font-serif text-sm text-neutral-600 line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Actions: Edit, View, Delete */}
                <div className="flex items-center gap-3 shrink-0 font-serif text-xs">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="border border-black text-black px-4 py-1.5 rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/posts/${post.slug}`}
                    target="_blank"
                    className="text-neutral-500 hover:text-black underline decoration-neutral-300 underline-offset-4"
                  >
                    View ↗
                  </Link>

                  <DeletePostButton postId={post.id} postTitle={post.title} />
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
