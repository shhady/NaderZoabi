'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase, BUCKET_NAME } from '@/lib/supabaseClient';

export default function FileUpload() {
  const { user } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const title = e.target.querySelector('input[type="text"]').value;

    if (!title || selectedFiles.length === 0) {
      alert('נא למלא כותרת ולבחור קבצים');
      return;
    }

    setUploading(true);

    try {
      // Get current user's MongoDB ID
      const userResponse = await fetch(`/api/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }
      const currentUser = await userResponse.json();

      // Determine uploadedFor based on user role and selection
      let uploadedForId = currentUser._id; // Default to current user
      
      if (isAdmin && selectedUser) {
        const recipientResponse = await fetch(`/api/users/${selectedUser}`);
        if (!recipientResponse.ok) {
          throw new Error('Failed to get recipient info');
        }
        const recipientUser = await recipientResponse.json();
        uploadedForId = recipientUser._id;
      }

      // Upload files to Supabase
      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file);

          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

          return {
            fileName: file.name,
            fileUrl: urlData.publicUrl,
            fileType: file.type,
          };
        })
      );

      // Create document
      const documentResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          files: uploadedFiles,
          uploadedBy: currentUser._id,
          uploadedFor: uploadedForId,
          status: isAdmin ? 'הושלם' : 'ממתין',
          viewed: false
        }),
      });

      if (!documentResponse.ok) {
        const error = await documentResponse.json();
        throw new Error(error.error || 'Failed to create document');
      }

      const document = await documentResponse.json();
      setUploadedFiles(prev => [...prev, document]);
      e.target.reset();
      setSelectedFiles([]);
      setSelectedUser('');

    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`שגיאה בהעלאת קבצים: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">טוען...</div>;
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
            כותרת
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר קבצים להעלאה
          </label>
          <input
            type="file"
            multiple
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileSelect}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#B78628] file:text-white
              hover:file:bg-[#96691E]"
          />
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              קבצים שנבחרו ({selectedFiles.length}):
            </h3>
            <ul className="space-y-1">
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || selectedFiles.length === 0}
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
                <span className="font-medium">{file.title}</span>
                <span className="text-sm text-gray-500">
                  {file.files?.length} קבצים
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 