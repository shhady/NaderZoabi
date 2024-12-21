'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DocumentsList from '@/components/DocumentsList';

export default function DocumentsPage() {
  const { user } = useUser();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchPendingCount();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/documents/pending-count');
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.documents);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">טוען...</div>;
  }

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

      {/* Pending Documents Card - Admin Only */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">מסמכים בהמתנה</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">מסמכים הממתינים לטיפול</p>
            <span className="text-2xl font-bold text-[#B78628]">{pendingCount}</span>
          </div>
        </div>
      )}

      {/* Documents List with Filters */}
      <DocumentsList />
    </div>
  );
} 