'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';
import DocumentsList from '@/components/DocumentsList';
import { useUser } from '@clerk/nextjs';

export default function UserDetailsPage() {
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
    fetchUser();
  }, [id, isAdmin, router]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="grid gap-6">
        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">פרטים אישיים</h2>
          <div className="space-y-2">
            <p><span className="font-medium">שם:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-medium">אימייל:</span> {user.email}</p>
            <p><span className="font-medium">תאריך הצטרפות:</span> {new Date(user.createdAt).toLocaleDateString('he-IL')}</p>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">מסמכים</h2>
            <FileUpload userId={user.clerkId} onUploadComplete={fetchUser} />
          </div>
          <DocumentsList 
            userId={user.clerkId} 
            hideFilters={false}
            showUploadedFor={true}
          />
        </div>
      </div>
    </div>
  );
} 