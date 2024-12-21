import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Document } from "@/lib/models/Document";

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName } = await request.json();
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Update user in our database
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`
      },
      { new: true }
    );

    // Update documents with new uploader name
    await Document.updateMany(
      { uploadedBy: user.id },
      { uploaderName: `${firstName} ${lastName}` }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user name:", error);
    return NextResponse.json(
      { error: "Error updating user name" },
      { status: 500 }
    );
  }
} 