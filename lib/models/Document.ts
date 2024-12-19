import mongoose from 'mongoose';
import { DocumentDocument } from '@/lib/types';

const documentSchema = new mongoose.Schema<DocumentDocument>({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  uploadedBy: { type: String, required: true },
  uploadedFor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Document = mongoose.models.Document || mongoose.model<DocumentDocument>('Document', documentSchema); 