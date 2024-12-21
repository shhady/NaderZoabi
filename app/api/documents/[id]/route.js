import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { unlink } from 'fs/promises';
import { join } from 'path';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const document = await Document.findById(id);
    const isAdmin = user?.publicMetadata?.role === 'admin';

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this document
    if (!isAdmin && 
        document.uploadedBy !== user.id && 
        document.uploadedFor !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Error fetching document' },
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

    // Get document
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check permissions
    if (!isAdmin && document.uploadedBy !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete physical files
    const publicDir = join(process.cwd(), 'public');
    for (const file of document.files) {
      try {
        const filePath = join(publicDir, file.fileUrl.slice(1)); // Remove leading slash
        await unlink(filePath);
      } catch (err) {
        console.error(`Error deleting file: ${err.message}`);
        // Continue with other files even if one fails
      }
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
    const { status } = await request.json();

    await connectToDB();
    
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Update status and viewed flag
    const updates = { status };
    if (!document.viewed) {
      updates.viewed = true;
      if (!status) {
        updates.status = 'בטיפול';
      }
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Error updating document" },
      { status: 500 }
    );
  }
} 