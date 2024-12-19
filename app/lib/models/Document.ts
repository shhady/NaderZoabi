import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true }, // 'pdf' or 'image'
  uploadedBy: { type: String, required: true }, // clerkId
  uploadedFor: { type: String, required: true }, // clerkId of the client
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema); 