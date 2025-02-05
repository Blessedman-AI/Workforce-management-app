import { useState } from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Search, X as XIcon } from 'lucide-react';
import { employees } from '@/helpers/data';

const ShiftReplacementModal = ({ isOpen, onClose, event, onSendRequest }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Only show employees if there's a search query
  const filteredEmployees =
    searchQuery.length > 0
      ? employees.filter((employee) =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Deselect all users
  const deselectAll = () => {
    setSelectedUsers([]);
  };

  const handleSendRequest = () => {
    const selectedUserNames = employees
      .filter((employee) => selectedUsers.includes(employee.id))
      .map((employee) => employee.name);

    onClose();
    // Pass selectedUserNames to parent component
    onSendRequest(selectedUserNames);
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
                  {`Select a user to replace you in your ${event?.title}`}
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
                        className="text-blue-500 hover:text-blue-600"
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
                            <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                              {employee.avatar}
                            </div>
                            <span>{employee.name}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(employee.id)}
                            onChange={() => toggleUserSelection(employee.id)}
                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Show a message when no results are found */}
                  {searchQuery.length > 0 && filteredEmployees.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No users found matching "{searchQuery}"
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
                  disabled={selectedUsers.length === 0}
                  className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send request
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
