import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import { uploadFile, getAccessibleFiles } from '@/lib/supabaseStorage';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
    try {
      console.log("=== Incoming POST request ==="); // Debugging: Check if the function is being called.
      
      const user = await currentUser();
      console.log("=== Current User ===", user); // Debugging: Ensure you get the user object.
  
      if (!user) {
        console.log("=== No User Found ==="); // Debugging: See if the user is undefined.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const formData = await request.formData();
      console.log("=== FormData Received ===", formData); // Debugging: Check the received data.
  
      const file = formData.get("file");
      const uploadedFor = formData.get("uploadedFor");
  
      if (!file) {
        console.log("=== No File Provided ==="); // Debugging: Ensure a file is being sent.
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
  
      const metadata = {
        uploaded_by: user.id,
        uploaded_for: uploadedFor || user.id,
      };
      console.log("=== Metadata ===", metadata); // Debugging: Check metadata.
  
      const fileRecord = await uploadFile(file, metadata);
      console.log("=== File Record ===", fileRecord); // Debugging: Confirm successful upload.
  
      return NextResponse.json(fileRecord);
    } catch (error) {
      console.error('Error in files API:', error);
      return NextResponse.json(
        { error: error.message || 'Error processing request' },
        { status: 500 }
      );
    }
  }
  

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user?.publicMetadata?.role === 'admin';
    const files = await getAccessibleFiles(user.id, isAdmin);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error in GET /api/files:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching files' },
      { status: 500 }
    );
  }
}
