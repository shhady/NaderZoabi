import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

// GET Handler
export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    await connectToDB();
    const document = await Document.findById(id).lean();

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

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
export async function DELETE(req) {
  try {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    await connectToDB();
    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Error deleting document" }, { status: 500 });
  }
} 