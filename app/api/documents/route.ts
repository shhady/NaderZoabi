import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // If user is admin, get all documents, otherwise get only their documents
    const query = user.publicMetadata.role === 'admin' 
      ? {} 
      : { $or: [{ uploadedBy: user.id }, { uploadedFor: user.id }] };

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new NextResponse("Error fetching documents", { status: 500 });
  }
} 