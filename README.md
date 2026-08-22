# ⚖️ The Law Diaries

> A minimalist, high-legibility digital legal journal and editorial publication designed for long-form commentary on constitutional law, statutory analysis, and public policy. Inspired by the editorial design of *IndiaCorpLaw* and top law reviews.

---

## 🌟 Key Features

* **🎨 Editorial Aesthetics**: Single-column vertical article feed, Georgia / Source Serif 4 typography, floating white pill navigation header, and pure monochrome black & white theme.
* **✍️ Live Split-Pane Markdown Editor**: Write in Markdown on the left and see the formatted legal manuscript live on the right with footnoting (`[^1]`), pull-quotes, and table support.
* **📜 1-Click Bluebook Citation Box**: Generates copyable academic citations (*"Samir Kapri, 'Article Title', The Law Diaries (2026)..."*) with a 1-click `Copy Citation` button.
* **👨‍cite Guest Author & Affiliation Byline Support**: Publish guest contributors or co-authors with bracketed affiliation notes (e.g. `[Param Pandya is a Research Fellow at NUS Law]`).
* **📚 Chronological Archive & Recommended Reading**: Auto-generated `Year/Month` timeline catalog with live keyword search and related reading grids at the bottom of essays.
* **⚖️ IndiaCorpLaw Legal Disclaimer**: Collapsible legal disclaimer on post pages & dedicated `/terms` page addressing personal capacity opinions, no legal advice, and third-party link disclaimers.
* **🔒 Single-Admin Security**: Protected dashboard (`/admin`) using NextAuth.js JWT sessions and bcrypt password encryption.
* **✉️ Live Email Correspondence**: Contact form submissions deliver live notifications straight to your inbox via Resend API.
* **⚡ Sub-50ms Performance**: Zero commercial ads, zero render-blocking fonts, optimized with Next.js Incremental Static Revalidation (`revalidate = 5`).

---

## 🛠️ Tech Stack

* **Framework**: Next.js 14 (App Router) with TypeScript
* **Styling**: Tailwind CSS (Monochrome Black & White Editorial Theme)
* **Database**: Supabase Cloud PostgreSQL managed via Prisma ORM
* **Authentication**: NextAuth.js (Credentials Provider with bcrypt encryption)
* **Markdown Engine**: `react-markdown` & `remark-gfm`
* **Email Service**: Resend API
* **Deployment Target**: Vercel / Netlify

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/vaibhvendra2singh/blogsite.git
cd blogsite
npm install
```

### 2. Configure Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
NEXTAUTH_SECRET=your_32_character_secret_string
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL="lawdiaries01@gmail.com"
ADMIN_PASSWORD_HASH="your_bcrypt_hash_here"

DATABASE_URL="your_supabase_database_url"
DIRECT_URL="your_supabase_direct_url"

RESEND_API_KEY="your_resend_api_key_here"
```

### 3. Sync Database Schema
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Admin Dashboard & Login

* **Admin Sign-In**: `http://localhost:3000/login`
* **Default Email**: `lawdiaries01@gmail.com`
* **Default Password**: `LawDiaries2026!`

To update your login email or password at any time, run:
```bash
npm run setup
```

---

## 📁 Project Structure

```
the-law-diaries/
├── app/                        # Next.js App Router pages and API routes
│   ├── admin/                  # Admin dashboard & editor pages (/admin)
│   ├── about/                  # About page (/about)
│   ├── api/                    # Backend API endpoints (auth, posts, contact)
│   ├── archive/                # Chronological archive catalog (/archive)
│   ├── contact/                # Contact page (/contact)
│   ├── login/                  # Admin login page (/login)
│   ├── posts/[slug]/           # Essay reader page (/posts/[slug])
│   ├── terms/                  # Terms & legal disclaimer page (/terms)
│   ├── globals.css             # Base styles, typography, and footnote CSS
│   └── page.tsx                # Homepage featuring the main article stream
├── components/                 # Reusable React components
│   ├── ArticleList.tsx         # Homepage article stream component
│   ├── CitationBox.tsx         # 1-Click Bluebook legal citation component
│   ├── CommentSection.tsx      # Comment list renderer
│   ├── DeletePostButton.tsx    # Delete article button with confirmation modal
│   ├── LegalDisclaimer.tsx     # Collapsible legal disclaimer component
│   ├── Nav.tsx                 # Floating pill navbar header
│   ├── PostMetaFields.tsx      # Editor metadata inputs (Title, Slug, Author)
│   ├── ReadingProgressBar.tsx  # Scroll reading progress bar
│   └── RelatedArticles.tsx     # Recommended reading grid component
├── content/                    # Permanent content JSON & Markdown files
│   ├── pages.json              # Saved About Us & Contact page text
│   └── terms.md                # Terms and Conditions markdown document
├── lib/                        # Shared utility libraries (auth, prisma, pagesStore)
├── prisma/                     # Database schema definition (schema.prisma)
├── PROJECT_OVERVIEW.txt        # Comprehensive technical documentation
└── README.md                   # Project overview & setup guide
```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub (`git push origin main`).
2. Go to **[Vercel.com](https://vercel.com)** and import your repository.
3. Add the environment variables from `.env` under **Settings → Environment Variables**.
4. Click **Deploy**! Your site will be live in ~60 seconds.

---

## 📜 License

© 2026 The Law Diaries. All rights reserved.
