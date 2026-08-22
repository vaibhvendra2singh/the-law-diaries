'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// ─────────────────────────────────────────────────────────────────────────────
// Nav — Floating Pill Header with dynamic Admin state
// ─────────────────────────────────────────────────────────────────────────────

export default function Nav() {
  const pathname = usePathname();
  const { status } = useSession();

  // Hide the public floating pill on all /admin pages (AdminNav is rendered there)
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/',        label: 'HOME'    },
    { href: '/about',   label: 'ABOUT'   },
    { href: '/contact', label: 'CONTACT' },
  ];

  return (
    <header className="sticky top-4 z-50 w-full max-w-[98%] mx-auto px-4 pointer-events-none mb-10">
      <nav
        className="pointer-events-auto bg-white/95 backdrop-blur-md text-[#1A1A1A] rounded-full px-8 py-2.5 shadow-lg border border-neutral-200 flex items-center justify-between gap-4 w-full"
        aria-label="Main navigation"
      >
        {/* Left: Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[#1A1A1A] hover:opacity-80 transition-opacity shrink-0"
        >
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-serif text-sm font-bold shadow-sm">
            ⚖
          </div>
          <span className="font-serif text-sm font-bold tracking-tight text-[#1A1A1A] uppercase">the law diaries</span>
        </Link>

        {/* Center: Uppercase Letterspaced Nav Links (HOME | ABOUT | CONTACT) */}
        <ul className="flex items-center gap-1 sm:gap-6">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="px-3.5 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Admin Button */}
        <div className="flex items-center gap-2 shrink-0">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="px-4 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold text-white bg-black hover:bg-neutral-800 transition-colors shadow-sm"
              >
                DASHBOARD
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              title="Admin Login"
              className="px-4 py-1.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold text-black border border-black hover:bg-black hover:text-white transition-colors"
            >
              ADMIN LOGIN
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
