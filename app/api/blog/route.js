import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import { Blog } from "@/lib/models/Blog";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user?.publicMetadata?.role === 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, excerpt, coverImage } = await req.json();

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    await connectToDB();

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      slug,
      coverImage,
      author: user.id,
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Error creating blog" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Error fetching blogs" }, { status: 500 });
  }
} 