import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user?.publicMetadata?.role === 'admin';
    const data = await request.json();
    const { title, files, uploadedBy, uploadedFor } = data;

    if (!uploadedBy || !uploadedFor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Create the document with initial status based on user role
    const document = await Document.create({
      title,
      files: files.map(file => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        uploadedAt: new Date()
      })),
      uploadedBy,
      uploadedFor,
      status: isAdmin ? 'הושלם' : 'ממתין',
      viewed: false
    });

    // Get user names for response
    const [uploader, recipient] = await Promise.all([
      User.findById(uploadedBy),
      User.findById(uploadedFor)
    ]);

    return NextResponse.json({
      ...document.toObject(),
      uploaderName: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'משתמש לא ידוע',
      uploadedForName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'משתמש לא ידוע'
    });

  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: error.message || "Error creating document" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user?.publicMetadata?.role === 'admin';
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    await connectToDB();

    // Get current user's MongoDB ID
    const currentDbUser = await User.findOne({ clerkId: user.id });
    if (!currentDbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let query = {};

    // Same logic for both admin and non-admin
    if (type === 'uploaded') {
      // Show documents uploaded by the user
      query = { uploadedBy: currentDbUser._id };
    } else {
      // Show documents received (not uploaded by the user)
      query = { 
        uploadedBy: { $ne: currentDbUser._id } // Documents not uploaded by current user
      };

      // For non-admin, also filter by uploadedFor
      if (!isAdmin) {
        query.uploadedFor = currentDbUser._id;
      }
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });

    // Add user names to documents
    const documentsWithNames = await Promise.all(documents.map(async (doc) => {
      const [uploader, recipient] = await Promise.all([
        User.findById(doc.uploadedBy),
        User.findById(doc.uploadedFor)
      ]);

      return {
        ...doc.toObject(),
        uploaderName: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'משתמש לא ידוע',
        uploadedForName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'משתמש לא ידוע'
      };
    }));

    return NextResponse.json(documentsWithNames);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Error fetching documents" },
      { status: 500 }
    );
  }
} 