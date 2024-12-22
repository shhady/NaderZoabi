'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase, BUCKET_NAME } from '@/lib/supabaseClient';
import { checkFileAccess } from '@/lib/storageMiddleware';

export default function FileDownload({ file, documentId }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      // Check if user has access to this document
      const hasAccess = await checkFileAccess(user.id, documentId);
      if (!hasAccess) {
        alert('אין לך גישה לקובץ זה');
        return;
      }

      // If file has a direct URL, use it
      if (file.fileUrl) {
        window.open(file.fileUrl, '_blank');
        return;
      }

      // Fallback to storage download
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(file.storagePath);

      if (error) throw error;

      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('שגיאה בהורדת הקובץ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
      <span>{file.fileName}</span>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`text-[#B78628] hover:text-[#96691E] ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'מוריד...' : 'הורד'}
      </button>
    </div>
  );
} 