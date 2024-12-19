import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Error fetching users", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: data.clerkId });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Create new user
    const newUser = await User.create({
      clerkId: data.clerkId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'client'
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Error creating user", { status: 500 });
  }
} 