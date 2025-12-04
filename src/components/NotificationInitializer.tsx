'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationInitializerProps {
  children: React.ReactNode;
}

export const NotificationInitializer: React.FC<NotificationInitializerProps> = ({ children }) => {
  const { connect } = useNotifications();

  useEffect(() => {
    // Connect to SSE - service will handle token retrieval internally
    connect();

    // Cleanup on unmount
    return () => {
      // Disconnect will be handled by NotificationProvider cleanup
    };
  }, [connect]);

  return <>{children}</>;
};
