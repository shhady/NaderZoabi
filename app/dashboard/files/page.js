'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DocumentsList from '@/components/DocumentsList';

export default function FilesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/documents');
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

    fetchFiles();
  }, []);

  if (!isLoaded) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">קבצים</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DocumentsList files={files} loading={loading} />
      </div>
    </div>
  );
} 