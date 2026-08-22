'use client';

// components/ArchiveList.tsx
// Archive page matching exact home page pill badge, search bar, and serif typography

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ArchivePost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
}

interface Props {
  posts: ArchivePost[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArchiveList({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  // Group filtered posts by Year -> Month
  const years = useMemo(() => {
    const grouped: Record<string, Record<string, ArchivePost[]>> = {};
    for (const post of filteredPosts) {
      const d = new Date(post.date);
      const year = d.getFullYear().toString();
      const month = d.toLocaleString('en-US', { month: 'long' });
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      grouped[year][month].push(post);
    }
    return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredPosts]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">

      {/* ── Top Center Pill Badge & Search Bar (Exact Home Page Match) ── */}
      <div className="flex flex-col items-center text-center mb-16 space-y-6">
        
        {/* Center Pill Badge */}
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Archive
        </div>

        {/* Center Search Bar */}
        <div className="flex items-center w-full max-w-md gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full border border-neutral-300 rounded-full px-5 py-2.5 font-serif text-sm text-[#1A1A1A] focus:outline-none focus:border-black bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-2.5 text-neutral-400 hover:text-black font-sans text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <button
            aria-label="Search"
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shrink-0 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

      </div>

      {/* ── Archive Timeline Stream ── */}
      {years.length === 0 ? (
        <div className="py-20 text-center border-t border-b border-neutral-200">
          <p className="font-serif text-base text-neutral-500 italic">
            No archive entries match &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {years.map(([year, months]) => (
            <section key={year} className="space-y-8">
              <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] border-b-2 border-black pb-2">
                {year}
              </h2>

              <div className="space-y-10 pl-2">
                {Object.entries(months).map(([month, monthPosts]) => (
                  <div key={month} className="space-y-6">
                    <h3 className="font-serif text-lg font-bold text-neutral-700 uppercase tracking-wide">
                      {month}
                    </h3>
                    <div className="space-y-10 divide-y divide-neutral-100">
                      {monthPosts.map((post, idx) => (
                        <article key={post.slug} className={`space-y-2 ${idx > 0 ? 'pt-8' : ''}`}>
                          <h4 className="font-serif text-2xl font-bold text-[#1A1A1A] hover:text-neutral-600 transition-colors leading-snug">
                            <Link href={`/posts/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h4>
                          <p className="font-serif text-xs text-neutral-500">
                            {formatDate(post.date)}
                          </p>
                          {post.excerpt && (
                            <p className="font-serif text-base text-[#333333] leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="pt-2">
                            <Link
                              href={`/posts/${post.slug}`}
                              className="font-serif text-sm font-semibold text-black underline decoration-black/40 underline-offset-4 hover:decoration-black"
                            >
                              Read more...
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
