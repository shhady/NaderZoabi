'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TaxInquiriesList from '@/components/TaxInquiriesList';

export default function TaxInquiriesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isLoaded) {
      // Redirect non-admin users
      if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, isAdmin, router]);

  if (!isLoaded) {
    return <div className="text-center py-4">טוען...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#2C3E50]">שאילתות מס</h1>
      </div>

      {/* Tax Inquiries List */}
      <TaxInquiriesList />
    </div>
  );
}
