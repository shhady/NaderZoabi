import { connectToDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const currentUserData = await currentUser();
    if (!currentUserData) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, firstName, lastName } = await req.json();

    await connectToDB();

    const existingUser = await User.findOne({ clerkId: currentUserData.id });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const newUser = await User.create({
      clerkId: currentUserData.id,
      email,
      firstName,
      lastName,
      role: 'user'
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