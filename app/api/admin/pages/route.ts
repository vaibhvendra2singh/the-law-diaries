// app/api/admin/pages/route.ts — Admin API endpoint to fetch & update static pages and brand settings

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPagesData, updatePageData, PagesData } from '@/lib/pagesStore';

// GET /api/admin/pages
export async function GET() {
  const pages = getPagesData();
  return NextResponse.json(pages);
}

// PUT /api/admin/pages
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pageKey, data } = body;

    if (!pageKey || !['about', 'contact', 'settings'].includes(pageKey)) {
      return NextResponse.json({ error: 'Invalid page key' }, { status: 400 });
    }

    const updated = updatePageData(pageKey as keyof PagesData, data);
    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error('Error updating page:', err);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}
