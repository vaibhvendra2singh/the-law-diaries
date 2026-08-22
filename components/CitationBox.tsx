'use client';

// components/CitationBox.tsx — Academic Legal Citation Box (Bluebook 22nd Edition)

import { useState } from 'react';

interface Props {
  title: string;
  slug: string;
  authorName?: string;
  date: Date | string;
}

function formatBluebookDate(dateInput: Date | string): string {
  const d = new Date(dateInput);
  // Bluebook Table T12 standard month abbreviations
  const bluebookMonths = [
    'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
    'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.',
  ];
  const month = bluebookMonths[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default function CitationBox({ title, slug, authorName = 'Author', date }: Props) {
  const [copied, setCopied] = useState(false);

  const bluebookDate = formatBluebookDate(date);
  const author = authorName && authorName.trim() ? authorName.trim() : 'The Author';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://the-law-diaries.vercel.app';
  const fullUrl = `${baseUrl}/posts/${slug}`;

  // Bluebook 22nd Edition: Author, Title (in italics), THE LAW DIARIES (Date), URL.
  const citationText = `${author}, ${title}, THE LAW DIARIES (${bluebookDate}), ${fullUrl}.`;

  function handleCopyCitation() {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-10 p-6 border border-neutral-300 rounded-2xl bg-neutral-50/80 font-serif space-y-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xs font-bold text-black uppercase tracking-widest">
            How to Cite This Essay
          </span>
          <span className="text-[10px] text-neutral-500 font-sans tracking-wide border border-neutral-300 px-2 py-0.5 rounded-full">
            Bluebook 22nd Ed.
          </span>
        </div>
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

      <div className="font-serif text-sm text-[#222222] bg-white border border-neutral-200 p-4 rounded-xl leading-relaxed select-all">
        <span>{author}, </span>
        <em className="italic">{title}</em>
        <span>, </span>
        <span className="font-semibold tracking-wide text-black text-xs uppercase">The Law Diaries</span>
        <span> ({bluebookDate}), </span>
        <span className="text-neutral-600 break-all">{fullUrl}.</span>
      </div>
    </div>
  );
}
