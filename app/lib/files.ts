import { connectToDB } from './db';
import { Document } from './models/Document';

export async function getUserFiles(userId: string, month?: string) {
  await connectToDB();
  
  const query: any = { userId };
  
  if (month) {
    const startDate = new Date(month);
    const endDate = new Date(new Date(month).setMonth(startDate.getMonth() + 1));
    query.uploadedAt = {
      $gte: startDate,
      $lt: endDate
    };
  }

  const files = await Document.find(query)
    .sort({ uploadedAt: -1 })
    .limit(10);

  return JSON.parse(JSON.stringify(files));
} 