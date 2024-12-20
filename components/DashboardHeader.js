'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardHeader() {
  const { user } = useUser();

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6 md:py-4 pt-20 md:pt-4">
          <h1 className="text-xl font-semibold text-[#2C3E50] text-center md:text-right">
            ברוך הבא, {user?.firstName}
          </h1>
        </div>
      </div>
    </div>
  );
} 