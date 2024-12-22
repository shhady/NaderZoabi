'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function PrivateDocumentsList({ userId }) {
  const { user: currentUser } = useUser();
  const [documents, setDocuments] = useState({ uploaded: [], received: [] });
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Fetch documents for this specific user
        const response = await fetch(`/api/documents/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const userDocuments = await response.json();

        // Get the MongoDB user ID for comparison
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to get user info');
        }
        const userData = await userResponse.json();
        const mongoUserId = userData._id;

        // Split into self-uploaded and received from others
        const received = userDocuments.filter(doc => 
          doc.uploadedBy._id.toString() === doc.uploadedFor._id.toString() // Documents where user uploaded for themselves
        );
        const uploaded = userDocuments.filter(doc => 
          doc.uploadedBy._id.toString() !== doc.uploadedFor._id.toString() // Documents uploaded by others for this user
        );

        setDocuments({ uploaded, received });
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDocuments();
    }
  }, [userId]);

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

  const DocumentCard = ({ document }) => (
    <div className="bg-white p-6 rounded-lg shadow transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-lg line-clamp-2">{document.title}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(document.status)}`}>
          {document.status}
        </span>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {document.files?.length || 0} קבצים
          </p>
          <span className="text-sm text-gray-500">
            {new Date(document.createdAt).toLocaleDateString('he-IL')}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          הועלה על ידי: {document.uploaderName || 'משתמש לא ידוע'}
        </p>
      </div>

      <Link
                href={`/dashboard/documents/${document._id}`}
                className="text-[#B78628] hover:text-[#96691E] inline-block"
              >
                צפה בפרטים
              </Link>
    </div>
  );

  if (loading) {
    return <div className="text-center py-4">טוען...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Received Documents Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">קבצים שהתקבלו מהלקוח</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.received.length === 0 ? (
            <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">אין קבצים שהתקבלו</p>
            </div>
          ) : (
            documents.received.map((doc) => (
              <DocumentCard key={doc._id} document={doc} />
            ))
          )}
        </div>
      </div>

      {/* Uploaded Documents Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">קבצים שהעליתי (אדמין)</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.uploaded.length === 0 ? (
            <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">אין קבצים שהועלו</p>
            </div>
          ) : (
            documents.uploaded.map((doc) => (
              <DocumentCard key={doc._id} document={doc} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 