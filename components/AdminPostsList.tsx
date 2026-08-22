'use client';

// components/AdminPostsList.tsx — Real-time interactive admin post management with instant optimistic UI

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface AdminPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  status: string;
  date: Date | string;
}

interface Props {
  initialPosts: AdminPost[];
}

function formatDate(dateInput: Date | string): string {
  return new Date(dateInput).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminPostsList({ initialPosts }: Props) {
  const [posts, setPosts] = useState<AdminPost[]>(initialPosts);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  const filteredPosts = posts.filter((post) => {
    if (filter !== 'all' && post.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q))
      );
    }
    return true;
  });

  async function handleDelete(post: AdminPost) {
    const confirmMessage = `Are you sure you want to delete "${post.title}"? This cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    // Optimistically remove from state instantly
    const previousPosts = posts;
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    setDeletingId(post.id);

    try {
      const res = await fetch(`/api/posts/id/${post.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      router.refresh();
    } catch (err) {
      alert('Could not delete post. Restoring article list.');
      setPosts(previousPosts);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8 font-serif">
      {/* ── Stat Overview Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`border p-5 rounded-2xl bg-white text-center transition-all ${
            filter === 'all'
              ? 'border-black ring-2 ring-black shadow-md'
              : 'border-neutral-200 hover:border-neutral-400 shadow-sm'
          }`}
        >
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{totalCount}</p>
          <p className="font-serif text-xs text-neutral-500 uppercase tracking-widest mt-1">Total Posts</p>
        </button>

        <button
          onClick={() => setFilter('published')}
          className={`border p-5 rounded-2xl bg-white text-center transition-all ${
            filter === 'published'
              ? 'border-black ring-2 ring-black shadow-md'
              : 'border-neutral-200 hover:border-neutral-400 shadow-sm'
          }`}
        >
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{publishedCount}</p>
          <p className="font-serif text-xs text-neutral-500 uppercase tracking-widest mt-1">Published</p>
        </button>

        <button
          onClick={() => setFilter('draft')}
          className={`border p-5 rounded-2xl bg-white text-center transition-all ${
            filter === 'draft'
              ? 'border-black ring-2 ring-black shadow-md'
              : 'border-neutral-200 hover:border-neutral-400 shadow-sm'
          }`}
        >
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{draftCount}</p>
          <p className="font-serif text-xs text-neutral-500 uppercase tracking-widest mt-1">Drafts</p>
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title..."
          className="w-full sm:w-72 border border-neutral-300 rounded-full px-4 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-black bg-white"
        />

        <div className="flex items-center gap-2 self-end sm:self-auto font-sans text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              filter === 'all'
                ? 'bg-black text-white border-black'
                : 'border-neutral-200 text-neutral-600 hover:border-black'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              filter === 'published'
                ? 'bg-black text-white border-black'
                : 'border-neutral-200 text-neutral-600 hover:border-black'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              filter === 'draft'
                ? 'bg-black text-white border-black'
                : 'border-neutral-200 text-neutral-600 hover:border-black'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>
      </div>

      {/* ── Posts List Table ── */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-300 rounded-2xl bg-white">
          <p className="font-serif text-base text-neutral-600 mb-4">
            {search ? 'No matching articles found.' : 'No articles in this view.'}
          </p>
          <Link
            href="/admin/new"
            className="inline-block bg-black text-white px-6 py-2.5 rounded-full font-serif text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            + Create New Post
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity ${
                deletingId === post.id ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
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

                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post.id}
                  className="border border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full font-serif text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {deletingId === post.id ? 'Deleting…' : 'Delete ✕'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
