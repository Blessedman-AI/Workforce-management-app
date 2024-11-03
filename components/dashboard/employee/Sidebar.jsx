'use client';

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
import { usePathname, useRouter } from 'next/navigation';

import { userSidebarLinks } from '@/utils/data.js';

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path) => path === pathname;

  return (
    <div
      className="sidebar  w-[180px] pr-2 bg-purple-2 h-screen 
     border-r border-gray-200 shadow-md overflow-y-auto flex-shrink-0"
    >
      <div className="flex items-center justify-end mb-6">
        <ChevronLeft size={20} className=" cursor-pointer" />
      </div>
      {userSidebarLinks.map((section, index) => (
        <div key={index} className="">
          {section.title && (
            <h3 className="text-xs font-semibold mb-2 uppercase">
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
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
