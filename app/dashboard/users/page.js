'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import UserList from '@/components/UserList';

export default function UsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!user || user?.publicMetadata?.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">ניהול משתמשים</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UserList />
      </div>
    </div>
  );
} 