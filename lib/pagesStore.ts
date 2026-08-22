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
}

export interface PagesData {
  settings: SettingsData;
  about: AboutPageData;
  contact: ContactPageData;
}

const defaultPages: PagesData = {
  settings: {
    authorName: 'Samir Kapri',
    authorTagline: '5th Semester Law Student at Bennett University',
    siteName: 'The Law Diaries',
  },
  about: {
    title: 'Samir Kapri',
    subtitle: '5th Semester Law Student at Bennett University · Litigation & Policy Researcher',
    content: `I am a dedicated 5th semester law student at **Bennett University (School of Law)**, pursuing a **BA LLB (Hons)**. My focus is devoted to litigation and research-oriented work centered on policy-making, constitutional jurisprudence, and statutory analysis.

### Profile & Background

I possess a keen passion for legal writing, case law analysis, and moot court competitions. My academic and practical endeavors focus on **Constitutional Law, Criminal Law, Subaltern Studies, and Sociology** — combining rigorous statutory interpretation with an understanding of socio-legal dynamics.`,
  },
  contact: {
    title: 'Get in Touch',
    subtitle: 'If you have questions, comments on an article, or submission inquiries, please send a message below.',
    email: 'lawdiaries01@gmail.com',
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
