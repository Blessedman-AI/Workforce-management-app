import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, HelpCircle } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { X as XIcon } from 'lucide-react';

import PhoneNumberInput from '@/components/dashboard/PhoneNumberInput';

const AddUsers = ({
  isOpen,
  onClose,
  heading = 'Add new users',
  description = 'Users login to the mobile and web app using their mobile phone number',
  showTitleSelect = false,
  selectOptions = [],
  onTitleSelectChange,
  userType = 'user',
}) => {
  const [users, setUsers] = useState([
    { firstName: '', lastName: '', mobilePhone: '', email: '', title: '' },
  ]);

  const addUser = () => {
    setUsers([
      ...users,
      { firstName: '', lastName: '', mobilePhone: '', email: '', title: '' },
    ]);
  };

  const removeUser = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const handleInputChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const handleTitleSelectChange = (index, value) => {
    handleInputChange(index, 'role', value);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        <div
          className="flex justify-center  items-center fixed inset-0
         bg-black/60 "
        >
          <div
            className="flex relative items-center justify-center
           p-4 text-center max-w-[80vw]"
          >
            <DialogPanel
              className="w-[80vw] min-w-[80vw] max-w-[80vw] transform rounded-[18px]
               bg-white text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h2"
                className="text-lg p-3  w-full bg-purple-1
                 rounded-tr-2xl rounded-tl-2xl text-white font-medium
           leading-6 flex justify-between items-center mb-8"
              >
                {heading}
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

              <div className="flex items-center justify-center">
                <h3 className="text-subheading-1 mb-10 text-gray-600">
                  {description}
                </h3>
              </div>
              <div
                className="scrollbar-custom  pb-8  justify-center
                 w-full overflow-auto px-4 max-h-[50vh] h-[50vh]"
              >
                <div className="   ">
                  {/* <div
                    className="mb-4 gap-x-8 w-full grid grid-cols-5 
                  font-semibold text-gray-600  whitespace-nowrap"
                  > */}
                  <div
                    className={`mb-4 w-full grid ${
                      showTitleSelect
                        ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]'
                        : 'grid-cols-[1fr_1fr_1fr_1fr_auto]'
                    } gap-x-2 items-center font-semibold text-gray-600`}
                  >
                    <div className="px-2 pb-2">First name*</div>
                    <div className="px-2 pb-2">Last name*</div>
                    <div className="px-2 pb-2">Mobile phone*</div>
                    <div className="px-2 pb-2">Email</div>
                    {showTitleSelect && <div className="px-2 pb-2">Title</div>}
                    <div className="w-8"></div>
                  </div>

                  {users.map((user, index) => (
                    <div
                      key={index}
                      className={`mb-4 w-full grid ${
                        showTitleSelect
                          ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]'
                          : 'grid-cols-[1fr_1fr_1fr_1fr_auto]'
                      } gap-x-2 items-center font-semibold text-gray-600`}
                    >
                      <input
                        type="text"
                        placeholder="First name"
                        className="p-2 border rounded-lg w-full text-[14px]"
                        value={user.firstName}
                        required
                        onChange={(e) =>
                          handleInputChange(index, 'firstName', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        className="p-2 border rounded-lg w-full  text-[14px]"
                        value={user.lastName}
                        required
                        onChange={(e) =>
                          handleInputChange(index, 'lastName', e.target.value)
                        }
                      />
                      <div className="flex relative ">
                        <PhoneNumberInput />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="email"
                          placeholder="Email"
                          className="p-2 border rounded-lg w-full text-[14px]"
                          value={user.email}
                          onChange={(e) =>
                            handleInputChange(index, 'email', e.target.value)
                          }
                        />
                      </div>
                      {showTitleSelect && (
                        <div className="flex items-center justify-center">
                          <select
                            className=" p-[10px] border rounded-lg w-full text-[14px]"
                            onChange={(e) =>
                              handleTitleSelectChange(index, e.target.value)
                            }
                          >
                            {selectOptions.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        onClick={() => removeUser(index)}
                        className=" text-gray-400
                           hover:text-gray-600 justify-self-start"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={addUser}
                    className="flex items-center
                  text-purple-1"
                  >
                    <Plus color="#8e49ff" />
                    Add {userType}
                  </button>
                </div>
              </div>

              <div className=" py-4 pl-4 gap-4 border-t flex items-center">
                <div className="flex items-center">
                  <input type="checkbox" id="sendInvite" className="mr-2" />
                  <label
                    htmlFor="sendInvite"
                    className="text-sm
                   text-gray-600 mr-2"
                  >
                    Send an invite
                  </label>{' '}
                  <button className="button-secondary mr-2">Cancel</button>
                  <button className="button-primary">Confirm</button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddUsers;
