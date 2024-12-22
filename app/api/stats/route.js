import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user?.publicMetadata?.role === 'admin';
    await connectToDB();

    // Get current user's MongoDB ID
    const currentDbUser = await User.findOne({ clerkId: user.id });
    if (!currentDbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stats = {};

    if (isAdmin) {
      // For admin, get total documents and pending documents
      const [totalDocuments, pendingDocs] = await Promise.all([
        Document.countDocuments({}),
        Document.countDocuments({ status: 'ממתין' })
      ]);

      // For now, pendingTax is set to 0, you can add real tax inquiries later
      const pendingTax = 0;

      stats = {
        totalDocuments,
        pendingDocs,
        pendingTax
      };
    } else {
      // For regular users, get documents where they are uploadedFor
      const totalDocuments = await Document.countDocuments({ 
        uploadedFor: currentDbUser._id 
      });

      stats = {
        totalDocuments,
        pendingDocs: 0,
        pendingTax: 0
      };
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
} 