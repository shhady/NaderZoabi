'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';

export default function FileUploadPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">העלאת קבצים</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <FileUpload />
        </div>
      </div>
    </div>
  );
} 