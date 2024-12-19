import { connectToDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { clerkId, email, firstName, lastName,role } = await req.json();
    console.log(clerkId)
    await connectToDB();

    // Check if user exists
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Create new user
    const newUser = await User.create({
      clerkId,
      email,
      firstName,
      lastName,
      role: role
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const users = await User.find({}).select('-__v');
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 