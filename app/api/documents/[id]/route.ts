import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { DocumentDocument } from "@/lib/types";

// GET Handler
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract `id` from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    await connectToDB();
    const document = await Document.findById<DocumentDocument>(id).lean();

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if the user has access to the document
    if (
      user.publicMetadata.role !== "admin" &&
      document.uploadedBy !== user.id &&
      document.uploadedFor !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Error fetching document" }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract `id` from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    await connectToDB();
    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // TODO: Add logic to delete associated file from Firebase Storage if necessary

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Error deleting document" }, { status: 500 });
  }
}
