import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Get documents based on user role
    const query = user.publicMetadata.role === 'admin' 
      ? {} 
      : { $or: [{ uploadedBy: user.id }, { uploadedFor: user.id }] };

    // Get total documents
    const totalDocuments = await Document.countDocuments(query);

    // Get recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUploads = await Document.countDocuments({
      ...query,
      createdAt: { $gte: sevenDaysAgo }
    });

    // For now, pending tasks is just a placeholder
    const pendingTasks = 0;

    return NextResponse.json({
      totalDocuments,
      recentUploads,
      pendingTasks
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
  }
} 