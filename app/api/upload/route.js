import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const uploadedFor = formData.get('uploadedFor');
    const uploadedBy = formData.get('uploadedBy');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, 'uploads');
    
    try {
      await mkdir(publicDir, { recursive: true });
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('Error creating directories:', err);
        throw err;
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileName = `${timestamp}-${originalName}`;
    const filePath = join(uploadDir, fileName);
    
    // Save file
    await writeFile(filePath, buffer);
    
    // Create file URL
    const fileUrl = `/uploads/${fileName}`;

    // Connect to database
    await connectToDB();

    // Save to database
    const document = await Document.create({
      fileName: originalName,
      fileUrl,
      fileType: file.type,
      uploadedBy,
      uploadedFor: uploadedFor || uploadedBy
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ 
      error: "Error uploading file", 
      details: error.message 
    }, { status: 500 });
  }
} 