import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendShiftExchangeRequest } from '@/lib/emails';
import moment from 'moment';
import { getNotification } from '@/lib/notifications';
import { authOptions } from '@/lib/authOptions';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { shiftId, requesterId, requestedUserId } = await request.json();

    if (!shiftId || !requesterId || !requestedUserId) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // 2. Add checks for valid shift and users
    const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift) {
      return new Response(JSON.stringify({ message: 'Shift not found' }), {
        status: 404,
      });
    }

    const exchangeRequest = await prisma.shiftExchangeRequest.create({
      data: {
        shiftId,
        requesterId,
        requestedUserId,
        status: 'PENDING',
      },
      include: {
        shift: true,
        requester: true,
        requestedUser: true,
      },
    });
    console.log('Exchange request😲', exchangeRequest);

    const message = getNotification({
      firstName: `${exchangeRequest.requester.firstName} ${exchangeRequest.requester.lastName}`,
      firstNameAvatarColour: `${exchangeRequest.requester.avatarColor}`,
      action: `reassigned a task to you`,
    });

    console.log('Created notification:🪗', message);
    const requestId = exchangeRequest.id;
    // const requestLink = `${process.env.NEXTAUTH_URL}/user/${pagePath}?requestId=${requestId}&action=respond`;
    const requestLink = `${process.env.NEXTAUTH_URL}/user/my-overview?requestId=${requestId}&action=respond`;

    const notification = await prisma.notification.create({
      data: {
        userId: exchangeRequest.requestedUserId,
        message: message.plainText,
        messageData: JSON.stringify(message.data),
        type: 'SHIFT_EXCHANGE_REQUEST',
        link: requestLink,
      },
    });
    console.log('Exchange request notification:💷⚔️', notification);

    // Send email using Resend
    await sendShiftExchangeRequest({
      to: exchangeRequest.requestedUser.email,
      requesterName: `${exchangeRequest.requester.firstName} ${exchangeRequest.requester.lastName}`,
      shiftDate: moment(exchangeRequest.shift.start).format('MMMM d, yyyy'),
      shiftTime: `${moment(exchangeRequest.shift.start).format(
        'h:mm a'
      )} - ${moment(exchangeRequest.shift.end).format('h:mm a')}`,
      requestId: exchangeRequest.id,
    });

    console.log('exchange request email📩📧', sendShiftExchangeRequest);

    return NextResponse.json(exchangeRequest);
  } catch (error) {
    console.error('Error creating shift exchange request:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
