import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: String,
  uploadedAt: { type: Date, default: Date.now },
  isShared: { type: Boolean, default: false },
});

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema); 