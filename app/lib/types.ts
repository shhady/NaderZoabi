export interface FileDocument {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
  isShared: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: Date;
  category: string;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
} 