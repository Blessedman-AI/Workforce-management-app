import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { validatePassword } from '@/helpers/utils';
import { generateUserColor } from '@/helpers/colors';

export async function POST(req) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    console.log('Received data:', { email, password, firstName, lastName });

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return Response.json(
        {
          error: 'Password is too weak',
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate a random color for the user
    const avatarColor = generateUserColor();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'owner',
        avatarColor,
      },
    });
    console.log('route.js sign up🔥:', user);

    return Response.json(
      { message: 'User created and signed in successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Detailed signup error:', error);
    console.error('Error stack:', error.stack);
    return Response.json({ error: 'Error creating user' }, { status: 500 });
  }
}
