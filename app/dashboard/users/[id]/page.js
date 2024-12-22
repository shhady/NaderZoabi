'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import PrivateDocumentsList from '@/components/PrivateDocumentsList';

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    const fetchUser = async () => {
      try {
        // First get the MongoDB user to get their clerkId
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isAdmin, router]);

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">המשתמש לא נמצא</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2C3E50]">פרטי משתמש</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-[#B78628]"
        >
          חזור לרשימה
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              הצטרף בתאריך: {new Date(user.createdAt).toLocaleDateString('he-IL')}
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">העלאת מסמכים למשתמש</h2>
        <FileUpload fixedUserId={id} />
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">מסמכים</h2>
        <PrivateDocumentsList userId={id} />
      </div>
    </div>
  );
} 