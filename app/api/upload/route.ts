import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadedFor = formData.get("uploadedFor") as string || user.id;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Save file to local storage (server directory)
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `${Date.now()}-${file.name}`);
    const fileBuffer = await file.arrayBuffer();

    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    const fileUrl = `/uploads/${path.basename(filePath)}`; // Accessible URL for the file

    // Save file metadata to MongoDB
    await connectToDB();
    const document = await Document.create({
      fileName: file.name,
      fileUrl,
      fileType: file.type.includes("pdf") ? "pdf" : "image",
      uploadedBy: user.id,
      uploadedFor: uploadedFor,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Error uploading file", { status: 500 });
  }
}
