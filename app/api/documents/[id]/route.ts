import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { DocumentDocument } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const document = await Document.findById<DocumentDocument>(params.id).lean();

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Check if user has access to this document
    if (user.publicMetadata.role !== 'admin' && 
        document.uploadedBy !== user.id && 
        document.uploadedFor !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return new NextResponse("Error fetching document", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const document = await Document.findByIdAndDelete(params.id);

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Here you might want to also delete the file from Firebase Storage
    // You'll need to implement this part

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return new NextResponse("Error deleting document", { status: 500 });
  }
} 