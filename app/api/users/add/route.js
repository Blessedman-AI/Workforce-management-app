import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { verificationEmail } from '@/lib/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { users, sendInvite } = await request.json();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid users data' },
        { status: 400 }
      );
    }

    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const { firstName, lastName, email, userType } = user;

        if (!firstName || !lastName || !email) {
          throw new Error('Missing required fields');
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error(`Email ${email} already exists`);
        }

        const verifyToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            role: userType,
            avatarColor: `#${Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, '0')}`,
            verifyToken,
            tokenExpiry,
            emailVerified: null,
            lastLogin: null,
          },
        });

        if (sendInvite) {
          const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verifyToken}`;

          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: email,
            subject: 'Welcome to Your Employee Portal',
            html: verificationEmail({ firstName, verificationUrl }),
          });
          console.log('Sending email...📩');
        }
        console.log('Email sent successfully! ✅');

        const { verifyToken: _, ...userWithoutToken } = newUser;
        return userWithoutToken;
      })
    );

    return NextResponse.json({ users: createdUsers }, { status: 200 });
  } catch (error) {
    console.error('Error adding users:❌', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
