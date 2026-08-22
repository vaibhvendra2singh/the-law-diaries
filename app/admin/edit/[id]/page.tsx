'use client';
// app/admin/edit/[id]/page.tsx — Edit post page matching exact Home Page serif design & pill controls

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PostMetaFields from '@/components/PostMetaFields';
import DeletePostButton from '@/components/DeletePostButton';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState({
    title: '', slug: '', excerpt: '', authorName: '', authorBio: '', tags: '', status: 'draft', date: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetch(`/api/admin/posts`)
      .then((r) => r.json())
      .then((posts: any[]) => {
        const post = posts.find((p) => String(p.id) === params.id);
        if (!post) { router.replace('/admin'); return; }

        const tags = Array.isArray(JSON.parse(post.tags || '[]'))
          ? JSON.parse(post.tags || '[]').join(', ')
          : '';

        setMeta({
          title:      post.title,
          slug:       post.slug,
          excerpt:    post.excerpt ?? '',
          authorName: post.authorName ?? '',
          authorBio:  post.authorBio ?? '',
          tags,
          status:     post.status,
          date:       new Date(post.date).toISOString().split('T')[0],
        });
        return fetch(`/api/posts/${post.slug}`);
      })
      .then((r) => r?.json())
      .then((full) => {
        if (full?.content) setContent(full.content);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [params.id, router]);

  function updateMeta(updated: Partial<typeof meta>) {
    setMeta((prev) => ({ ...prev, ...updated }));
  }

  async function save(statusOverride?: string) {
    if (!meta.title.trim()) { setError('Title is required.'); return; }
    setError('');
    setSaving(true);

    const res = await fetch(`/api/posts/id/${params.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title:      meta.title,
        slug:       meta.slug,
        excerpt:    meta.excerpt,
        authorName: meta.authorName,
        authorBio:  meta.authorBio,
        content,
        tags:       meta.tags.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean),
        status:     statusOverride ?? meta.status,
        date:       meta.date,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? 'Failed to save.'); return; }
    router.refresh();
    router.push('/admin');
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center font-serif text-sm text-neutral-500 italic">
        Loading article data…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 font-serif">
      
      {/* ── Top Center Pill Badge ── */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Editor
        </div>
      </div>

      {/* ── Header Title & Actions ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Edit Article
          </h1>
          <p className="font-serif text-sm text-neutral-500 mt-1">
            Update content, tags, status, or delete this essay.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {error && <span className="font-serif text-xs text-red-600 font-semibold">{error}</span>}
          
          {/* Save Draft Pill Button */}
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="border border-black text-black px-5 py-2 rounded-full font-serif text-xs uppercase tracking-widest font-semibold hover:bg-neutral-100 transition-colors"
          >
            Save Draft
          </button>

          {/* Save Changes / Publish Pill Button */}
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-full font-serif text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            {saving ? 'Saving…' : meta.status === 'published' ? 'Save Changes' : 'Publish'}
          </button>

          {/* Delete Button */}
          <DeletePostButton postId={Number(params.id)} postTitle={meta.title} />
        </div>
      </div>

      {/* ── Metadata fields ── */}
      <div className="mb-8 p-6 border border-neutral-200 rounded-2xl bg-white shadow-sm">
        <PostMetaFields meta={meta} onChange={updateMeta} />
      </div>

      {/* ── Split-pane editor ── */}
      <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Editor value={content} onChange={setContent} />
      </div>

    </div>
  );
}
