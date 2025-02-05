import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import NextAuth, { getServerSession } from 'next-auth/next';
import EmailProvider from 'next-auth/providers/email';
import { NextResponse } from 'next/server';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('User does not exist');
        }

        // Check if user has a password set
        // if (!user.password) {
        //   throw new Error(
        //     'Please check your email to complete your registration'
        //   );
        // }

        // if (
        //   (user.role === 'user' || user.role === 'admin') &&
        //   !user.emailVerified
        // ) {
        //   throw new Error(
        //     'Please verify your email to complete your account setup'
        //   );
        // }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('One or more fields are incorrect');
        }

        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // console.log('Authorized User:✅', user);

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: user.image,
          avatarColor: user.avatarColor,
          lastLogin: user.lastLogin,
        };
      },
    }),

    EmailProvider({
      server: {
        async sendVerificationRequest({
          identifier: email,
          url,
          provider: { from },
        }) {
          // Only send verification email if user exists and doesn't have a password set
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error('User not found');
          }

          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
              to: email,
              subject: 'Sign in to Your App',
              html: `
                <h2>Welcome to Your App</h2>
                <p>Click the link below to sign in:</p>
                <p><a href="${url}">Sign in to Your App</a></p>
                <p>If you didn't request this email, you can safely ignore it.</p>
              `,
            });
          } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new Error('Failed to send verification email');
          }
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signup: '/signup',
  },

  callbacks: {
    async session({ session, token }) {
      try {
        // Check if user still exists in database
        const user = await prisma.user.findUnique({
          where: { id: token.id },
          // include: { assignedShifts: true },
          include: {
            assignedShifts: {
              include: {
                createdByUser: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    // Add any other user fields you want
                  },
                },
                assignedToUser: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    // Add any other user fields you want
                  },
                },
              },
              orderBy: {
                start: 'asc',
              },
            },
          },
        });

        // If user doesn't exist, return an empty but valid session object
        if (!user) {
          console.log('User not found in database');
          return {
            expires: new Date(0).toISOString(), // Expired session
            user: null,
          };
        }

        // If user exists, continue with normal session
        // console.log('User found, returning session');
        return {
          ...session,
          user: {
            email: session.user.email,
            id: token.id,
            firstName: token.firstName,
            lastName: token.lastName,
            role: token.role,
            image: token.image,
            avatarColor: token.avatarColor,
            lastLogin: token.lastLogin,
            assignedShifts: user?.assignedShifts,
          },
        };
      } catch (error) {
        console.error('Session callback error:', error);
        // Return expired session on error
        return {
          expires: new Date(0).toISOString(),
          user: null,
        };
      }
    },

    async jwt({ token, user, account }) {
      // console.log('JWT Callback - Incoming User:', user);
      // console.log('JWT Callback - Incoming Account:', account);
      // console.log('JWT Callback - Existing Token:', token);

      // If user is available during initial sign-in, populate token
      if (user) {
        return {
          ...token,
          id: user.id || token.sub,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: user.image,
          avatarColor: user.avatarColor,
          lastLogin: user.lastLogin,
        };
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
9;
