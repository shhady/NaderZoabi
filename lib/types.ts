export interface UserDocument {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'client';
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentDocument {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedFor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceDocument {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
} 