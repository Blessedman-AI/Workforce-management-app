import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
        tokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Hash password and update user
    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
        verifyToken: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
