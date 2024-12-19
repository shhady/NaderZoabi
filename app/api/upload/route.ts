import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore error if directory already exists
    }

    const fileName = `${Date.now()}-${file.name}`;
    await writeFile(path.join(uploadDir, fileName), buffer);

    // Save file metadata to database
    // You can add this part later when you have your database set up

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      fileName: fileName,
      url: `/uploads/${fileName}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse("Error uploading file", { status: 500 });
  }
} 