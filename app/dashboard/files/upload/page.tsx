'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export default function FileUploadPage() {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      alert('File uploaded successfully!');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">Upload Files</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#B78628] file:text-white
                hover:file:bg-[#96691E]
                cursor-pointer"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected file: {selectedFile.name}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full px-4 py-2 text-white rounded-md transition-colors
              ${
                !selectedFile || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#B78628] hover:bg-[#96691E]'
              }`}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
}
