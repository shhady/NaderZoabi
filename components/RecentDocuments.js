'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function RecentDocuments() {
  const [documents, setDocuments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Get 3 documents for everyone
      const response = await fetch('/api/documents?limit=3');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }

      // Fetch pending count only for admin
      if (isAdmin) {
        const pendingResponse = await fetch('/api/documents/pending-count');
        if (pendingResponse.ok) {
          const { count } = await pendingResponse.json();
          setPendingCount(count);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ממתין':
        return 'bg-yellow-100 text-yellow-800';
      case 'בטיפול':
        return 'bg-blue-100 text-blue-800';
      case 'הושלם':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Pending Tasks Card - Admin Only */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">משימות בהמתנה</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">מסמכים הממתינים לטיפול</p>
            <span className="text-2xl font-bold text-[#B78628]">{pendingCount}</span>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {documents.map((doc) => (
          <div key={doc._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-lg line-clamp-2">{doc.title}</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(doc.status)}`}>
                {doc.status}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {doc.files?.length || 0} קבצים
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString('he-IL')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-600">
                  הועלה על ידי: {doc.uploaderName || 'משתמש לא ידוע'}
                </p>
                {doc.uploadedFor !== doc.uploadedBy && (
                  <p className="text-sm text-gray-600">
                    שותף עם: {doc.uploadedForName || 'משתמש לא ידוע'}
                  </p>
                )}
              </div>
            </div>

            <Link
              href={`/dashboard/documents/${doc._id}`}
              className="text-[#B78628] hover:text-[#96691E] inline-block"
            >
              צפה בפרטים
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/dashboard/documents"
          className="inline-block bg-[#B78628] text-white px-6 py-2 rounded-md hover:bg-[#96691E] transition-colors"
        >
          הצג את כל המסמכים
        </Link>
      </div>
    </div>
  );
} 