// import { NextResponse } from "next/server";
// import { currentUser } from "@clerk/nextjs/server";
// import { connectToDB } from "@/lib/db";
// import { Document } from "@/lib/models/Document";
// import { storage } from "@/lib/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// export async function POST(req: Request) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const uploadedFor = formData.get("uploadedFor") as string || user.id;

//     if (!file) {
//       return new NextResponse("No file provided", { status: 400 });
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Upload to Firebase Storage
//     const storageRef = ref(storage, `documents/${Date.now()}-${file.name}`);
//     await uploadBytes(storageRef, buffer);
//     const fileUrl = await getDownloadURL(storageRef);

//     // Save to MongoDB
//     await connectToDB();
//     const document = await Document.create({
//       fileName: file.name,
//       fileUrl,
//       fileType: file.type.includes('pdf') ? 'pdf' : 'image',
//       uploadedBy: user.id,
//       uploadedFor: uploadedFor
//     });

//     return NextResponse.json(document);
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return new NextResponse("Error uploading file", { status: 500 });
//   }
// }
