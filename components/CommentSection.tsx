'use client';

// components/CommentSection.tsx
// Comments section matching exact home page serif typography and black circle avatars

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';

interface Comment {
  id: number;
  name: string;
  body: string;
  createdAt: string;
}

interface Props {
  slug: string;
}

function formatCommentDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function CommentSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  function handleNewComment(comment: Comment) {
    setComments((prev) => [...prev, comment]);
  }

  return (
    <section className="mt-20 pt-10 border-t border-neutral-200" aria-label="Responses">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
        <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
          {loading ? 'Responses' : `Responses (${comments.length})`}
        </h2>
      </div>

      {/* Comment list */}
      {loading ? (
        <p className="font-serif text-sm text-neutral-500 italic">Loading responses…</p>
      ) : comments.length > 0 ? (
        <ol className="divide-y divide-neutral-100 mb-14 border-b border-neutral-200">
          {comments.map((c) => (
            <li key={c.id} className="py-6 flex gap-4">
              {/* Initial Circle */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white
                           flex items-center justify-center font-serif text-xs font-bold"
                aria-hidden="true"
              >
                {c.name.charAt(0).toUpperCase()}
              </div>

              {/* Comment body */}
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1.5 font-serif text-sm">
                  <span className="font-bold text-[#1A1A1A]">{c.name}</span>
                  <time className="text-xs text-neutral-400" dateTime={c.createdAt}>
                    {formatCommentDate(c.createdAt)}
                  </time>
                </div>
                <p className="font-serif text-base text-[#333333] leading-relaxed whitespace-pre-wrap">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="font-serif text-base text-neutral-500 italic mb-10">
          No responses yet — be the first to leave one.
        </p>
      )}

      {/* Comment form */}
      <div>
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-5">Leave a Response</h3>
        <CommentForm slug={slug} onCommentAdded={handleNewComment} />
      </div>
    </section>
  );
}
