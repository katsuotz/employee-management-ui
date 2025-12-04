'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';

export default function DashboardPage() {
  const [user] = useState(authService.getUser());

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // Validate token format
    if (!authService.isTokenValid()) {
      authService.logout();
      window.location.href = '/login';
      return;
    }
  }, []);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard
              </h2>
              <p className="text-gray-600 mb-2">
                Welcome to the Employee Management System
              </p>
              <p className="text-sm text-gray-500">
                Role: {user?.role}
              </p>
              <p className="text-sm text-gray-500">
                Email: {user?.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
