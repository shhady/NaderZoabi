import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const users = await User.find().lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: data.clerkId });
    if (existingUser) {
      return NextResponse.json(existingUser);
    }
    
    // Create new user
    const newUser = await User.create({
      clerkId: data.clerkId,
      email: data.email,
      firstName: data.firstName,  
      lastName: data.lastName,
      role: data.role
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
} 