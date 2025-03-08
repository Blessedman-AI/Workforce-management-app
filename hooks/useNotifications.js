// hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const pathname = usePathname();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get('/api/notifications');
      // console.log('Fetched notifications:🔫🛎️💵', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.put('/api/notifications', {
        notificationIds: [notificationId],
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const notificationIds = notifications.map((n) => n.id);
      await axios.put('/api/notifications', { notificationIds });
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  // Add clear all function
  const clearAllNotifications = useCallback(async () => {
    try {
      await axios.delete('/api/notifications');
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, []);

  const triggerRefetch = useCallback(() => {
    setShouldRefetch(true);
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      fetchNotifications();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    triggerRefetch,
  };
};
