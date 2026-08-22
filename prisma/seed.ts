#!/usr/bin/env ts-node
/**
 * prisma/seed.ts
 *
 * Migrates existing .mdx files from /posts into the SQLite database.
 * Run with:  npm run db:seed
 *
 * Safe to run multiple times — uses upsert so existing slugs won't duplicate.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();
const POSTS_DIR = path.join(process.cwd(), 'posts');

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No /posts directory found — nothing to seed.');
    return;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'));

  if (files.length === 0) {
    console.log('No .mdx files found — nothing to seed.');
    return;
  }

  console.log(`Found ${files.length} post(s) to migrate...\n`);

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    const slug = data.slug ?? filename.replace(/\.mdx?$/, '');
    const tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : '[]';
    const date = data.date ? new Date(data.date) : new Date();

    await prisma.post.upsert({
      where: { slug },
      update: {
        title:   data.title   ?? 'Untitled',
        excerpt: data.excerpt ?? '',
        content: content.trim(),
        tags,
        date,
        status: 'published',
      },
      create: {
        title:   data.title   ?? 'Untitled',
        slug,
        excerpt: data.excerpt ?? '',
        content: content.trim(),
        tags,
        date,
        status: 'published',
      },
    });

    console.log(`  ✓ Migrated: ${data.title ?? slug}`);
  }

  console.log('\nSeeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
