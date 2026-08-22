// app/posts/[slug]/page.tsx — Individual post page with high-performance revalidation

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import CitationBox from '@/components/CitationBox';
import RelatedArticles from '@/components/RelatedArticles';
import LegalDisclaimer from '@/components/LegalDisclaimer';

export const revalidate = 5;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, status: 'published' },
    select: { title: true, excerpt: true },
  });
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function parseTags(tagsStr: string): string[] {
  try {
    const parsed = JSON.parse(tagsStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, status: 'published' },
  });

  if (!post) {
    notFound();
    return null;
  }

  const tags = parseTags(post.tags);

  // Query previous and next articles
  const prevPost = await prisma.post.findFirst({
    where: { status: 'published', date: { lt: post.date } },
    orderBy: { date: 'desc' },
    select: { title: true, slug: true },
  });

  const nextPost = await prisma.post.findFirst({
    where: { status: 'published', date: { gt: post.date } },
    orderBy: { date: 'asc' },
    select: { title: true, slug: true },
  });

  // Query related articles based on tags or recent posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'published',
      slug: { not: post.slug },
    },
    orderBy: { date: 'desc' },
    take: 2,
    select: { id: true, title: true, slug: true, excerpt: true, date: true },
  });

  return (
    <>
      <ReadingProgressBar />
      <article className="max-w-3xl mx-auto px-6 py-8 font-serif">

        {/* ── Post Header ── */}
        <header className="mb-8 space-y-4 pb-6 border-b border-neutral-200">
          
          {/* Article Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
            {post.title}
          </h1>

          {/* Date, Author & Tags Line */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-serif">
            <span>By <strong className="text-black font-semibold">{post.authorName || 'Samir Kapri'}</strong></span>
            <span>·</span>
            <time dateTime={new Date(post.date).toISOString()}>{formatDate(post.date)}</time>
            {tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-black font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Author Bio Bracket Note (If provided) ── */}
        {post.authorBio && (
          <div className="mb-6 italic text-sm text-neutral-600 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            [{post.authorName || 'Samir Kapri'} {post.authorBio}]
          </div>
        )}

        {/* ── Article Body (Markdown) ── */}
        <div className="prose font-serif text-lg text-[#222222] leading-relaxed space-y-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* ── Tags at Bottom ── */}
        {tags.length > 0 && (
          <div className="mt-10 pt-4 border-t border-neutral-200 flex items-center gap-2 text-xs font-serif text-neutral-600">
            <span className="font-bold text-black">Categories:</span>
            {tags.map((t, idx) => (
              <span key={t}>
                <span className="text-black">{t}</span>
                {idx < tags.length - 1 ? '  ·  ' : ''}
              </span>
            ))}
          </div>
        )}

        {/* ── 1-Click How to Cite This Essay Box ── */}
        <CitationBox
          title={post.title}
          slug={post.slug}
          authorName={post.authorName || 'Samir Kapri'}
          date={post.date}
        />

        {/* ── Social Sharing & Copy Link ── */}
        <ShareButtons title={post.title} slug={post.slug} />

        {/* ── Previous / Next Article Navigation ── */}
        <div className="my-10 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-serif text-sm">
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="text-black font-semibold hover:underline underline-offset-4 line-clamp-1 max-w-sm"
            >
              ← {prevPost.title}
            </Link>
          ) : (
            <span className="text-neutral-400">← Oldest Post</span>
          )}

          {nextPost ? (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="text-black font-semibold hover:underline underline-offset-4 line-clamp-1 max-w-sm text-right"
            >
              {nextPost.title} →
            </Link>
          ) : (
            <span className="text-neutral-400 text-right">Latest Post →</span>
          )}
        </div>

        {/* ── Recommended Reading / Related Articles ── */}
        <RelatedArticles posts={relatedPosts} />

        {/* ── Legal Disclaimer Collapsible Box ── */}
        <LegalDisclaimer />

        {/* ── Back to Blog Feed ── */}
        <div className="my-12">
          <Link
            href="/"
            className="font-serif text-xs font-semibold text-black underline decoration-black/40 underline-offset-4 hover:decoration-black uppercase tracking-widest"
          >
            ← Back to All Posts
          </Link>
        </div>

        {/* ── Comments Section ── */}
        <CommentSection slug={post.slug} />

      </article>
    </>
  );
}
