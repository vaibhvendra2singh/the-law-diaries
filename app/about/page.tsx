import type { Metadata } from 'next';
import { getPagesData } from '@/lib/pagesStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pages = getPagesData();
  return {
    title: pages.about.title || 'About Us',
    description: pages.about.subtitle || 'About the author of The Law Diaries.',
  };
}

export default function AboutPage() {
  const pages = getPagesData();
  const { title, subtitle, content } = pages.about;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      
      {/* Top Center Pill Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          About Us
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
          {title}
        </h1>
        {subtitle && (
          <p className="font-serif text-sm text-neutral-500 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Body Content */}
      <div className="prose font-serif text-base sm:text-lg text-[#333333] leading-relaxed space-y-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

    </div>
  );
}
