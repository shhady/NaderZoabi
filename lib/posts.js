import { connectToDB } from "./db";
import { Post } from "./models/Post";

export async function getPosts() {
  try {
    await connectToDB();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    await connectToDB();
    const post = await Post.findOne({ slug }).lean();
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
} 