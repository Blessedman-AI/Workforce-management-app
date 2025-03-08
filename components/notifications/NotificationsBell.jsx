import { useState, useEffect } from 'react';
import { Bell, Clock, Calendar, ArrowLeftRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { getInitials, NotificationMessage } from '@/helpers/utils';
import { useClickOutside } from '@/hooks/useClickOutside';

const NotificationsBell = ({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  triggerRefetch,
}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const getIconForType = (type) => {
    switch (type) {
      case 'SHIFT_EXCHANGE_RESPONSE':
      case 'SHIFT_EXCHANGE_REQUEST':
        return <ArrowLeftRight size={14} className="text-white" />;
      case 'NEW_MESSAGE':
        return <Mail size={14} className="text-white" />;
      case 'TASK_ASSIGNED':
        return <Calendar size={14} className="text-white" />;
      default:
        return null; // Return nothing if no match
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    // Mark all as read after 8 seconds when opening the bell
    if (!isOpen && notifications.length > 0) {
      setTimeout(() => {
        markAllAsRead();
      }, 8000);
    }
  };

  const dropdownRef = useClickOutside(() => {
    setIsOpen(false);
  });

  // console.log('Notifications 🛎️🔔', notifications);

  const renderNotificationMessage = (notification) => {
    if (notification.messageData) {
      try {
        const data = JSON.parse(notification.messageData);
        const initials = getInitials(data.firstName);
        const backgroundColour = data.firstNameAvatarColour;

        return (
          <div className="flex items-center space-x-3 ">
            <div className="relative">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full
              flex items-center justify-center"
                style={{ backgroundColor: backgroundColour }}
              >
                <span className="text-white text-sm font-medium">
                  {initials}
                </span>
              </div>
              <div
                className="absolute -bottom-1 -right-1 bg-purple-3
                 rounded-full p-[2px]"
              >
                {notification?.type ? getIconForType(notification.type) : null}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start space-x-1">
                <span className="">{data.firstName}</span>
                <span className="">{data.status}</span>
                <span className="">{data.action}</span>
              </div>
            </div>
          </div>
        );
      } catch (error) {
        console.error('Failed to parse messageData:', error);
        return <p>{notification.message}</p>;
      }
    }
    return <p>{notification.message}</p>;
  };

  // };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-purple-2"
      >
        <Bell size={22} className="text-grey-3" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-[-2px] -right-[-0.1px] bg-purple-3
             text-white text-xs rounded-full h-4 w-4 flex 
             items-center justify-center"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 flex flex-col justify-between
           mt-2 py-4 w-[400px] bg-white-1 rounded-lg shadow-lg
            z-50 h-96 overflow-y-auto"
        >
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-grey-3 text-center">
                No new notifications
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      // markAsRead(notification.id);
                      if (notification.link) {
                        router.push(notification.link);
                      }
                    }}
                    className={`px-4 py-2 hover:bg-purple-2 cursor-pointer ${
                      !notification.read ? 'bg-purple-2' : ''
                    }`}
                  >
                    <div className="text-sm">
                      {notification.messageData ? (
                        renderNotificationMessage(notification)
                      ) : (
                        <p>{notification.message}</p>
                      )}
                    </div>
                    <div
                      className="text-xs ml-[44px] p-0 mt-[-4px]
                     text-gray-500 "
                    >
                      {moment(notification.createdAt).fromNow()}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="w-full p-2 text-sm text-purple-600 hover:bg-gray-50"
              >
                Clear all notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
