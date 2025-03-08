import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendShiftExchangeResponse } from '@/lib/emails';
import moment from 'moment';
import { revalidatePath } from 'next/cache';
import {
  getNotification,
  getShiftExchangeResponseNotif,
} from '@/lib/notifications';

export async function GET(request, { params }) {
  const requestId = params.requestId;

  if (!requestId) {
    return NextResponse.json(
      { message: 'Request ID is required' },
      { status: 400 }
    );
  }

  try {
    const exchangeRequest = await prisma.shiftExchangeRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        status: true,
        respondedAt: true,
        shift: {
          select: {
            date: true,
            startTime: true,
            endTime: true,
            requester: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!exchangeRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(exchangeRequest);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { requestId } = params;
    const { status } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { message: 'Request ID is required' },
        { status: 400 }
      );
    }
    console.log('requestId 🔴', requestId);
    console.log('Status 👽', status);

    const exchangeRequest = await prisma.shiftExchangeRequest.findUnique({
      where: { id: requestId },
      include: {
        shift: true,
        requester: true,
        requestedUser: true,
      },
    });

    console.log('exchange request📧', exchangeRequest);

    if (!exchangeRequest) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    if (exchangeRequest.status === 'CANCELLED') {
      return NextResponse.json(
        { message: 'This shift exchange request has been cancelled' },
        { status: 409 }
      );
    }

    const updatedRequest = await prisma.shiftExchangeRequest.update({
      where: { id: requestId },
      data: {
        status,
        availableForOthers: status === 'REJECTED', // true if rejected, false if accepted
        rejectedAt: status === 'REJECTED' ? new Date() : null,
        respondedAt: new Date(),
      },
    });

    if (status === 'ACCEPTED') {
      await prisma.shift.update({
        where: { id: exchangeRequest.shiftId },

        data: {
          assignedToUser: {
            connect: {
              id: exchangeRequest.requestedUserId,
            },
          },
        },
      });
    }

    const message = getNotification({
      firstName: `${exchangeRequest.requestedUser.firstName} ${exchangeRequest.requestedUser.lastName}`,
      firstNameAvatarColour: `${exchangeRequest.requestedUser.avatarColor}`,
      status,
      action: `your shift exchange request`,
    });

    console.log('Created notification:🪗', message);

    // Create notifications for relevant users
    const notification = await prisma.notification.create({
      data: {
        userId: exchangeRequest.requesterId,
        message: message.plainText,
        messageData: JSON.stringify(message.data),
        type: 'SHIFT_EXCHANGE_RESPONSE',
        link: updatedRequest.respondedAt ? '' : '/user/my-schedule',
      },
    });
    console.log('Created notification:', notification);

    await sendShiftExchangeResponse({
      to: exchangeRequest.requester.email,
      responderName: `${exchangeRequest.requestedUser.firstName} ${exchangeRequest.requestedUser.lastName}`,
      status: status?.toLowerCase(),
      shiftDate: moment(exchangeRequest.shift.start).format('MMMM d, yyyy'),
      shiftTime: `${moment(exchangeRequest.shift.start).format(
        'h:mm a'
      )} - ${moment(exchangeRequest.shift.end).format('h:mm a')}`,
    });

    console.log('sendShiftExchangeResponse📝💵', sendShiftExchangeResponse);

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error responding to shift exchange request:', error);
    revalidatePath('/user/my-overview');

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
