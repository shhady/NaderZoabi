import { connectToDB } from './db';
import { Document } from './models/Document';
import { UploadResult } from './types';

interface FileQuery {
  userId: string;
  uploadedAt?: {
    $gte: Date;
    $lt: Date;
  };
}

export async function getUserFiles(userId: string, month?: string) {
  await connectToDB();
  
  const query: FileQuery = { userId };
  
  if (month) {
    const startDate = new Date(month);
    const endDate = new Date(new Date(month).setMonth(startDate.getMonth() + 1));
    query.uploadedAt = {
      $gte: startDate,
      $lt: endDate
    };
  }

  const files = await Document.find(query)
    .sort({ uploadedAt: -1 })
    .limit(10);

  return JSON.parse(JSON.stringify(files));
}

export const uploadFile = async (file: File): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return {
      success: response.ok,
      fileUrl: data.fileUrl,
      error: !response.ok ? data.error : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 