import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  files: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  uploadedBy: {
    type: String,
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
  },
  uploadedFor: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ממתין', 'בטיפול', 'הושלם'],
    default: 'ממתין'
  },
  viewed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema); 