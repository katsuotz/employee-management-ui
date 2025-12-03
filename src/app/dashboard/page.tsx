'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';

export default function DashboardPage() {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);

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

    setUser(authService.getUser());
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Employee Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

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
