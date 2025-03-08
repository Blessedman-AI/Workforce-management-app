// app/api/shift-exchange/request/[requestId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request, { params }) {
  // console.log('API route hit, params😒:', params);
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { requestId } = params;
    // console.log('Fetching request with ID✅:', requestId);

    const exchangeRequest = await prisma.shiftExchangeRequest.findUnique({
      where: { id: requestId },
      // include: {
      //   shift: true,
      //   requester: true,
      //   requestedUser: true,
      // },
      include: {
        shift: {
          include: {
            createdByUser: true, // This will include the user who created the shift
          },
        },
        requester: true,
        requestedUser: true,
      },
    });

    if (!exchangeRequest) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exchangeRequest);
  } catch (error) {
    console.error('Error fetching exchange request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  const userId = session.user.id;
  const { requestId } = params;
  // console.log('sessison📩', session);
  // console.log('userId💵', userId);
  // console.log('cancel request endpoint hit!📧');
  // console.log('Received params:🏀', params); // Add this log
  // console.log('RequestId:', params.requestId); // Add this log
  try {
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const exchangeRequest = await prisma.shiftExchangeRequest.findUnique({
      where: { id: requestId },
    });
    console.log('Found exchange request:', exchangeRequest);

    if (!exchangeRequest) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    if (exchangeRequest.requesterId !== userId) {
      return NextResponse.json(
        { message: 'Not authorized to cancel this request' },
        { status: 403 }
      );
    }

    if (exchangeRequest.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Only pending requests can be cancelled' },
        { status: 400 }
      );
    }

    // Update the exchange request - using the same model as above
    const updatedExchangeRequest = await prisma.shiftExchangeRequest.update({
      where: { id: requestId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Exchange request cancelled successfully',
      exchange: updatedExchangeRequest,
    });
  } catch (error) {
    console.error('Error cancelling shift exchange:', error);
    return NextResponse.json(
      { message: 'Error cancelling exchange request' },
      { status: 500 }
    );
  }
}
