'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DocumentsList from '@/components/DocumentsList';

export default function DocumentsPage() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'received'; // Default to received documents

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#2C3E50]">מסמכים</h1>
        <Link
          href="/dashboard/files/upload"
          className="bg-[#B78628] text-white px-4 py-2 rounded-md hover:bg-[#96691E] transition-colors"
        >
          העלאת קבצים
        </Link>
      </div>

      {/* Document Type Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => router.push('/dashboard/documents?type=received')}
          className={`px-4 py-2 rounded-md ${
            type === 'received' ? 'bg-[#B78628] text-white' : 'bg-gray-100'
          }`}
        >
          קבצים שהתקבלו
        </button>
        <button
          onClick={() => router.push('/dashboard/documents?type=uploaded')}
          className={`px-4 py-2 rounded-md ${
            type === 'uploaded' ? 'bg-[#B78628] text-white' : 'bg-gray-100'
          }`}
        >
          קבצים שהעליתי
        </button>
      </div>

      <DocumentsList type={type} />
    </div>
  );
} 