'use client';

import { usePathname, useRouter } from 'next/navigation';

import {
  Grid,
  BarChart2,
  Users,
  UserPlus,
  UserGroup,
  MessageSquare,
  Mail,
  Book,
  Clock,
  Calendar,
  CheckSquare,
  PlusCircle,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

import { adminSidebarLinks } from '@/helpers/data';

const AdminSidebar = () => {
  const pathname = usePathname();
  const isActive = (path) => path === pathname;
  return (
    // <div
    //   className="sidebar z-0  w-[200px] pr-2 bg-purple-2 min-h-full
    //  border-r border-gray-200 shadow-md overflow-y-auto flex-shrink-0"
    // >
    <div
      className="sidebar w-[200px] pr-2 pt-[76px] bg-purple-2 min-h-full 
     border-r border-gray-200 shadow-md overflow-y-auto flex-shrink-0
     fixed top-0 left-0 h-screen"
    >
      <div className="flex items-center justify-end mb-6">
        <ChevronLeft size={20} className=" cursor-pointer" />
      </div>
      {adminSidebarLinks.map((section, index) => (
        <div key={index} className="">
          {section.title && (
            <h3 className="text-xs font-semibold mb-2 ml-4 uppercase">
              {section.title}
            </h3>
          )}

          <div>
            {section.items.map((item, itemIndex) => (
              <Link
                href={item.path ? item.path : '/'}
                key={itemIndex}
                className={`text-sm flex items-center  rounded py-1.5 
                  px-3 cursor-pointer hover:bg-grey-2 ${
                    isActive(item.path) ? 'bg-grey-2' : ''
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center mr-3`}
                  style={{ backgroundColor: item.bgColor }}
                >
                  <item.icon size={20} color={item.color} />
                </div>
                {item.name}
              </Link>
            ))}

            {section.items.length > 0 && (
              <div className="w-full flex items-center mt-2">
                <hr className="h-0.5 bg-grey-1  my-4 w-full" />
              </div>
            )}
          </div>

          {/* <ul>
            {section.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="flex items-center  rounded py-2 px-3 cursor-pointer"
              >
                <Link
                  href="/"
                  className={`w-8 h-8 rounded-md flex items-center justify-center mr-3`}
                  style={{ backgroundColor: item.bgColor }}
                >
                  <item.icon size={20} color={item.color} />
                </Link>
                <span className="text-sm">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-purple-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {item.badge}
                  </span>
                )}
              </li>
            ))}
            {section.items.length > 0 && (
              <div className="w-full flex items-center mt-2">
                <hr className="h-0.5 bg-grey-1  my-4 w-full" />
              </div>
            )}
          </ul> */}
        </div>
      ))}
    </div>
  );
};

export default AdminSidebar;
