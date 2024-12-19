import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema); 