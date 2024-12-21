import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files');
    const title = formData.get('title');
    const uploadedFor = formData.get('uploadedFor');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    await connectToDB();

    // Get user from our database
    const dbUser = await User.findOne({ clerkId: user.id });
    
    // If user doesn't have a name in our database, return special error
    if (!dbUser?.firstName || !dbUser?.lastName) {
      return NextResponse.json(
        { error: "NAME_REQUIRED" },
        { status: 400 }
      );
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

    // Process all files
    const fileRecords = await Promise.all(files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      
      return {
        fileName: file.name,
        fileUrl: `/uploads/${fileName}`,
        fileType: file.type,
        uploadedAt: new Date()
      };
    }));

    // Create document with user's full name from database
    const document = await Document.create({
      title,
      files: fileRecords,
      uploadedBy: user.id,
      uploaderName: dbUser.fullName || `${dbUser.firstName} ${dbUser.lastName}`, // Use fullName if exists, otherwise combine firstName and lastName
      uploadedFor: uploadedFor || user.id
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ 
      error: "Error uploading files", 
      details: error.message 
    }, { status: 500 });
  }
} 