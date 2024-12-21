'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import NamePrompt from './NamePrompt';

export default function FileUpload({ userId, onUploadComplete }) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const formRef = useRef(null);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!title || files.length === 0) {
      alert('נא למלא כותרת ולבחור קבצים');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      files.forEach(file => {
        formData.append('files', file);
      });

      if (isAdmin && userId) {
        formData.append('uploadedFor', userId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'NAME_REQUIRED') {
          setShowNamePrompt(true);
          return;
        }
        throw new Error(data.error || 'Upload failed');
      }

      if (onUploadComplete) {
        onUploadComplete(data);
      }

      // Reset form
      setTitle('');
      setFiles([]);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('שגיאה בהעלאת הקבצים');
    } finally {
      setUploading(false);
    }
  };

  const handleNameSubmit = async (nameData) => {
    setShowNamePrompt(false);
    // Try upload again after name is set
    handleSubmit();
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            כותרת המסמך
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            placeholder="הזן כותרת למסמך"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר קבצים
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#B78628] file:text-white
              hover:file:bg-[#96691E]"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            ניתן להעלות מספר קבצים בו-זמנית
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full px-4 py-2 bg-[#B78628] text-white rounded-md 
            hover:bg-[#96691E] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'מעלה...' : 'העלה מסמכים'}
        </button>
      </form>

      {showNamePrompt && (
        <NamePrompt
          onSubmit={handleNameSubmit}
          onClose={() => setShowNamePrompt(false)}
        />
      )}
    </>
  );
}
