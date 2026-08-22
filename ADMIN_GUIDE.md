# 📖 The Law Diaries — Admin & Operations Guide

This guide contains everything you need to know about managing credentials, updating website content, configuring emails, and onboarding new clients.

---

## 🔐 1. Admin Credentials & Authentication

### How Admin Auth Works
- Admin credentials (email and password hash) are stored securely in the **PostgreSQL Database** (`AdminUser` table) using `bcrypt` encryption.
- They are **NOT** overwritten by new deployments or Vercel redeploys.

---

### A. How to Change Admin Email & Password (Terminal / Initial Setup)
Run this command on your machine inside the project directory:
```bash
npm run setup
```
1. It will ask for your **Admin email** (e.g., `lawdiaries01@gmail.com`).
2. It will ask for your **Admin password** (minimum 8 characters).
3. It hashes the password and **directly updates your database (`AdminUser` table)** and updates your local `.env`.
4. Changes take effect **immediately** — no redeploy needed.

---

### B. How to Reset Password via Web (For You or Clients)
1. Go to `https://your-domain.vercel.app/login`
2. Click **"Forgot your password?"**
3. Enter the registered admin email.
4. Check your inbox for an email with the subject **`Password Reset — The Law Diaries`**.
5. Click the link in the email (valid for **1 hour**).
6. Set your new password (minimum 8 characters).
7. The new password is encrypted and saved directly to the database.

---

## 📝 2. Updating Website Content & Branding (No Code Required)

Once logged in as admin at `/login`:

### A. Author & Publication Settings
1. Navigate to `/admin/pages` (or click **Site & Author Settings** in Admin Navigation).
2. Under **Author & Brand Settings**:
   - **Default Author Name**: Used in new articles & citations.
   - **Author Tagline / Title**: e.g., `Senior Advocate, Supreme Court of India`.
   - **Publication Name**: e.g., `The Law Diaries`.
3. Click **Save Author & Brand Settings**.

### B. About Us Page
1. Go to `/admin/pages` → click the **About Us Page** tab.
2. Edit **Heading**, **Subtitle**, and the full **Biography / Description** (supports full Markdown & formatting).
3. Click **Save About Us Page**.

### C. Contact Page
1. Go to `/admin/pages` → click the **Contact Page** tab.
2. Edit **Heading**, **Subtitle**, and the public **Contact Email Address** shown to visitors.
3. Click **Save Contact Page**.

---

## ⚙️ 3. Environment Variables Reference

When deploying to Vercel (or configuring local `.env`), these are the required variables:

| Variable | Description | Example / Value |
|---|---|---|
| `NEXTAUTH_SECRET` | 32-byte base64 encryption key | Generate using `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of the live site (**must include `https://`**) | `https://the-law-diaries.vercel.app` |
| `DATABASE_URL` | Supabase / Postgres connection string | `postgresql://...` |
| `DIRECT_URL` | Supabase direct connection string | `postgresql://...` |
| `RESEND_API_KEY` | Resend API key for sending reset & contact emails | `re_...` |

> [!IMPORTANT]
> Always make sure `NEXTAUTH_URL` in Vercel includes `https://` (e.g. `https://the-law-diaries.vercel.app`), otherwise password reset links in emails will fail to format properly.

---

## ✉️ 4. Email Service (Resend)

- **Password reset emails** and **contact form notifications** are sent via [Resend](https://resend.com).
- The default sender is `The Law Diaries <onboarding@resend.dev>`.
- To use your own custom domain (e.g. `hello@thelawdiaries.in`):
  1. Add and verify your domain in [Resend Dashboard → Domains](https://resend.com/domains).
  2. Update the `from:` field in `app/api/auth/forgot-password/route.ts` and `app/api/contact/route.ts`.

---

## 👥 5. Deploying for a New Client (Isolated Setup)

If you are setting up the blog for a new law firm or author:

1. **New GitHub Repo**: Fork or copy this repository to a new repository for the client.
2. **New Supabase Database**:
   - Create a free project at [supabase.com](https://supabase.com).
   - Copy the `DATABASE_URL` and `DIRECT_URL`.
3. **Deploy to Vercel**:
   - Connect the new repo.
   - Set the 5 environment variables listed in Section 3.
4. **Create Client Admin Account**:
   - On your local terminal, run `npm run setup` with the client's database URL in `.env` to create their unique admin email & password.
5. **Hand off**: Give the client their site URL and `/login` credentials.
