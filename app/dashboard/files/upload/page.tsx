'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';

export default function FileUploadPage() {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from your database
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // Replace with your API route
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  if (user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">Upload Files</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
          >
            <option value="">Select a user...</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
        <UploadButton<OurFileRouter, 'fileUploader'>
  endpoint="fileUploader"
  onClientUploadComplete={(res) => {
    console.log('Files: ', res);
    alert('Upload Completed');
  }}
  onUploadError={(error: Error) => {
    alert(`ERROR! ${error.message}`);
  }}
/>
        </div>
      </div>
    </div>
  );
}
