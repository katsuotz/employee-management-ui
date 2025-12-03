'use client';

import { useEffect } from 'react';
import { authService } from '@/services/authService';

export default function Home() {
  useEffect(() => {
    // Check if user is already logged in using authService
    if (authService.isAuthenticated()) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Employee Management System
        </h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
