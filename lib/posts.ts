// ─────────────────────────────────────────────────────────────────────────────
// lib/posts.ts
//
// Utility functions that read and parse all .mdx files from the /posts folder.
// Used by the Home page, Archive page, and individual Post pages.
//
// You never need to edit this file. Just add new .mdx files to /posts/.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Absolute path to the /posts directory
const POSTS_DIR = path.join(process.cwd(), 'posts');

// ── Types ────────────────────────────────────────────────────────────────────

export interface PostMeta {
  slug: string;
  title: string;
  date: string;       // ISO string: "2026-08-22"
  excerpt: string;
  tags: string[];
  readingTime: string; // e.g. "7 min read"
}

export interface Post extends PostMeta {
  content: string;    // Raw MDX content (without frontmatter)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Read a single .mdx file and return its metadata + content */
function parsePost(filename: string): Post {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const stats = readingTime(content);

  return {
    slug:        data.slug || filename.replace(/\.mdx?$/, ''),
    title:       data.title       ?? 'Untitled',
    date:        data.date        ?? '',
    excerpt:     data.excerpt     ?? '',
    tags:        data.tags        ?? [],
    readingTime: stats.text,       // "X min read"
    content,
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns metadata for all posts, sorted newest-first.
 * Skips files starting with _ (e.g. _template.mdx).
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .map(parsePost)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

/**
 * Returns the full post (metadata + content) for a given slug.
 * Returns null if not found.
 */
export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs.readdirSync(POSTS_DIR);
  const filename = files.find(
    (f) => f.endsWith('.mdx') && !f.startsWith('_') &&
           parsePost(f).slug === slug
  );

  if (!filename) return null;
  return parsePost(filename);
}

/**
 * Returns all valid slugs — used by Next.js to pre-generate post pages.
 */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/**
 * Groups posts by year, then by month name.
 * Returns an array of { year, months: [{ month, posts }] } sorted newest first.
 */
export function getPostsGroupedByDate() {
  const posts = getAllPosts();

  const grouped: Record<string, Record<string, PostMeta[]>> = {};

  for (const post of posts) {
    const d = new Date(post.date);
    const year  = d.getFullYear().toString();
    const month = d.toLocaleString('en-IN', { month: 'long' }); // e.g. "August"

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(post);
  }

  // Sort years descending
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, months]) => ({
      year,
      months: Object.entries(months).map(([month, posts]) => ({ month, posts })),
    }));
}
