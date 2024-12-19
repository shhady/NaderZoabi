'use client';

import { UserButton, useUser } from '@clerk/nextjs';

export default function DashboardHeader() {
  const { user, isLoaded } = useUser();
//   const role = user?.publicMetadata?.role || 'client';

  if (!isLoaded) return null;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-2xl font-semibold text-[#2C3E50]">
              Welcome, {user?.firstName || 'User'}
            </h1>
            {/* <p className="text-sm text-gray-500 capitalize">Role: {role}</p> */}
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
} 