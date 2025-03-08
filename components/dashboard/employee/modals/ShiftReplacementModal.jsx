import { useEffect, useState } from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Search, X as XIcon } from 'lucide-react';
import { getUsers } from '@/helpers/fetchers';
import { useSession } from 'next-auth/react';
import { useShiftExchange } from '@/hooks/useShiftExchange';
import toast from 'react-hot-toast';

const ShiftReplacementModal = ({
  loadShifts,
  isOpen,
  onClose,
  shiftId,
  shiftTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState();
  const { sendExchangeRequest, loading, exchangeError } = useShiftExchange();
  const { data: session, status } = useSession();

  // console.log('✅', session);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers(); // Fetch all users
      if (data) {
        // Filter out the currently logged-in user
        const filteredCurrentUser = data.filter(
          (user) =>
            user.id !== session?.user?.id &&
            user.emailVerified &&
            user.role !== 'admin' &&
            user.role !== 'owner'
        );
        setEmployees(filteredCurrentUser);
      } else {
        setError('Failed to fetch users.');
      }
    }

    fetchUsers();
  }, [session]);

  // console.log('😉', employees);

  // Only show employees if there's a search query
  const filteredEmployees =
    searchQuery.length > 0
      ? employees.filter((employee) =>
          employee.firstName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Toggle user selection
  // const toggleUserSelection = (userId) => {
  //   if (selectedUsers.includes(userId)) {
  //     setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  //   } else {
  //     setSelectedUsers([...selectedUsers, userId]);
  //   }
  // };

  const toggleUserSelection = (employee) => {
    const isSelected = selectedUsers.some((user) => user.id === employee.id);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((user) => user.id !== employee.id));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        {
          id: employee.id,
          firstName: employee.firstName,
        },
      ]);
    }
  };

  // Deselect all users
  const deselectAll = () => {
    setSelectedUsers([]);
  };
  // console.log('selected user🔥', selectedUsers[0]?.firstName);
  // const handleSendRequest = () => {
  //   const selectedUserNames = employees
  //     .filter((employee) => selectedUsers.includes(employee.id))
  //     .map((employee) => employee.firstName);

  //   onClose();
  //   // Pass selectedUserNames to parent component
  //   onSendRequest(selectedUserNames);
  // };

  // useEffect(() => {
  //   console.log('Modal props:🔥', { shiftId, shiftTitle });
  // }, [shiftId, shiftTitle]);

  const handleSendRequest = async () => {
    if (loading) return;
    try {
      const requestedUserId = selectedUsers[0]?.id;
      const requestedUserFirstName = selectedUsers[0]?.firstName;
      // console.log('userID', requestedUserId);
      // console.log('firstName', requestedUserFirstName);

      // console.log('Attempting to send request with:✅', {
      //   shiftId,
      //   requestedUserId,
      //   requestedUserFirstName,
      // });

      // Use shiftId instead of event.id
      await sendExchangeRequest(shiftId, requestedUserId);
      toast.success(`Request sent to ${requestedUserFirstName}`);

      onClose();
      loadShifts();
    } catch (error) {
      console.error('Failed to send request:', error);
      toast.error(
        'Failed to send shift replacement request. Please try again.'
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/60">
        <div
          className="flex  min-h-full items-center justify-center
           p-4 text-center"
        >
          <DialogPanel
            className="flex flex-col w-full max-w-[50vw]  min-h-[70vh]  transform
         rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
          >
            {/* {Header} */}

            <DialogTitle
              as="h3"
              className="text-subheading-1 rounded-t-2xl px-8 py-4
                 w-full bg-purple-1 text-white font-medium leading-6
                  flex justify-between items-center mb-8"
            >
              Find a replacement
              <button
                type="button"
                className="rounded-md  text-white
                focus:border-none focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </DialogTitle>

            {/* Content */}
            <div className="px-8 flex-1 flex flex-col">
              <div className="mb-5">
                <h3 className="subheading-1 font-bold">
                  {`Select a user to replace you in your ${shiftTitle}`}
                </h3>
              </div>

              {/* Search */}
              <div className="flex-1 flex flex-col">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full  py-2 pl-2 border rounded-lg"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">
                      Available users ({employees.length})
                      {/* {searchQuery && ` • ${filteredEmployees.length} matches`} */}
                    </span>
                    {filteredEmployees.length > 0 && (
                      <button
                        onClick={deselectAll}
                        className="text-purple-1 hover:text-purple-2"
                      >
                        Deselect all
                      </button>
                    )}
                  </div>

                  {/* Only show the list if there's a search query */}
                  {searchQuery.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredEmployees.map((employee) => (
                        <label
                          key={employee.id}
                          className="flex items-center justify-between 
              space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center 
                                justify-center text-sm font-medium`}
                              style={{ backgroundColor: employee.avatarColor }}
                            ></div>
                            <span>{employee.firstName}</span>
                          </div>
                          {/* <input
                            type="checkbox"
                            checked={
                              selectedUsers.includes(employee.id) &&
                              selectedUsers.includes(employee.firstName)
                            }
                            onChange={() => toggleUserSelection(employee.id)}
                            className="rounded border-gray-300 text-purple-1"
                          /> */}
                          <input
                            type="checkbox"
                            checked={selectedUsers.some(
                              (user) => user.id === employee.id
                            )}
                            onChange={() => toggleUserSelection(employee)}
                            className="rounded border-gray-300 text-purple-1"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Show a message when no results are found */}
                  {searchQuery.length > 0 && filteredEmployees.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No users found matching {searchQuery}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3  mb-4">
                <button onClick={onClose} className="button-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={selectedUsers.length === 0 || loading}
                  className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ShiftReplacementModal;
