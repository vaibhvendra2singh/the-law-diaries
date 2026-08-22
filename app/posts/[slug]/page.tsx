// app/posts/[slug]/page.tsx — Individual post page with high-performance revalidation

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { cache } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import CitationBox from '@/components/CitationBox';
import RelatedArticles from '@/components/RelatedArticles';
import LegalDisclaimer from '@/components/LegalDisclaimer';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'published' },
      select: { slug: true },
    });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

const getPost = cache(async (slug: string) => {
  try {
    return await prisma.post.findFirst({
      where: { slug, status: 'published' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
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
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
    return null;
  }

  const tags = parseTags(post.tags);

  // Query previous, next, and related articles in parallel for maximum speed
  const [prevPost, nextPost, relatedPosts] = await Promise.all([
    // Previous (older) post
    prisma.post.findFirst({
      where: {
        status: 'published',
        OR: [
          { date: { lt: post.date } },
          { date: post.date, id: { lt: post.id } },
        ],
      },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      select: { title: true, slug: true },
    }),
    // Next (newer) post
    prisma.post.findFirst({
      where: {
        status: 'published',
        OR: [
          { date: { gt: post.date } },
          { date: post.date, id: { gt: post.id } },
        ],
      },
      orderBy: [{ date: 'asc' }, { id: 'asc' }],
      select: { title: true, slug: true },
    }),
    prisma.post.findMany({
      where: {
        status: 'published',
        slug: { not: post.slug },
      },
      orderBy: { date: 'desc' },
      take: 2,
      select: { id: true, title: true, slug: true, excerpt: true, date: true },
    }),
  ]);

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
            <span>By <strong className="text-black font-semibold">{post.authorName || 'The Author'}</strong></span>
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
            [{post.authorName || 'The Author'} {post.authorBio}]
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
          authorName={post.authorName || 'The Author'}
          date={post.date}
        />

        {/* ── Social Sharing & Copy Link ── */}
        <ShareButtons title={post.title} slug={post.slug} />

        {/* ── Previous / Next Article Navigation ── */}
        <div className="my-12 pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 font-serif">
          {/* Previous Post / Back to Feed */}
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="group p-4 rounded-xl border border-neutral-200 hover:border-black transition-all flex flex-col justify-between space-y-1 bg-white hover:bg-neutral-50"
            >
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black">
                ← Previous Article
              </span>
              <span className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/"
              className="group p-4 rounded-xl border border-neutral-100 hover:border-black transition-all flex flex-col justify-between space-y-1 bg-neutral-50/50 hover:bg-white"
            >
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black">
                ← Home Feed
              </span>
              <span className="text-sm font-semibold text-neutral-600 line-clamp-1">
                You're reading the earliest post
              </span>
            </Link>
          )}

          {/* Next Post / Full Archive */}
          {nextPost ? (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="group p-4 rounded-xl border border-neutral-200 hover:border-black transition-all flex flex-col justify-between space-y-1 bg-white hover:bg-neutral-50 sm:text-right"
            >
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black">
                Next Article →
              </span>
              <span className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/archive"
              className="group p-4 rounded-xl border border-neutral-100 hover:border-black transition-all flex flex-col justify-between space-y-1 bg-neutral-50/50 hover:bg-white sm:text-right"
            >
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black">
                Full Archive →
              </span>
              <span className="text-sm font-semibold text-neutral-600 line-clamp-1">
                You're reading the latest post
              </span>
            </Link>
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
