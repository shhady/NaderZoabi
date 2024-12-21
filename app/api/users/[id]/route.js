import { connectToDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user?.publicMetadata?.role === 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const userData = await User.findById(id);

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get documents for this user (when implemented)
    // const documents = await Document.find({
    //   $or: [
    //     { uploadedBy: id },
    //     { uploadedFor: id }
    //   ]
    // });

    return NextResponse.json({
      ...userData.toObject(),
      // documents: documents // Will be added when document functionality is implemented
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Error fetching user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await currentUser();
    if (!user?.publicMetadata?.role === 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const { id } = params;
    const data = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error updating user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const user = await currentUser();
    if (!user?.publicMetadata?.role === 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await connectToDB();
    const deletedUser = await User.findOneAndDelete({ clerkId: id });

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
} 