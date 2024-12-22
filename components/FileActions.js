'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase, BUCKET_NAME } from '@/lib/supabaseClient';
import { canDeleteFile } from '@/lib/storageMiddleware';

export default function FileActions({ file, onDelete }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      // Check if user can delete this file
      const canDelete = await canDeleteFile(user.id, file._id);
      if (!canDelete) {
        alert('אין לך הרשאה למחוק קובץ זה');
        return;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([file.storagePath]);

      if (storageError) throw storageError;

      // Delete metadata from your database
      const response = await fetch(`/api/documents/${file._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file metadata');
      }

      onDelete?.(file._id);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('שגיאה במחיקת הקובץ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? 'מוחק...' : 'מחק'}
    </button>
  );
} 