'use client';

// components/CommentSection.tsx
// Comments section matching exact home page serif typography and black circle avatars

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  const [myCommentIds, setMyCommentIds] = useState<number[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch comments for the post
    fetch(`/api/posts/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Load current user's authored comment IDs from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('user_my_comments') || '[]');
      if (Array.isArray(stored)) {
        setMyCommentIds(stored);
      }
    } catch {}
  }, [slug]);

  function handleNewComment(comment: Comment) {
    setComments((prev) => [...prev, comment]);
    if (comment.id) {
      setMyCommentIds((prev) => [...prev, comment.id]);
    }
  }

  async function handleDeleteComment(id: number) {
    if (!window.confirm('Are you sure you want to delete this response?')) {
      return;
    }

    const prevComments = comments;
    setComments((prev) => prev.filter((c) => c.id !== id));

    // Remove from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('user_my_comments') || '[]');
      if (Array.isArray(stored)) {
        const updated = stored.filter((item: number) => item !== id);
        localStorage.setItem('user_my_comments', JSON.stringify(updated));
        setMyCommentIds(updated);
      }
    } catch {}

    try {
      const res = await fetch(`/api/posts/${slug}/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (err) {
      alert('Could not delete response. Restoring comment.');
      setComments(prevComments);
    }
  }

  const isAdmin = !!session;

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
          {comments.map((c) => {
            const canDelete = isAdmin || myCommentIds.includes(c.id);

            return (
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1A1A1A]">{c.name}</span>
                      {myCommentIds.includes(c.id) && (
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-sans uppercase tracking-wider font-medium">
                          You
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <time className="text-xs text-neutral-400" dateTime={c.createdAt}>
                        {formatCommentDate(c.createdAt)}
                      </time>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          title="Delete response"
                          className="text-neutral-400 hover:text-red-600 transition-colors text-xs font-sans font-medium hover:underline"
                        >
                          Delete ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-serif text-base text-[#333333] leading-relaxed whitespace-pre-wrap">
                    {c.body}
                  </p>
                </div>
              </li>
            );
          })}
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
