// app/api/unavailability/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { ChartNoAxesColumnDecreasingIcon } from 'lucide-react';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const unavailabilities = await prisma.unavailability.findMany({
      where: { userId: session.user.id },
      include: { intervals: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ unavailabilities });
  } catch (error) {
    console.error('Error getting unavailabilities', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function POST(request) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const { startDate, endDate, type, intervals } = await request.json();

//     // Validate input
//     if (!startDate || !endDate) {
//       return NextResponse.json(
//         { error: 'Start date and end date are required' },
//         { status: 400 }
//       );
//     }

//     if (!['VACATION', 'RESTRICTED_HOURS'].includes(type)) {
//       return NextResponse.json(
//         { error: 'Type must be either VACATION or RESTRICTED_HOURS' },
//         { status: 400 }
//       );
//     }

//     // For RESTRICTED_HOURS, validate intervals
//     if (type === 'RESTRICTED_HOURS' && (!intervals || intervals.length === 0)) {
//       return NextResponse.json(
//         { error: 'Intervals are required for RESTRICTED_HOURS type' },
//         { status: 400 }
//       );
//     }

//     const unavailability = await prisma.unavailability.create({
//       data: {
//         userId: session.user.id,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         type,
//         intervals: {
//           create: intervals
//             ? intervals.map((interval) => ({
//                 dayOfWeek: interval.dayOfWeek,
//                 startTime: interval.startTime,
//                 endTime: interval.endTime,
//               }))
//             : [],
//         },
//       },
//       include: { intervals: true },
//     });

//     return NextResponse.json({ unavailability });
//   } catch (error) {
//     console.error('Error creating unavailability', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { startDate, endDate, type, intervals } = await request.json();

    // Validate input
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Check for overlapping vacation dates
    if (type === 'VACATION') {
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      // Find any existing vacation dates that overlap with the new date range
      const existingOverlaps = await prisma.unavailability.findMany({
        where: {
          userId: session.user.id,
          type: 'VACATION',
          // Either the existing start date falls within the new range
          // or the existing end date falls within the new range
          // or the new range falls completely within an existing range
          OR: [
            {
              AND: [
                { startDate: { lte: newEndDate } },
                { endDate: { gte: newStartDate } },
              ],
            },
          ],
        },
      });

      if (existingOverlaps.length > 0) {
        return NextResponse.json(
          {
            error: 'This date range overlaps with an existing vacation period',
          },
          { status: 400 }
        );
      }
    }

    const unavailability = await prisma.unavailability.create({
      data: {
        userId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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

    return NextResponse.json({ unavailability });
  } catch (error) {
    console.error('Error creating unavailability', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
