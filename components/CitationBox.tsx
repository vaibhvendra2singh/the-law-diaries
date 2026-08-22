'use client';

// components/CitationBox.tsx — Academic Legal Citation Box ("How to Cite This Essay")

import { useState } from 'react';

interface Props {
  title: string;
  slug: string;
  authorName?: string;
  date: Date;
}

export default function CitationBox({ title, slug, authorName = 'Author', date }: Props) {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://thelawdiaries.in';
  const fullUrl = `${baseUrl}/posts/${slug}`;

  const citationText = `${authorName}, "${title}", The Law Diaries (${formattedDate}), available at ${fullUrl}.`;

  function handleCopyCitation() {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-10 p-6 border border-neutral-300 rounded-2xl bg-neutral-50/80 font-serif space-y-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="font-serif text-xs font-bold text-black uppercase tracking-widest">
          How to Cite This Essay
        </span>
        <button
          onClick={handleCopyCitation}
          className={`px-4 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-colors ${
            copied
              ? 'bg-black text-white'
              : 'border border-black text-black hover:bg-black hover:text-white'
          }`}
        >
          {copied ? 'Copied! ✓' : 'Copy Citation'}
        </button>
      </div>

      <p className="font-serif text-sm text-[#222222] bg-white border border-neutral-200 p-4 rounded-xl leading-relaxed select-all">
        {citationText}
      </p>
    </div>
  );
}
