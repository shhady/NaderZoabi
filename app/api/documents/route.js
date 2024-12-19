import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user?.publicMetadata?.role === 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { files } = await req.json();
    await connectToDB();

    const documents = await Document.create(
      files.map(file => ({
        fileName: file.name,
        fileUrl: file.url,
        fileType: file.type,
        uploadedBy: file.uploadedBy,
        uploadedFor: file.uploadedFor
      }))
    );

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error creating documents:", error);
    return NextResponse.json({ error: "Error creating documents" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // If admin, get all documents, otherwise get only user's documents
    const query = user.publicMetadata.role === 'admin'
      ? {}
      : { $or: [{ uploadedBy: user.id }, { uploadedFor: user.id }] };

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Error fetching documents" }, { status: 500 });
  }
} 