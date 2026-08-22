'use client';

// components/DeletePostButton.tsx — Delete Post button with confirmation modal

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  postId: number;
  postTitle?: string;
  onDeleted?: () => void;
}

export default function DeletePostButton({ postId, postTitle, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmText = postTitle
      ? `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
      : 'Are you sure you want to delete this article? This action cannot be undone.';

    if (!window.confirm(confirmText)) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/posts/id/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (onDeleted) {
          onDeleted();
        } else {
          router.refresh();
          router.push('/admin');
        }
      } else {
        alert('Failed to delete article. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="border border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full font-serif text-xs font-semibold transition-colors disabled:opacity-50"
    >
      {deleting ? 'Deleting…' : 'Delete ✕'}
    </button>
  );
}
