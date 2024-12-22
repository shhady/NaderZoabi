import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";
import { unlink } from 'fs/promises';
import { join } from 'path';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const isAdmin = user?.publicMetadata?.role === 'admin';

    await connectToDB();

    // Get current user's MongoDB ID
    const currentDbUser = await User.findOne({ clerkId: user.id });
    if (!currentDbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the document
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Access control
    if (!isAdmin) {
      // Non-admin can only see documents where they are uploadedFor or uploadedBy
      const canAccess = 
        document.uploadedFor.toString() === currentDbUser._id.toString() || 
        document.uploadedBy.toString() === currentDbUser._id.toString();

      if (!canAccess) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Get user names
    const [uploader, recipient] = await Promise.all([
      User.findById(document.uploadedBy),
      User.findById(document.uploadedFor)
    ]);

    return NextResponse.json({
      ...document.toObject(),
      uploaderName: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'משתמש לא ידוע',
      uploadedForName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'משתמש לא ידוע',
      canEdit: isAdmin || document.uploadedBy.toString() === currentDbUser._id.toString()
    });

  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Error fetching document" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const isAdmin = user?.publicMetadata?.role === 'admin';

    await connectToDB();

    // Get current user's MongoDB ID
    const currentDbUser = await User.findOne({ clerkId: user.id });
    if (!currentDbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get document
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Access control - allow both admin and document creator to delete
    const canDelete = 
      isAdmin || 
      document.uploadedBy.toString() === currentDbUser._id.toString();

    if (!canDelete) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete document from database
    await Document.findByIdAndDelete(id);

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Error deleting document" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const isAdmin = user?.publicMetadata?.role === 'admin';
    const data = await request.json();

    await connectToDB();

    // Get current user's MongoDB ID
    const currentDbUser = await User.findOne({ clerkId: user.id });
    if (!currentDbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the document
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Access control - allow both admin and document creator to update
    const canModify = 
      isAdmin || 
      document.uploadedBy.toString() === currentDbUser._id.toString();

    if (!canModify) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update document
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    // Get user names
    const [uploader, recipient] = await Promise.all([
      User.findById(updatedDocument.uploadedBy),
      User.findById(updatedDocument.uploadedFor)
    ]);

    return NextResponse.json({
      ...updatedDocument.toObject(),
      uploaderName: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'משתמש לא ידוע',
      uploadedForName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'משתמש לא ידוע',
      canEdit: isAdmin || updatedDocument.uploadedBy.toString() === currentDbUser._id.toString()
    });

  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Error updating document" },
      { status: 500 }
    );
  }
} 