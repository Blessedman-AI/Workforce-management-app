import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Check if the user making the request is authorised
    // if (!['owner', 'admin'].includes(user?.role)) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Get the role query parameter from the request
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    // Fetch users based on the role filter
    const users = await prisma.user.findMany({
      where: {
        role: role || undefined, // If no role is provided, fetch all users
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    // console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
