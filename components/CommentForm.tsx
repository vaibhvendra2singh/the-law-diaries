'use client';

// components/CommentForm.tsx
// Public comment submission form with monochrome editorial styling and honeypot spam protection.

import { useState, useRef } from 'react';

interface Props {
  slug: string;
  onCommentAdded: (comment: { id: number; name: string; body: string; createdAt: string }) => void;
}

export default function CommentForm({ slug, onCommentAdded }: Props) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError]     = useState('');
  const honeypotRef           = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          comment,
          honeypot: honeypotRef.current?.value ?? '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName(''); setEmail(''); setComment('');
      
      const newCommentObj = { ...data, createdAt: data.createdAt ?? new Date().toISOString() };
      if (typeof window !== 'undefined' && data.id) {
        try {
          const stored = JSON.parse(localStorage.getItem('user_my_comments') || '[]');
          if (Array.isArray(stored)) {
            stored.push(data.id);
            localStorage.setItem('user_my_comments', JSON.stringify(stored));
          }
        } catch {}
      }

      onCommentAdded(newCommentObj);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot field */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
        <label htmlFor="website">Leave this blank</label>
        <input ref={honeypotRef} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="comment-name" className="block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink mb-1.5">
            YOUR NAME <span className="text-ink">*</span>
          </label>
          <input
            id="comment-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full border border-ink/40 px-3 py-2 font-serif text-sm
                       text-ink bg-canvas focus:outline-none focus:border-ink rounded-none"
            placeholder="e.g. A. Sharma"
          />
        </div>
        <div>
          <label htmlFor="comment-email" className="block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink mb-1.5">
            EMAIL <span className="text-muted font-normal text-[10px] lowercase">(optional, not shown)</span>
          </label>
          <input
            id="comment-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            className="w-full border border-ink/40 px-3 py-2 font-serif text-sm
                       text-ink bg-canvas focus:outline-none focus:border-ink rounded-none"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Comment textarea */}
      <div>
        <label htmlFor="comment-body" className="block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink mb-1.5">
          RESPONSE <span className="text-ink">*</span>
        </label>
        <textarea
          id="comment-body"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          className="w-full border border-ink/40 px-3 py-2 font-serif text-sm
                     text-ink bg-canvas focus:outline-none focus:border-ink rounded-none
                     resize-vertical"
          placeholder="Share your commentary or thoughts..."
        />
        <p className="font-mono text-[10px] text-muted mt-1 text-right tracking-[0.18em]">
          {comment.length}/2000
        </p>
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink font-semibold">{error}</p>
      )}

      {/* Success message */}
      {status === 'success' && (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink font-semibold">Your response has been published.</p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-editorial"
      >
        {status === 'sending' ? 'SUBMITTING…' : 'SUBMIT RESPONSE'}
      </button>
    </form>
  );
}
