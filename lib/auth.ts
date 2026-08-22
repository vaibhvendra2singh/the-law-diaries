import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';



export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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

        // Look up admin in the database
        const admin = await prisma.adminUser.findUnique({
          where: { email: reqEmail },
        });

        if (!admin) {
          console.log('[NextAuth] Login failed: No admin found for email:', reqEmail);
          return null;
        }

        const passwordOk = await bcrypt.compare(reqPass, admin.passwordHash);
        if (!passwordOk) {
          console.log('[NextAuth] Login failed: Password mismatch');
          return null;
        }

        console.log('[NextAuth] Login successful for:', reqEmail);
        return { id: String(admin.id), email: admin.email, name: 'Admin' };
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
