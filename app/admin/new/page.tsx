'use client';
// app/admin/new/page.tsx — New post editor matching home page serif styling

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import PostMetaFields from '@/components/PostMetaFields';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
const today = new Date().toISOString().split('T')[0];

export default function NewPostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState({
    title: '', slug: '', excerpt: '', authorName: '', authorBio: '', tags: 'ESSAYS', status: 'draft', date: today,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings?.authorName) {
          setMeta((prev) => ({ ...prev, authorName: data.settings.authorName }));
        }
      })
      .catch(() => {});
  }, []);

  function updateMeta(updated: Partial<typeof meta>) {
    setMeta((prev) => ({ ...prev, ...updated }));
  }

  async function save(publishNow = false) {
    if (!meta.title.trim()) { setError('Title is required.'); return; }
    if (!meta.slug.trim())  { setError('Slug is required.'); return; }
    setError('');
    setSaving(true);

    const res = await fetch('/api/posts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title:      meta.title,
        slug:       meta.slug,
        excerpt:    meta.excerpt,
        authorName: meta.authorName,
        authorBio:  meta.authorBio,
        content,
        tags:       meta.tags.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean),
        status:     publishNow ? 'published' : meta.status,
        date:       meta.date,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? 'Failed to save post.');
      return;
    }

    router.push('/admin');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 font-serif">
      {/* Top Center Pill Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Editor
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            New Article
          </h1>
          <p className="font-serif text-sm text-neutral-500 mt-1">
            Write and publish a new essay to your publication.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {error && <span className="font-serif text-xs text-red-600 font-semibold">{error}</span>}
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="border border-black text-black px-5 py-2 rounded-full font-serif text-xs uppercase tracking-widest font-semibold hover:bg-neutral-100 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-full font-serif text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            {saving ? 'Saving…' : 'Publish Article'}
          </button>
        </div>
      </div>

      {/* Metadata fields */}
      <div className="mb-8 p-6 border border-neutral-200 rounded-2xl bg-white shadow-sm">
        <PostMetaFields meta={meta} onChange={updateMeta} />
      </div>

      {/* Split-pane editor */}
      <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Editor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
