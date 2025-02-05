'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { dummyShifts } from '@/helpers/data.js';
import Link from 'next/link';
import ReplacementConfirmationModal from './modals/ReplacementConfirmationModal';
import Greeting from '@/components/Greeting';
import BadgeButton from '../buttons/BadgeButton';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import { AssignedShifts, useAssignedShifts } from '@/helpers/utils';

const Overview = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { shifts, loading } = useAssignedShifts(); // Destructure the hook's return

  // console.log(session);
  // const shifts = AssignedShifts();
  // console.log('employee overview shifts✅', shifts);

  const requestData = {
    requesterInitials: 'DB',
    replacementInitials: 'DO',
    requesterName: 'Diokpa',
    shiftName: 'Testing shift',
    shiftStart: new Date(2024, 9, 24, 9, 0),
    shiftEnd: new Date(2024, 9, 24, 17, 0),
    shiftDuration: '8:00',
  };

  const requests = [
    {
      requesterInitials: 'DB',
      replacementInitials: 'PO',
      requesterName: 'Diokpa',
      shiftName: 'Morning shift',
      shiftStart: new Date(2024, 9, 24, 9, 0),
      shiftEnd: new Date(2024, 9, 24, 17, 0),
      shiftDuration: '8:00',
    },
    {
      requesterInitials: 'CD',
      replacementInitials: 'EF',
      requesterName: 'charlie',
      shiftName: 'Evening shift',
      shiftStart: new Date(2024, 9, 24, 17, 0),
      shiftEnd: new Date(2024, 9, 25, 1, 0),
      shiftDuration: '8:00',
    },
  ];

  const handleConfirm = (request) => {
    console.log('Confirmed request:', request);
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
  };

  // if (loading) {
  //   return (
  //     <div className="bg-teal-500 h-[100px] pt-10 m-auto">
  //       <Spinner />
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="w-full h-full py-[50px] m-auto   ">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* <Greeting name="Jane! 👋" />
      <div className="mt-4 sm:mt-0">
        <BadgeButton
          count={requests.length}
          requests={requests}
          onConfirm={handleConfirm}
          onDecline={handleDecline}
        >
          Replacements
        </BadgeButton>
      </div>{' '} */}

      <div className="w-full p-4 sm:p-6 bg-purple-2 rounded-lg shadow overflow-x-auto">
        <div className="mb-6">
          <h2 className="text-subheading-2 ">My schedule</h2>
        </div>
        {shifts.length === 0 ? (
          <div>
            <p>No shifts yet</p>
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-1 text-white text-left">
                    <th className="p-2 font-semibold">Shift</th>
                    <th className="p-2 font-semibold">Date</th>
                    <th className="p-2 font-semibold">Time</th>
                    <th className="p-2">Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts?.map((shift) => (
                    <tr
                      key={shift.id}
                      className="border-b text-left hover:bg-grey-2 cursor-pointer"
                    >
                      <td className="p-2">{shift.title}</td>
                      <td className="p-2">{shift.date}</td>
                      <td className="p-2">{shift.time}</td>
                      <td className="p-2">{shift.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="sm:hidden">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="mb-4 p-4 border rounded-lg bg-white hover:bg-grey-2 cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{shift.title}</span>
                    <Link href="/">
                      <span className="text-grey-3 hover:text-grey-3">
                        View details
                      </span>
                    </Link>
                  </div>
                  <div className="text-grey-3">{shift.date}</div>
                  <div className="mt-1 font-medium">{shift.time}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Replacement Confirmation Modal */}
      <ReplacementConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setIsOpen(false);
        }}
        onDecline={() => {
          console.log('Declined');
          setIsOpen(false);
        }}
        requestData={requestData}
      />
    </>
  );
};

export default Overview;
