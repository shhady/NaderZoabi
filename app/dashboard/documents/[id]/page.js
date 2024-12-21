'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        setDocument(updatedDoc);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון הסטטוס');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מסמך זה?')) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/documents');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('שגיאה במחיקת המסמך');
    }
  };

  const canModify = isAdmin || document?.uploadedBy === user?.id;

  if (loading) return <LoadingSpinner />;

  if (!document) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">המסמך לא נמצא</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2C3E50]">{document.title}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-[#B78628]"
          >
            חזור
          </button>
          {canModify && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              מחק מסמך
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Status Section */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">סטטוס:</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                document.status === 'ממתין' ? 'bg-yellow-100 text-yellow-800' :
                document.status === 'בטיפול' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {document.status}
              </span>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange('ממתין')}
                  disabled={updating || document.status === 'ממתין'}
                  className={`px-3 py-1 rounded ${
                    document.status === 'ממתין'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  ממתין
                </button>
                <button
                  onClick={() => handleStatusChange('בטיפול')}
                  disabled={updating || document.status === 'בטיפול'}
                  className={`px-3 py-1 rounded ${
                    document.status === 'בטיפול'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  בטיפול
                </button>
                <button
                  onClick={() => handleStatusChange('הושלם')}
                  disabled={updating || document.status === 'הושלם'}
                  className={`px-3 py-1 rounded ${
                    document.status === 'הושלם'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  הושלם
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            הועלה בתאריך: {new Date(document.createdAt).toLocaleDateString('he-IL')}
          </p>
          <p className="text-sm text-gray-500">
            הועלה על ידי: {document.uploaderName || 'משתמש לא ידוע'}
          </p>
          {document.uploadedFor !== document.uploadedBy && (
            <p className="text-sm text-gray-500">
              שותף עם: {document.uploadedForName || 'משתמש לא ידוע'}
            </p>
          )}
        </div>

        {/* Files List */}
        <div className="space-y-4">
          {document.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{file.fileName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(file.uploadedAt).toLocaleDateString('he-IL')}
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B78628] hover:text-[#96691E]"
                >
                  הורד
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 