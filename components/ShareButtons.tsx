'use client';

// components/ShareButtons.tsx
// Clean, text-based social sharing & copy link buttons for articles

import { useState } from 'react';

interface Props {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const articleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/posts/${slug}`
    : `https://thelawdiaries.in/posts/${slug}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

  return (
    <div className="py-6 border-t border-b border-neutral-200 my-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-serif">
      <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
        Share this article:
      </span>

      <div className="flex flex-wrap items-center gap-3 font-sans text-xs uppercase tracking-widest font-semibold">
        {/* Share on X */}
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-neutral-300 hover:border-black text-neutral-700 hover:text-black px-4 py-1.5 rounded-full transition-colors"
        >
          Share on X
        </a>

        {/* Share on LinkedIn */}
        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-neutral-300 hover:border-black text-neutral-700 hover:text-black px-4 py-1.5 rounded-full transition-colors"
        >
          LinkedIn
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`border px-4 py-1.5 rounded-full transition-colors ${
            copied
              ? 'border-black bg-black text-white'
              : 'border-neutral-300 hover:border-black text-neutral-700 hover:text-black'
          }`}
        >
          {copied ? 'Copied! ✓' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
