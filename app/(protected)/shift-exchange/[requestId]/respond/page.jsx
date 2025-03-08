import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import ShiftExchangeResponse from '@/components/ShiftExchangeResponse';

export default async function ShiftExchangePage({ params }) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const request = await prisma.shiftExchangeRequest.findUnique({
    where: { id: params.requestId },
    include: {
      shift: true,
      requester: true,
    },
  });

  if (!request) redirect('/shifts');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shift Exchange Request</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ShiftExchangeResponse request={request} />
      </div>
    </div>
  );
}
