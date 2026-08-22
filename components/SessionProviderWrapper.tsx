'use client';
// components/SessionProviderWrapper.tsx
// Wraps the app in NextAuth's SessionProvider (required for useSession hook in client components)

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
