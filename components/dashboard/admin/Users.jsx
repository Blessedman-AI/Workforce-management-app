'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { dummyShifts } from '@/helpers/data.js';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getUser } from '@/helpers/fetchers';
import Spinner from '@/components/Spinner';
import {
  UserPlus,
  Crown,
  CheckSquare,
  Mail,
  ChevronDown,
  Filter,
  MoreVertical,
  Search,
  X,
} from 'lucide-react';

import { formatDateAdded, formatLastLogin } from '@/helpers/utils';
import ErrorBoundary from '@/components/ErrorBoundary';
import AddUsers from './AddUsers';
import DropdownMenu from '@/components/DropdownMenu';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('users');
  const [counts, setCounts] = useState({ users: 0, admins: 0, archived: 0 });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAddUsersButtonOpen, setIsAddUsersButtonOpen] = useState(false);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);

  const archived = [];

  const openAddUsersModal = () => {
    setIsUserModalOpen(true);
  };

  const closeAddUsersModal = () => {
    setIsUserModalOpen(false);
  };
  //   useEffect(() => {
  //     const fetchUserDetails = async () => {
  //       try {
  //         const userdetails = await getUser(); // Add await here
  //         setUser(userdetails);
  //         setLoading(false);
  //       } catch (err) {
  //         setError(err);
  //         setLoading(false);
  //       }
  //     };

  //     fetchUserDetails();
  //   }, [status]);

  // console.log('🔥', user);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await axios.get('/api/users');
      const usersData = response.data;
      // console.log('Users data:😉', usersData);

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCounts({
      users: users.filter(
        (user) => user.role === 'employee' && user.deletedAt === null
      ).length,
      admins: users.filter(
        (user) => user.role === 'admin' && user.deletedAt === null
      ).length,
      archived: users.filter((user) => user.deletedAt !== null).length,
    });
  }, [users]); // Update counts whenever users data changes

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center items-center w-full ">
        <Spinner />
      </div>
    );
  }
  const renderContent = () => {
    let data = [];
    switch (activeTab) {
      case 'users':
        data = users.filter(
          (user) => user.role === 'employee' && user.deletedAt === null
        );
        break;
      case 'admins':
        data = users.filter(
          (user) => user.role === 'admin' && user.deletedAt === null
        );
        break;
      case 'archived':
        data = users.filter((user) => user.deletedAt !== null);
        break;
    }

    // Then filter by search term
    if (searchTerm) {
      data = data.filter((user) => {
        const searchValue = searchTerm.toLowerCase();
        return (
          user.firstName?.toLowerCase().includes(searchValue) ||
          user.lastName?.toLowerCase().includes(searchValue) ||
          user.email?.toLowerCase().includes(searchValue)
        );
      });
    }

    // Sort users by lastLogin in descending order
    // Users with no login will appear at the end
    data.sort((a, b) => {
      // If both users have never logged in, keep original order
      if (!a.lastLogin && !b.lastLogin) return 0;
      // If only a has never logged in, put b first
      if (!a.lastLogin) return 1;
      // If only b has never logged in, put a first
      if (!b.lastLogin) return -1;
      // Otherwise sort by login date descending
      return new Date(b.lastLogin) - new Date(a.lastLogin);
    });

    if (data.length === 0) {
      return (
        <div className="w-full text-center py-8 text-grey-3">
          No users found{searchTerm ? ` matching "${searchTerm}"` : ''}
        </div>
      );
    }
    if (users < 1) {
      return <Spinner />;
    }
    // console.log(users);

    return (
      <>
        {users && (
          <table className="w-full  ">
            <thead className="bg-purple-1 text-white-1">
              <tr className="border-b">
                <th className="w-8 p-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left p-4">First name</th>
                <th className="text-left p-4">Last name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Date added</th>
                <th className="text-left p-4">
                  Last login
                  {/* <ChevronDown className="inline ml-1 h-4 w-4" /> */}
                </th>
                <th className="w-8 p-4"></th>
              </tr>
            </thead>

            <tbody>
              {data.map((user) => (
                <tr key={user.id} className="border-b hover:bg-grey-2">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: user?.avatarColor }}
                    >
                      {user.initials}
                    </div>
                    {user.firstName}
                  </td>
                  <td className="p-4">{user.lastName}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{formatDateAdded(user.createdAt)}</td>
                  <td className="p-4">{formatLastLogin(user.lastLogin)}</td>
                  <td className="p-4">
                    <button className="p-1 hover:bg-grey-2 rounded">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  };

  return (
    <>
      {users && (
        <div className="w-full  bg-white py-12 rounded-lg">
          <div className="border-b">
            <div className="flex items-center justify-between bg-purple-2 rounded-lg ">
              <button
                className={`w-full flex items-center justify-center  py-4
               -mb-px rounded-t-lg ${
                 activeTab === 'users'
                   ? 'bg-white text-purple-1'
                   : 'text-purple-4'
               }`}
                onClick={() => setActiveTab('users')}
              >
                USERS ({counts.users})
              </button>
              <button
                className={`w-full flex items-center justify-center  py-4
              -mb-px rounded-t-lg ${
                activeTab === 'admins'
                  ? 'bg-white text-purple-1'
                  : 'text-purple-4'
              }`}
                onClick={() => setActiveTab('admins')}
              >
                ADMINS ({counts.admins})
              </button>
              <button
                className={`w-full flex items-center justify-center  py-4
              -mb-px rounded-t-lg ${
                activeTab === 'archived'
                  ? 'bg-white text-purple-1'
                  : 'text-purple-4'
              }`}
                onClick={() => setActiveTab('archived')}
              >
                ARCHIVED ({counts.archived})
              </button>
            </div>
          </div>

          <div className="p-4 flex   items-center">
            <div className="flex justify-between w-full items-center  gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-grey-3" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-grey-3 hover:text-purple-1 "
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative ">
                <button
                  onClick={() => setIsAddUsersButtonOpen(!isAddUsersButtonOpen)}
                  className="button-primary py-[6px]"
                  ref={buttonRef}
                >
                  Add users
                  <ChevronDown
                    className={`inline ml-1 h-4 w-4 transition-transform ${
                      isAddUsersButtonOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <ErrorBoundary>
                  <DropdownMenu
                    isOpen={isAddUsersButtonOpen}
                    onClose={() => setIsAddUsersButtonOpen(false)}
                    triggerRef={buttonRef}
                    onAddStaff={() => setIsUserModalOpen(true)}
                    onAddAdmin={() => setIsAdminModalOpen(true)}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          <div className="users-table mt-4  h-[250px] overflow-scroll ">
            {renderContent()}
          </div>
          <ErrorBoundary>
            <AddUsers
              isOpen={isUserModalOpen}
              onClose={() => setIsUserModalOpen(false)}
              heading="Add more employees"
              description="Employees login to the mobile and web app using their email"
              userType="employee"
            />
            <AddUsers
              isOpen={isAdminModalOpen}
              onClose={() => setIsAdminModalOpen(false)}
              heading="Add more admins"
              description="Only admins can login to the Launch pad using desktop or laptop"
              userType="admin"
            />
          </ErrorBoundary>
        </div>
      )}
    </>
  );
};

export default UsersTable;
