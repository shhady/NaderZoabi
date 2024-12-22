'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    fetchDocument();
  }, [id, user, isLoaded]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('המסמך לא נמצא');
        } else if (response.status === 403) {
          setError('אין לך הרשאה לצפות במסמך זה');
        } else {
          setError('שגיאה בטעינת המסמך');
        }
        return;
      }

      const data = await response.json();
      setDocument(data);
      setTitle(data.title);
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('שגיאה בטעינת המסמך');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const updatedDoc = await response.json();
      setDocument(updatedDoc);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('שגיאה בעדכון המסמך');
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מסמך זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      router.push('/dashboard/documents');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('שגיאה במחיקת המסמך');
    }
  };

  if (!isLoaded || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#B78628] hover:text-[#96691E]"
        >
          חזור לרשימה
        </button>
      </div>
    );
  }

  if (!document) return null;

  const statusOptions = [
    { value: 'ממתין', label: 'ממתין' },
    { value: 'בטיפול', label: 'בטיפול' },
    { value: 'הושלם', label: 'הושלם' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={() => router.back()}
            className="text-[#B78628] hover:text-[#96691E]"
          >
            חזור לרשימה
          </button>
          <h1 className="text-2xl font-semibold text-[#2C3E50]">
            {isAdmin && isEditing ? 'עריכת מסמך' : 'פרטי מסמך'}
          </h1>
        </div>
        {document.canEdit && (
          <div className="flex gap-2">
            {isAdmin && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-[#B78628] text-white px-4 py-2 rounded-md hover:bg-[#96691E]"
                    >
                      שמור
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setTitle(document.title);
                        setStatus(document.status);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      ביטול
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#B78628] text-white px-4 py-2 rounded-md hover:bg-[#96691E]"
                  >
                    ערוך
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              מחק
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {isAdmin && isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סטטוס
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-2">{document.title}</h2>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  document.status === 'ממתין' ? 'bg-yellow-100 text-yellow-800' :
                  document.status === 'בטיפול' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {document.status}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">
                  הועלה על ידי: {document.uploaderName}
                </p>
                <p className="text-sm text-gray-600">
                  שותף עם: {document.uploadedForName}
                </p>
                <p className="text-sm text-gray-600">
                  תאריך העלאה: {new Date(document.createdAt).toLocaleDateString('he-IL')}
                </p>
              </div>
            </>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">קבצים:</h3>
            <div className="space-y-2">
              {document.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <span>{file.fileName}</span>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B78628] hover:text-[#96691E]"
                  >
                    הורד
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 