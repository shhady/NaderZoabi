import { connectToDB } from '@/lib/db';
import { TaxInquiry } from '@/lib/models/TaxInquiry';
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const inquiry = await TaxInquiry.findById(id);

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: 'Error fetching inquiry' },
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

    const updatedInquiry = await TaxInquiry.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Error updating inquiry' },
      { status: 500 }
    );
  }
} 