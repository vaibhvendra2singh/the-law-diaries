'use client';
// app/login/page.tsx — Login page with Forgot Password link

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    // Prefetch admin dashboard assets in background so transition is instant
    router.prefetch('/admin');
    if (status === 'authenticated') {
      window.location.href = '/admin';
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoading(false);
        setError('Incorrect email or password.');
      } else if (result?.ok) {
        // Instant hard navigation so session cookies and server component /admin load immediately
        window.location.href = '/admin';
      } else {
        setLoading(false);
        setError('Sign in failed. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  }

  if (status === 'loading') return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm border border-black p-8 bg-white shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
            ADMINISTRATOR
          </p>
          <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] uppercase tracking-tight">
            Sign In
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block font-serif text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-2.5 font-sans text-sm
                         text-[#1A1A1A] bg-white focus:outline-none focus:border-black rounded-lg shadow-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block font-serif text-xs font-bold uppercase tracking-widest text-black">
                PASSWORD
              </label>
              <Link
                href="/forgot-password"
                className="font-serif text-[11px] text-neutral-500 hover:text-black underline decoration-neutral-300 underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-2.5 font-sans text-sm
                         text-[#1A1A1A] bg-white focus:outline-none focus:border-black rounded-lg shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-serif text-xs uppercase tracking-widest text-red-600 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full font-serif text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center font-serif text-xs uppercase tracking-widest text-neutral-500 mt-8">
          <a href="/" className="hover:text-black transition-colors underline decoration-black/40 underline-offset-4">
            ← BACK TO BLOG
          </a>
        </p>
      </div>
    </div>
  );
}
