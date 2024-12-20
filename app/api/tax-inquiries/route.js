import { connectToDB } from '@/lib/db';
import { TaxInquiry } from '@/lib/models/taxInquiry';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'annualIncome',
      'monthsWorked',
      'maritalStatus',
      'contactName',
      'contactEmail',
      'contactPhone'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Convert string values to numbers where needed
    const formattedData = {
      ...data,
      annualIncome: Number(data.annualIncome),
      monthsWorked: Number(data.monthsWorked),
      childrenUnder18: Number(data.childrenUnder18) || 0,
      childrenUnder5: Number(data.childrenUnder5) || 0,
      immigrationYear: data.immigrationYear ? Number(data.immigrationYear) : undefined,
      completionYear: data.completionYear ? Number(data.completionYear) : undefined,
      pensionContributions: Number(data.pensionContributions) || 0,
      childcareAmount: Number(data.childcareAmount) || 0,
      parentCareAmount: Number(data.parentCareAmount) || 0,
      donationsAmount: Number(data.donationsAmount) || 0,
    };

    const taxInquiry = await TaxInquiry.create(formattedData);
    return NextResponse.json(taxInquiry);
  } catch (error) {
    console.error('Error creating tax inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating tax inquiry' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    let query = {};
    if (month) {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 0);
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const inquiries = await TaxInquiry.find(query).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching tax inquiries:', error);
    return NextResponse.json(
      { error: 'Error fetching tax inquiries' },
      { status: 500 }
    );
  }
}
