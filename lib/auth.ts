import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

function getFreshEnvCredentials() {
  let adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  let adminHash  = (process.env.ADMIN_PASSWORD_HASH || '').trim();

  // Try reading fresh .env file directly to catch instant CLI updates
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const emailMatch = envContent.match(/ADMIN_EMAIL=["']?([^"\n\r]+)["']?/);
      const hashMatch  = envContent.match(/ADMIN_PASSWORD_HASH=["']?([^"\n\r]+)["']?/);

      if (emailMatch && emailMatch[1]) adminEmail = emailMatch[1].trim();
      if (hashMatch && hashMatch[1]) adminHash = hashMatch[1].trim();
    }
  } catch (err) {
    console.error('Error reading fresh .env credentials:', err);
  }

  // Strip quotes if present
  if ((adminEmail.startsWith('"') && adminEmail.endsWith('"')) || (adminEmail.startsWith("'") && adminEmail.endsWith("'"))) {
    adminEmail = adminEmail.slice(1, -1);
  }
  if ((adminHash.startsWith('"') && adminHash.endsWith('"')) || (adminHash.startsWith("'") && adminHash.endsWith("'"))) {
    adminHash = adminHash.slice(1, -1);
  }

  return { adminEmail, adminHash };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'o25Jk78wf64O4nav9AqczqC8DtbPXWxOXoCp5nATNGU=',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const reqEmail = credentials.email.trim().toLowerCase();
        const reqPass  = credentials.password.trim();

        // Get fresh admin credentials from .env
        const { adminEmail, adminHash } = getFreshEnvCredentials();

        if (!adminEmail || !adminHash) {
          console.error('[NextAuth] ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not configured.');
          return null;
        }

        // Email check
        if (reqEmail !== adminEmail.toLowerCase()) {
          console.log('[NextAuth] Login failed: Email mismatch');
          return null;
        }

        // Check password against env hash
        const passwordOk = await bcrypt.compare(reqPass, adminHash);

        if (!passwordOk) {
          console.log('[NextAuth] Login failed: Password mismatch');
          return null;
        }

        console.log('[NextAuth] Login successful for:', reqEmail);
        return { id: '1', email: adminEmail, name: 'Admin' };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) (session.user as any).id = token.id;
      return session;
    },
  },
};
