import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";

export async function GET(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || null;
    const isAdmin = user?.publicMetadata?.role === 'admin';

    await connectToDB();
    let query = {};

    if (userId) {
      // If userId is provided, fetch documents for that user
      query = isAdmin 
        ? { $or: [{ uploadedBy: userId }, { uploadedFor: userId }] }
        : { uploadedBy: user.id };
    } else {
      // Otherwise fetch documents for current user
      query = isAdmin 
        ? {} // Admin sees all documents
        : { $or: [
            { uploadedBy: user.id },
            { uploadedFor: user.id }
          ]};
    }

    let documentsQuery = Document.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      documentsQuery = documentsQuery.limit(limit);
    }

    const documents = await documentsQuery.lean();

    // If admin, get user names
    if (isAdmin) {
      const userIds = [...new Set(documents.map(doc => doc.uploadedFor))];
      const users = await User.find({ clerkId: { $in: userIds } });
      const userMap = users.reduce((acc, user) => {
        acc[user.clerkId] = `${user.firstName} ${user.lastName}`;
        return acc;
      }, {});

      documents.forEach(doc => {
        doc.uploadedForName = userMap[doc.uploadedFor] || 'משתמש לא ידוע';
      });
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Error fetching documents" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const files = formData.getAll('files');
    const uploadedFor = formData.get('uploadedFor');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    await connectToDB();

    // Get user's name from database
    const dbUser = await User.findOne({ clerkId: user.id });
    const uploaderName = dbUser 
      ? `${dbUser.firstName} ${dbUser.lastName}`
      : 'משתמש לא ידוע';

    const document = await Document.create({
      title,
      files: files.map(file => ({
        fileName: file.name,
        fileUrl: file.url,
        fileType: file.type,
        uploadedAt: new Date()
      })),
      uploadedBy: user.id,
      uploaderName,
      uploadedFor: uploadedFor || user.id
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Error creating document" },
      { status: 500 }
    );
  }
} 