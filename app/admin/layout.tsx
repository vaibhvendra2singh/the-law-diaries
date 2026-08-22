// app/admin/layout.tsx — Layout wrapper for all admin pages.
// Adds the AdminNav bar and SessionProvider.

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Extra server-side check (middleware handles the redirect, but this is a safety net)
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <SessionProviderWrapper>
      <div className="flex flex-col min-h-screen bg-canvas">
        <AdminNav />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProviderWrapper>
  );
}
