import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';



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

        try {
          // Look up admin in the database
          const admin = await prisma.adminUser.findUnique({
            where: { email: reqEmail },
          });

          if (admin) {
            const passwordOk = await bcrypt.compare(reqPass, admin.passwordHash);
            if (passwordOk) {
              console.log('[NextAuth] Login successful for:', reqEmail);
              return { id: String(admin.id), email: admin.email, name: 'Admin' };
            }
          }
        } catch (dbErr) {
          console.error('[NextAuth] DB lookup error during login:', dbErr);
        }

        // Fallback to environment variables if set
        const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        const envHash  = (process.env.ADMIN_PASSWORD_HASH || '').trim();

        if (envEmail && envHash && reqEmail === envEmail) {
          try {
            const envPasswordOk = await bcrypt.compare(reqPass, envHash);
            if (envPasswordOk) {
              console.log('[NextAuth] Login successful via env credentials fallback for:', reqEmail);
              return { id: '1', email: envEmail, name: 'Admin' };
            }
          } catch (envErr) {
            console.error('[NextAuth] Env credential comparison error:', envErr);
          }
        }

        console.log('[NextAuth] Login failed for:', reqEmail);
        return null;
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
