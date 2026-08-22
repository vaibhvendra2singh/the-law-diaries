'use client';

// app/reset-password/page.tsx — Set a new password using a reset token from email

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [status, setStatus]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage]     = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid reset link. Please request a new one.');
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      setStatus('error');
      return;
    }

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Your password has been updated successfully.');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-black p-8 bg-white shadow-sm space-y-6">

        {/* Header */}
        <div className="text-center">
          <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
            ADMINISTRATOR
          </p>
          <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] uppercase tracking-tight">
            Set New Password
          </h1>
          <p className="font-serif text-xs text-neutral-500 mt-2">
            Choose a strong password for your admin account.
          </p>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="space-y-4">
            <div className="p-4 border border-black bg-neutral-50 rounded-lg font-serif text-sm text-[#1A1A1A] leading-relaxed text-center">
              <p className="text-lg mb-1">✓</p>
              <p className="font-semibold">{message}</p>
              <p className="text-xs text-neutral-500 mt-2">Redirecting you to login…</p>
            </div>
          </div>

        ) : status === 'error' && !token ? (
          /* Invalid/missing token */
          <div className="space-y-4">
            <div className="p-4 border border-red-300 bg-red-50 rounded-lg font-serif text-sm text-red-800 leading-relaxed text-center">
              {message}
            </div>
            <div className="pt-2 text-center">
              <Link
                href="/forgot-password"
                className="font-serif text-xs font-semibold text-black underline decoration-black/40 underline-offset-4 hover:decoration-black uppercase tracking-widest"
              >
                ← Request a new link
              </Link>
            </div>
          </div>

        ) : (
          /* Password form */
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error message */}
            {status === 'error' && message && (
              <div className="p-3 border border-red-300 bg-red-50 rounded-lg font-serif text-xs text-red-800">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="new-password" className="block font-serif text-xs font-bold uppercase tracking-widest text-black mb-1.5">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-2.5 font-sans text-sm text-[#1A1A1A] bg-white focus:outline-none focus:border-black rounded-lg shadow-sm"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block font-serif text-xs font-bold uppercase tracking-widest text-black mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-2.5 font-sans text-sm text-[#1A1A1A] bg-white focus:outline-none focus:border-black rounded-lg shadow-sm"
                placeholder="Re-enter your new password"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-black text-white py-3 rounded-full font-serif text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-60"
            >
              {status === 'loading' ? 'UPDATING…' : 'UPDATE PASSWORD'}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="font-serif text-xs font-semibold text-neutral-600 hover:text-black underline decoration-neutral-300 underline-offset-4 uppercase tracking-widest"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center font-serif text-sm text-neutral-500">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
