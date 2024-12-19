import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const user = await currentUser();

    // Here you would typically send an email or save to database
    console.log('Contact form submission:', {
      ...data,
      userId: user?.id || 'anonymous'
    });

    return NextResponse.json({ 
      message: "Message sent successfully" 
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ 
      error: "Error processing contact form" 
    }, { status: 500 });
  }
} 