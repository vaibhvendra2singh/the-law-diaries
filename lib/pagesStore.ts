// lib/pagesStore.ts — Helper to read and update static page contents dynamically

import fs from 'fs';
import path from 'path';

const pagesFilePath = path.join(process.cwd(), 'content', 'pages.json');

export interface SettingsData {
  authorName: string;
  authorTagline: string;
  siteName: string;
}

export interface AboutPageData {
  title: string;
  subtitle: string;
  content: string;
}

export interface ContactPageData {
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
}

export interface PagesData {
  settings: SettingsData;
  about: AboutPageData;
  contact: ContactPageData;
}

const defaultPages: PagesData = {
  settings: {
    authorName: '',
    authorTagline: '',
    siteName: 'My Law Blog',
  },
  about: {
    title: '',
    subtitle: '',
    content: '',
  },
  contact: {
    title: 'Get in Touch',
    subtitle: 'If you have questions, comments on an article, or submission inquiries, please send a message below.',
    email: '',
    phone: '',
  },
};

export function getPagesData(): PagesData {
  try {
    if (fs.existsSync(pagesFilePath)) {
      const fileData = fs.readFileSync(pagesFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      return {
        settings: parsed.settings || defaultPages.settings,
        about: parsed.about || defaultPages.about,
        contact: parsed.contact || defaultPages.contact,
      };
    }
  } catch (err) {
    console.error('Error reading pages.json:', err);
  }
  return defaultPages;
}

export function updatePageData<K extends keyof PagesData>(pageKey: K, updatedData: Partial<PagesData[K]>) {
  const currentData = getPagesData();
  currentData[pageKey] = {
    ...currentData[pageKey],
    ...updatedData,
  } as any;
  fs.writeFileSync(pagesFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
  return currentData[pageKey];
}
