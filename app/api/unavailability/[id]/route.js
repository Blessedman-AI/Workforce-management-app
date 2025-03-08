import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const unavailability = await prisma.unavailability.findUnique({
      where: { id: params.id },
      include: { intervals: true },
    });

    if (!unavailability) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Check if the unavailability belongs to the user
    if (unavailability.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    return NextResponse.json({ unavailability });
  } catch (error) {
    console.error('GET unavailability by ID error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify ownership
    const unavailability = await prisma.unavailability.findUnique({
      where: { id: params.id },
      include: { intervals: true },
    });

    if (!unavailability) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Check if the unavailability belongs to the user
    if (unavailability.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await prisma.unavailability.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting unavailability', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { startDate, endDate, type, intervals } = await request.json();

    // Verify ownership
    const unavailability = await prisma.unavailability.findUnique({
      where: { id: params.id },
    });

    if (!unavailability) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (unavailability.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Delete existing intervals
    await prisma.unavailabilityInterval.deleteMany({
      where: { unavailabilityId: params.id },
    });

    // Update the unavailability with new data
    const updated = await prisma.unavailability.update({
      where: { id: params.id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        type,
        intervals: {
          create: intervals
            ? intervals.map((interval) => ({
                dayOfWeek: interval.dayOfWeek,
                startTime: interval.startTime,
                endTime: interval.endTime,
              }))
            : [],
        },
      },
      include: { intervals: true },
    });

    return NextResponse.json({ unavailability: updated });
  } catch (error) {
    console.error('PUT unavailability error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
