'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationApiService, Notification } from '@/services/notificationApiService';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread count for badge
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApiService.getUnreadCount();
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Fetch notifications when dropdown opens
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApiService.getNotifications({
        page: 1,
        limit: 10,
        unreadOnly: false
      });
      
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationApiService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Handle dropdown open
  const handleDropdownOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchNotifications();
    }
  };

  // Handle SSE unread count updates
  const handleUnreadCountUpdate = () => {
    fetchUnreadCount();
  };

  // Fetch unread count on component mount and subscribe to SSE updates
  useEffect(() => {
    fetchUnreadCount();
    
    // Subscribe to SSE unread count updates
    notificationService.onUnreadCountChange(handleUnreadCountUpdate);
    
    return () => {
      notificationService.offUnreadCountChange(handleUnreadCountUpdate);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => handleDropdownOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-6 px-2"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                          {notification.title}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}