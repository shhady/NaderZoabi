'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function FileManager({ userId }) {
  const { user, isLoaded } = useUser();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      if (isAdmin && userId) {
        formData.append('uploadedFor', userId);
      }

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath) => {
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`);
      if (response.ok) {
        const { signedUrl } = await response.json();
        window.open(signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (fileId, filePath) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">קבצים</h2>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-[#B78628] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#96691E] transition-colors"
        >
          {uploading ? 'מעלה...' : 'העלה קובץ'}
        </label>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-gray-500">
                {new Date(file.created_at).toLocaleDateString('he-IL')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(file.file_path)}
                className="text-[#B78628] hover:text-[#96691E]"
              >
                הורד
              </button>
              {(isAdmin || file.uploaded_by === user?.id) && (
                <button
                  onClick={() => handleDelete(file.id, file.file_path)}
                  className="text-red-600 hover:text-red-800"
                >
                  מחק
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 