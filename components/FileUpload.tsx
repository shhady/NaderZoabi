'use client';

import { useState, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  onUploadComplete?: (document: any) => void;
  uploadedFor?: string;
}

export default function FileUpload({ onUploadComplete, uploadedFor }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (uploadedFor) {
      formData.append("uploadedFor", uploadedFor);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const document = await response.json();
      onUploadComplete?.(document);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Failed to upload file: ${error?.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          בחר קובץ
        </label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:bg-[#B78628] file:text-white hover:file:bg-[#96691E] cursor-pointer"
        />
      </div>

      {selectedFile && (
        <div className="text-sm text-gray-600">
          קובץ נבחר: {selectedFile.name}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`w-full px-4 py-2 text-white rounded-md ${
          uploading || !selectedFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#B78628] hover:bg-[#96691E]"
        }`}
      >
        {uploading ? <LoadingSpinner /> : "העלה קובץ"}
      </button>
    </div>
  );
} 