import { connectToDB } from '@/lib/db';
import { TaxInquiry } from '@/lib/models/TaxInquiry';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const data = await req.json();

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
    console.error('Error updating tax inquiry:', error);
    return NextResponse.json(
      { error: 'Error updating tax inquiry' },
      { status: 500 }
    );
  }
} 