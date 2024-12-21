import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { TaxInquiry } from "@/lib/models/TaxInquiry";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Debug: Log the query and results
    console.log("Checking for pending documents...");
    const pendingDocsCount = await Document.countDocuments({ status: 'ממתין' });
    console.log("Pending documents count:", pendingDocsCount);

    // Debug: Log the query and results for tax inquiries
    console.log("Checking for pending tax inquiries...");
    const pendingTaxCount = await TaxInquiry.countDocuments({ status: 'ממתין' });
    console.log("Pending tax inquiries count:", pendingTaxCount);

    // Debug: Log the total
    const totalPending = pendingDocsCount + pendingTaxCount;
    console.log("Total pending count:", totalPending);

    // Verify the data in the database
    const allTaxInquiries = await TaxInquiry.find({ status: 'ממתין' });
    console.log("All pending tax inquiries:", allTaxInquiries);

    return NextResponse.json({ 
      count: totalPending,
      documents: pendingDocsCount,
      taxInquiries: pendingTaxCount,
      debug: {
        taxInquiries: allTaxInquiries
      }
    });
  } catch (error) {
    console.error("Error getting pending count:", error);
    console.error("Full error details:", error.stack);
    return NextResponse.json(
      { error: "Error getting pending count", details: error.message },
      { status: 500 }
    );
  }
} 