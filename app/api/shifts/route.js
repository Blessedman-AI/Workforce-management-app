import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { Resend } from 'resend';
import {
  checkUnavailabilityConflict,
  verificationEmail,
} from '@/helpers/utils';
import { getNotification, getShiftCreationNotif } from '@/lib/notifications';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// GET all shifts

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAuthorised =
      session.user.role === 'admin' || session.user.role === 'owner';
    const userId = session.user.id;

    // Different queries based on role
    const shifts = await prisma.shift.findMany({
      where: isAuthorised
        ? {} // Admin sees all shifts
        : { assignedToUser: { id: userId } }, // Users see only their assigned shifts
      include: {
        assignedToUser: true,
        createdByUser: true,
        exchangeRequests: {
          where: {
            status: 'PENDING',
          },
          select: {
            id: true,
            status: true,
            // ... any other fields you need
          },
        },
      },
      orderBy: {
        start: 'asc',
      },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Shifts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

//Create a new shift
export async function POST(request) {
  // console.log('shiftNotificationEmail:', typeof shiftNotificationEmail);
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'owner' && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      date,
      employee,
      shiftType,
      startTime,
      endTime,
      breaks,
      description,
      repeatShift = false,
      repeatFrequency = 'day',
      sendNotification = false,
    } = await request.json();

    // Combine date and times to create full datetime objects
    const shiftStart = new Date(`${date}T${startTime}`);
    const shiftEnd = new Date(`${date}T${endTime}`);

    // Fetch user with unavailabilities
    const userWithUnavailabilities = await prisma.user.findUnique({
      where: { id: employee },
      select: {
        unavailabilities: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (userWithUnavailabilities?.unavailabilities.length > 0) {
      const hasUnavailabilityConflict = checkUnavailabilityConflict(
        shiftStart,
        shiftEnd,
        userWithUnavailabilities.unavailabilities
      );

      console.log('User with unavailabilities🩸', hasUnavailabilityConflict);

      if (hasUnavailabilityConflict) {
        return NextResponse.json(
          {
            error: `${userWithUnavailabilities.firstName} ${userWithUnavailabilities.lastName} is unavailable during this time.`,
            unavailabilities: userWithUnavailabilities.unavailabilities,
          },
          { status: 400 }
        );
      }
    }

    // Fetch the assigned user to get their name for the title
    const assignedUser = await prisma.user.findUnique({
      where: { id: employee }, // employee should now be the user ID
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!assignedUser) {
      return NextResponse.json(
        { error: 'Please select an employee' },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        start: new Date(`${date}T${startTime}`),
        end: new Date(`${date}T${endTime}`),
        title: `${assignedUser.firstName} ${assignedUser.lastName} - ${shiftType}`,
        description,
        assignedToUserId: employee,
        createdByUserId: user.id,
        break: breaks,
        shiftType,
        repeatShift,
        repeatFrequency,
        sendNotification,
      },

      include: {
        assignedToUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarColor: true,
          },
        },
      },
    });

    const message = getNotification({
      firstName: `${shift.createdByUser.firstName} ${shift.createdByUser.lastName}`,
      firstNameAvatarColour: `${shift.createdByUser.avatarColor}`,
      action: `assigned a shift to you`,
    });

    // console.log('message🩸🪗', message);
    // console.log('shift.createdBy💵', shift.createdByUser);

    // Create notifications for relevant users
    const notification = await prisma.notification.create({
      data: {
        userId: shift.assignedToUserId,
        message: message.plainText,
        messageData: JSON.stringify(message.data),
        type: 'TASK_ASSIGNED',
        link: '/user/my-schedule',
      },
    });
    console.log('Notification created 💵🥇', notification);

    // Send email notification if sendNotification is true
    if (sendNotification) {
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      const formattedStart = startDateTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });

      const formattedEnd = endDateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });

      const dashboardURL = process.env.NEXTAUTH_URL;

      console.log('Preparing to send shift notification email...📩');

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: assignedUser.email,
          subject: `New Shift Assignment: ${shiftType}`,
          html: `
            <h2>New Shift Assignment</h2>
            <p>Hello ${assignedUser.firstName},</p>
            <p>You have been assigned a new ${shiftType} shift.</p>
            <p><strong>When:</strong> ${formattedStart} - ${formattedEnd}</p>
            ${
              description
                ? `<p><strong>Description:</strong> ${description}</p>`
                : ''
            }
            ${
              breaks
                ? `<p><strong>Break duration:</strong> ${breaks} minutes</p>`
                : ''
            }
            <p><strong>Assigned by:</strong> ${shift.createdByUser.firstName} ${
              shift.createdByUser.lastName
            }</p>
            ${
              repeatShift
                ? `<p><strong>This shift repeats:</strong> Every ${repeatFrequency}</p>`
                : ''
            }
       <p><a href="${dashboardURL}" style="padding: 10px 20px; 
       margin-top: 30px; background-color: #8e49ff; color: white; 
       text-decoration: none; border-radius: 5px;">Go to your dashboard</a></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue with the response even if email fails
      }
    }

    console.log('Email sent successfully!');

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error('Shift creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create shift' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== 'owner' && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      id,
      date,
      startTime,
      endTime,
      description,
      employee,
      breaks,
      shiftType,
      repeatShift,
      repeatFrequency,
      sendNotification,
    } = await request.json();

    const shift = await prisma.shift.update({
      where: { id },
      data: {
        start: new Date(`${date}T${startTime}`),
        end: new Date(`${date}T${endTime}`),
        description,
        assignedToUser: {
          connect: { id: employee },
        },
        break: parseInt(breaks) || 0,
        shiftType,
        repeatShift,
        repeatFrequency,
        sendNotification,
      },
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });
    // Make sure all fields are included in the response
    return NextResponse.json({
      ...shift,
      start: shift.start,
      end: shift.end,
      break: shift.break,
      description: shift.description,
      repeatShift: shift.repeatShift,
      repeatFrequency: shift.repeatFrequency,
      sendNotification: shift.sendNotification,
      shiftType: shift.shiftType,
      assignedToUser: shift.assignedToUser,
      createdByUser: shift.createdByUser,
    });
    // return NextResponse.json(shift);
  } catch (error) {
    console.error('Shift update error:', error);
    return NextResponse.json(
      { error: 'Failed to update shift' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!['owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const shift = await prisma.shift.findUnique({
      where: {
        id,
        createdByUserId: session.user.id,
      },
    });

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }
    await prisma.shift.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Shift deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shift' },
      { status: 500 }
    );
  }
}
