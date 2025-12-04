import { toast } from 'sonner';

interface SSEMessage {
  type: string;
  userId: string;
  jobId: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

class NotificationService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isConnecting = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.connect = this.connect.bind(this);
  }

  // Subscribe to unread count updates
  onUnreadCountChange(callback: () => void): void {
    this.listeners.push(callback);
  }

  // Unsubscribe from unread count updates
  offUnreadCountChange(callback: () => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Emit unread count update to all listeners
  private emitUnreadCountChange(): void {
    this.listeners.forEach(callback => callback());
  }

  connect(): void {
    if (this.isConnecting || (this.eventSource && this.eventSource.readyState === EventSource.OPEN)) {
      return;
    }

    // Get token from localStorage
    const getToken = (): string | null => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
      }
      return null;
    };

    const token = getToken();
    if (!token) {
      console.error('No authentication token found in localStorage');
      return;
    }

    this.isConnecting = true;

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe?token=${encodeURIComponent(token)}`;
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('SSE connection opened');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data);
          this.handleNotification(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.isConnecting = false;
        this.eventSource?.close();
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(), this.reconnectDelay);
        }
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.isConnecting = false;
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  private handleNotification(data: SSEMessage): void {
    const { type, status, jobId, data: notificationData, error } = data;

    switch (type) {
      case 'employee_created':
        if (status === 'success' && notificationData?.employee) {
          toast.success(`Employee "${notificationData.employee.name}" created successfully!`, {
            description: 'The employee has been added to the system.',
            duration: 5000,
          });
          // Emit unread count refresh event
          this.emitUnreadCountChange();
        } else if (status === 'error') {
          toast.error('Employee creation failed', {
            description: error || 'An error occurred while creating the employee.',
            duration: 5000,
          });
          // Emit unread count refresh event
          this.emitUnreadCountChange();
        }
        break;
      
      default:
        console.log('Unknown notification type:', type);
    }
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

export const notificationService = new NotificationService();
