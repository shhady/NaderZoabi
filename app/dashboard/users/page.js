'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
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

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">ניהול משתמשים</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            חיפוש לקוח
          </label>
          <input
            type="text"
            id="search"
            placeholder="הקלד שם לקוח..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  שם
                </th>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  אימייל
                </th>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך הצטרפות
                </th>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    לא נמצאו משתמשים
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm text-gray-900 break-words leading-5">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('he-IL')}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <button
                        onClick={() => router.push(`/dashboard/users/${user._id}`)}
                        className="text-[#B78628] hover:text-[#96691E] text-sm"
                      >
                        צפה בפרטים
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 