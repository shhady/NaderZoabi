import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    // Extract the `id` parameter from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const dbUser = await User.findOne({ clerkId: id }).lean();

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Error fetching user", { status: 500 });
  }
}
