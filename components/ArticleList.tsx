'use client';

// components/ArticleList.tsx
// IndiaCorpLaw-style feed structure in strict Black & White theme

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface PostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  tags: string;
  date: string | Date;
}

interface Props {
  initialPosts: PostData[];
}

function formatDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArticleList({ initialPosts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // All category tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialPosts.forEach((post) => {
      try {
        const parsed = JSON.parse(post.tags || '[]');
        if (Array.isArray(parsed)) {
          parsed.forEach((t) => tagSet.add(t.trim()));
        }
      } catch {}
    });
    return ['ALL', ...Array.from(tagSet)];
  }, [initialPosts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Filter by tag
      if (selectedTag !== 'ALL') {
        try {
          const parsed = JSON.parse(post.tags || '[]');
          if (!Array.isArray(parsed) || !parsed.includes(selectedTag)) {
            return false;
          }
        } catch {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(q);
        return matchesTitle || matchesExcerpt;
      }

      return true;
    });
  }, [initialPosts, selectedTag, searchQuery]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-4">

      {/* ── Center Header Controls (Black & White Theme) ── */}
      <div className="flex flex-col items-center text-center mb-16 space-y-6">
        
        {/* Center Pill Badge: "Blog Posts" */}
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Blog Posts
        </div>

        {/* Center Search Bar with Black Search Icon Button */}
        <div className="flex items-center w-full max-w-md gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
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

        {/* Category filter tags */}
        {allTags.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-sans text-xs uppercase tracking-wider">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full border transition-colors ${
                  selectedTag === tag
                    ? 'border-black bg-black text-white font-semibold'
                    : 'border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* ── Main Article Feed ── */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center border-t border-b border-neutral-200">
          <p className="font-serif text-base text-neutral-500 italic">
            No articles found matching your search.
          </p>
        </div>
      ) : (
        <div className="space-y-16 divide-y divide-neutral-100">
          {filteredPosts.map((post, idx) => (
            <article key={post.slug} className={`space-y-3 ${idx > 0 ? 'pt-16' : ''}`}>
              
              {/* Headline */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-snug hover:text-neutral-600 transition-colors">
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {/* Date */}
              <p className="font-serif text-xs text-neutral-500">
                {formatDate(post.date)}
              </p>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="font-serif text-base text-[#333333] leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Read More Link */}
              <div className="pt-2">
                <Link
                  href={`/posts/${post.slug}`}
                  className="font-serif text-sm font-semibold text-black underline decoration-black/40 underline-offset-4 hover:decoration-black transition-all"
                >
                  Read more...
                </Link>
              </div>

            </article>
          ))}
        </div>
      )}

      {/* ── Browse Full Archive Button ── */}
      <div className="mt-20 pt-12 border-t border-neutral-200 text-center font-serif">
        <Link
          href="/archive"
          className="inline-block border border-black text-black px-6 py-2.5 rounded-full font-serif text-sm font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Browse Full Archive →
        </Link>
      </div>

    </div>
  );
}
