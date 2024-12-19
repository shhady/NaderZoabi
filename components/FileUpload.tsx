'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

interface FileUploadProps {
  onUploadComplete?: (response: UploadResponse) => void;
  onUploadError?: (error: Error) => void;
  uploadedFor?: string;
}

export default function FileUpload({ onUploadComplete, onUploadError, uploadedFor }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (uploadedFor) {
      formData.append('uploadedFor', uploadedFor);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (response.ok) {
        onUploadComplete?.(data);
        router.refresh();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      onUploadError?.(err);
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload File
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-[#B78628] file:text-white
            hover:file:bg-[#96691E]"
          required
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="w-full px-4 py-2 bg-[#B78628] text-white rounded-md
          hover:bg-[#96691E] disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
} 