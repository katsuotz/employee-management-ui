import { api } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  jobId?: string;
  metadata?: unknown;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

export const notificationApiService = {
  // Get all notifications for the authenticated user
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<NotificationListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly.toString());
    
    const url = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<NotificationListResponse>(url);
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    return api.get<{ unreadCount: number }>('/notifications/unread-count');
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string }> => {
    return api.patch<{ message: string }>('/notifications/read-all');
  },
};