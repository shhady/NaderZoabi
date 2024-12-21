'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
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

    fetchUser();
  }, [id]);

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
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">פרטים אישיים</h2>
            <p><span className="font-medium">שם:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-medium">אימייל:</span> {user.email}</p>
            <p><span className="font-medium">תאריך הצטרפות:</span> {new Date(user.createdAt).toLocaleDateString('he-IL')}</p>
          </div>

          {/* Files Section - Placeholder for now */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">קבצים</h2>
            <p className="text-gray-500">אין קבצים זמינים כרגע</p>
          </div>
        </div>
      </div>
    </div>
  );
} 