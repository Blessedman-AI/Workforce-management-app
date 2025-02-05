import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, ChevronDown, HelpCircle } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { X as XIcon } from 'lucide-react';

import PhoneNumberInput from '@/components/dashboard/PhoneNumberInput';
import toast from 'react-hot-toast';
import { capitalizeInitials } from '@/helpers/utils';

const AddUsers = ({
  isOpen,
  onClose,
  heading,
  description = 'Users login to the mobile and web app using their email',
  userType,
}) => {
  const [users, setUsers] = useState([
    { firstName: '', lastName: '', email: '' },
  ]);

  const [sendInvite, setSendInvite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialFormState = [{ firstName: '', lastName: '', email: '' }];

  const handleRemoveUser = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const handleAddUser = () => {
    setUsers([...users, { firstName: '', lastName: '', email: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const handleTitleSelectChange = (index, value) => {
    handleInputChange(index, 'role', value);
  };

  const handleClose = () => {
    setUsers(initialFormState);
    setSendInvite(false);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Map users and add userType to each user object
    const usersWithType = users.map((user) => ({
      ...user,
      userType, // This will use the userType prop passed to the component
    }));

    try {
      await axios.post('/api/users/add', {
        users: usersWithType,
        sendInvite,
      });

      toast.success('User added successfully!');
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      setError(errorMessage || 'Failed to add users');
      console.log('Add user error is❌', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('check send invite value', sendInvite);
  }, [sendInvite]);

  if (!isOpen) return null;

  return (
    <div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 "
        onClose={onClose}
      >
        <div className="flex justify-center items-center fixed inset-0 bg-black/60">
          <div className="flex relative items-center justify-center p-4 text-center max-w-[80vw]">
            <DialogPanel
              className="lg:max-w-[70vw] lg:min-w-[70vw] transform 
            rounded-[18px] bg-white text-left align-middle shadow-xl 
            transition-all"
            >
              <DialogTitle
                as="h2"
                className="text-subheading-2 p-4 bg-purple-1 rounded-tr-2xl rounded-tl-2xl text-white font-medium flex justify-between items-center"
              >
                {heading}
                <button
                  type="button"
                  className="rounded-md text-white"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon
                    className="h-6 w-6 hover:text-purple-4"
                    aria-hidden="true"
                  />
                </button>
              </DialogTitle>

              <div
                className="flex items-center justify-center
               h-[100px]"
              >
                <h3 className="text-subheading-1 text-grey-3">{description}</h3>
              </div>

              <div
                className="scrollbar-custom  flex justify-center items-center
                w-full   max-h-[50vh] h-auto  "
              >
                <form onSubmit={handleSubmit}>
                  <div className="max-h-[30vh] overflow-y-scroll  px-2">
                    {users.map((user, index) => (
                      <div
                        key={index}
                        className="mb-4 w-full grid grid-cols-[1fr_1fr_1fr_auto]
                       gap-x-2 items-center   text-grey-3 
                      "
                      >
                        <input
                          type="text"
                          placeholder="First name"
                          className="w-full p-2 sm:p-3 font-normal border rounded-md  "
                          value={capitalizeInitials(user.firstName)}
                          onChange={(e) => {
                            const newUsers = [...users];
                            newUsers[index].firstName = e.target.value;
                            setUsers(newUsers);
                          }}
                          required
                        />

                        <input
                          type="text"
                          placeholder="Last name"
                          className="w-full p-2 sm:p-3 font-normal border rounded-md "
                          value={capitalizeInitials(user.lastName)}
                          onChange={(e) => {
                            const newUsers = [...users];
                            newUsers[index].lastName = e.target.value;
                            setUsers(newUsers);
                          }}
                          required
                        />

                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full p-2 sm:p-3 font-normal border rounded-md "
                          value={user.email}
                          onChange={(e) => {
                            const newUsers = [...users];
                            newUsers[index].email = e.target.value;
                            setUsers(newUsers);
                          }}
                          required
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveUser(index)}
                          className="text-purple-1 hover:text-purple-3"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleAddUser}
                      className="flex items-center text-purple-1"
                    >
                      <Plus color="#8e49ff" /> Add {userType}
                    </button>
                  </div>

                  <div
                    className="py-4 pl-4 gap-4 border-t flex items-center
                   mt-8 mb-2 "
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={sendInvite}
                        id="sendInvite"
                        className="mr-2"
                        onChange={(e) => setSendInvite(e.target.checked)}
                      />
                      <label
                        htmlFor="sendInvite"
                        className="text-sm text-gray-600 mr-2"
                      >
                        Send an invite
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="plain-button-2 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="plain-button-1 disabled:bg-purple-300 disabled:border-none"
                    >
                      {loading ? 'Adding...' : 'Confirm'}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddUsers;
