import { connectToDB } from './db';
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  coverImage: String,
  date: Date,
  category: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export async function getPosts() {
  await connectToDB();
  const posts = await Post.find({})
    .sort({ date: -1 })
    .limit(9);
  return JSON.parse(JSON.stringify(posts));
} 