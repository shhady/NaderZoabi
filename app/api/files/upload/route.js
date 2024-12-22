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

    const { title, files, uploadedFor: uploadedForClerkId } = await request.json();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    await connectToDB();

    // Get uploader's MongoDB ID
    const uploaderUser = await User.findOne({ clerkId: user.id });
    if (!uploaderUser) {
      return NextResponse.json({ error: "Uploader not found" }, { status: 404 });
    }

    // Get recipient's MongoDB ID
    let recipientUser = uploaderUser; // Default to self
    if (uploadedForClerkId && uploadedForClerkId !== user.id) {
      recipientUser = await User.findOne({ clerkId: uploadedForClerkId });
      if (!recipientUser) {
        return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
      }
    }

    // Create document
    const document = await Document.create({
      title,
      files: files.map(file => ({
        ...file,
        uploadedAt: new Date()
      })),
      uploadedBy: uploaderUser._id,
      uploadedFor: recipientUser._id,
      status: 'ממתין',
      viewed: false
    });

    // Return document with user names
    return NextResponse.json({
      ...document.toObject(),
      uploaderName: `${uploaderUser.firstName} ${uploaderUser.lastName}`,
      uploadedForName: `${recipientUser.firstName} ${recipientUser.lastName}`
    });

  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: error.message || "Error uploading files" },
      { status: 500 }
    );
  }
} 