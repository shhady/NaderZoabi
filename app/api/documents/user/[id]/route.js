import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await connectToDB();

    // Get MongoDB user ID
    let dbUser;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbUser = await User.findById(id);
    } else {
      dbUser = await User.findOne({ clerkId: id });
    }

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch documents where uploadedFor matches the user's ID
    const documents = await Document.find({ uploadedFor: dbUser._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'uploadedBy',
        select: '_id firstName lastName'
      })
      .populate({
        path: 'uploadedFor',
        select: '_id firstName lastName'
      });

    // Transform documents to include names
    const transformedDocs = documents.map(doc => ({
      ...doc.toObject(),
      uploaderName: doc.uploadedBy ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}` : 'משתמש לא ידוע',
      uploadedForName: doc.uploadedFor ? `${doc.uploadedFor.firstName} ${doc.uploadedFor.lastName}` : 'משתמש לא ידוע'
    }));

    return NextResponse.json(transformedDocs);
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return NextResponse.json(
      { error: "Error fetching user documents" },
      { status: 500 }
    );
  }
} 