import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using The Law Diaries.',
};

export default function TermsPage() {
  const filePath = path.join(process.cwd(), 'content', 'terms.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      
      {/* Top Center Pill Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Terms & Conditions
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
          {data.title || 'Terms & Conditions'}
        </h1>
        <p className="font-serif text-xs text-neutral-500 italic mt-2">
          Last updated: {data.lastUpdated || '22 August 2026'}
        </p>
      </div>

      {/* Markdown Body */}
      <div className="prose font-serif text-base sm:text-lg text-[#333333] leading-relaxed space-y-6 border-t border-neutral-200 pt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

    </div>
  );
}
