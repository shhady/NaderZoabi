import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Get only pending documents count
    const pendingDocsCount = await Document.countDocuments({ status: 'ממתין' });

    return NextResponse.json({ 
      count: pendingDocsCount,
      documents: pendingDocsCount
    });
  } catch (error) {
    console.error("Error getting pending count:", error);
    return NextResponse.json(
      { error: "Error getting pending count" },
      { status: 500 }
    );
  }
} 