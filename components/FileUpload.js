'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function FileUpload() {
  const { user } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

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

    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('input[type="file"]');
    const files = fileInput.files;

    if (files.length === 0) {
      alert('נא לבחור קובץ');
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        if (isAdmin) {
          formData.append('uploadedFor', selectedUser || user.id);
        } else {
          const adminUser = users.find(u => u.role === 'admin');
          formData.append('uploadedFor', adminUser?.clerkId || user.id);
        }
        
        formData.append('uploadedBy', user.id);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setUploadedFiles(prev => [...prev, data]);
        } else {
          throw new Error(data.error || data.details || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`שגיאה בהעלאת קבצים: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.reset();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* User Selection Dropdown - Only show for admin */}
      {isAdmin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר משתמש להעלאת קבצים עבורו
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
          >
            <option value="">בחר משתמש</option>
            {users.map((u) => (
              <option key={u.clerkId} value={u.clerkId}>
                {u.firstName} {u.lastName} - {u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* File Upload Form */}
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר קבצים להעלאה
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#B78628] file:text-white
              hover:file:bg-[#96691E]"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full px-4 py-2 bg-[#B78628] text-white rounded-md 
            hover:bg-[#96691E] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'מעלה...' : 'העלה קבצים'}
        </button>
      </form>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">קבצים שהועלו:</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div>
                  <span className="font-medium">{file.fileName}</span>
                  {isAdmin && (
                    <span className="text-sm text-gray-500 ml-2">
                      (עבור: {users.find(u => u.clerkId === file.uploadedFor)?.firstName || 'לא נבחר'})
                    </span>
                  )}
                </div>
                <a 
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B78628] hover:text-[#96691E]"
                >
                  הורד
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 