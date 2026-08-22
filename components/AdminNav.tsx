'use client';
// components/AdminNav.tsx — Clean Serif Admin Navigation Bar

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminNav() {
  return (
    <div className="w-full bg-white py-4 mb-6 border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-serif text-xs">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/admin"
            className="font-bold text-[#1A1A1A] hover:text-neutral-600 transition-colors uppercase tracking-wider"
          >
            ADMIN DASHBOARD
          </Link>
          <Link
            href="/admin/new"
            className="text-black font-semibold hover:underline underline-offset-4"
          >
            + New Post
          </Link>
          <Link
            href="/admin/pages"
            className="text-black font-semibold hover:underline underline-offset-4"
          >
            Edit Pages ✎
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-neutral-500 hover:text-black transition-colors"
          >
            View Blog ↗
          </Link>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-neutral-500 hover:text-black transition-colors uppercase tracking-wider font-semibold"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}
