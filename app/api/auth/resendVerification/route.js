// app/api/auth/resend-verification/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';
import { render } from '@react-email/render';
import { UserVerificationEmail } from '@/lib/resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();
    

    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifyToken,
        tokenExpiry,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verifyToken}`;
    
    
    const emailHtml = await render(UserVerificationEmail({
      firstName: user.firstName,
      verificationUrl,
    }));

    // console.log('Rendered HTML:', emailHtml)


    const emailResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Your Employee Portal',
      html: emailHtml,
  
    });
  
    console.log('Sending email...📩');
    console.log('Email Send Response:💕📝', emailResponse);

    if (!emailResponse?.data?.id) {
      throw new Error('Failed to send email: No response ID received');
    }

    return NextResponse.json({
      message: 'Verification email sent successfully',
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
