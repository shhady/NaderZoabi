import { Document } from './models/Document';
import { connectToDB } from './db';

export async function getUserFiles(userId: string) {
  if (!userId) return [];
  
  try {
    await connectToDB();
    const files = await Document.find({
      $or: [
        { uploadedBy: userId },
        { uploadedFor: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();
    
    return files;
  } catch (error) {
    console.error('Error fetching user files:', error);
    return [];
  }
}

export async function getRecentFiles(limit = 5) {
  try {
    await connectToDB();
    const files = await Document.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return files;
  } catch (error) {
    console.error('Error fetching recent files:', error);
    return [];
  }
} 