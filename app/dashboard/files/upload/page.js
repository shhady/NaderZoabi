'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';

export default function FileUploadPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
        <h1 className="text-2xl font-semibold text-[#2C3E50]">העלאת קבצים</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-[#B78628]"
        >
          חזור
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {isAdmin ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              בחר משתמש לשיתוף
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            >
              <option value="">בחר משתמש...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          // For non-admin users, we'll automatically share with admin
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              הקבצים יועלו ויהיו זמינים למנהל המערכת
            </p>
          </div>
        )}

        <FileUpload 
          userId={isAdmin ? selectedUser : 'admin'} // For non-admin, always share with admin
          onUploadComplete={() => {
            router.push('/dashboard/documents');
          }}
        />
      </div>
    </div>
  );
} 