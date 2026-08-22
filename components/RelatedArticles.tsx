import Link from 'next/link';

// components/RelatedArticles.tsx — Recommended Reading section for essays

interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  date: Date;
}

interface Props {
  posts: PostSummary[];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function RelatedArticles({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-14 pt-10 border-t border-neutral-200 font-serif">
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">
        Recommended Reading
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="p-6 border border-neutral-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <p className="text-xs text-neutral-500 mb-2">
                {formatDate(post.date)}
              </p>
              <h4 className="text-lg font-bold text-[#1A1A1A] leading-snug hover:text-neutral-600 transition-colors">
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h4>
              {post.excerpt && (
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Link
                href={`/posts/${post.slug}`}
                className="text-xs font-semibold text-black underline decoration-black/40 underline-offset-4 hover:decoration-black"
              >
                Read Essay →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
