'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '@/services/notificationService';

interface NotificationContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    notificationService.connect();
  };

  const disconnect = () => {
    notificationService.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    notificationService.connect()

    // Check connection status periodically
    const checkConnection = () => {
      setIsConnected(notificationService.isConnected());
    };

    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
      notificationService.disconnect();
    };
  }, []);

  const value: NotificationContextType = {
    isConnected,
    connect,
    disconnect,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
