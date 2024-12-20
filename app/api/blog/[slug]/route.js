import { connectToDB } from '@/lib/db';
import { BlogPost } from '@/lib/models/Blog';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { slug } = params;
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Error fetching post' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const blog = await Blog.findOne({ slug: params.slug });
    
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if user is the author
    if (blog.author !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, excerpt, coverImage } = await req.json();
    
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      {
        title,
        content,
        excerpt,
        coverImage,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Error updating blog" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const blog = await Blog.findOne({ slug: params.slug });
    
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if user is the author
    if (blog.author !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Blog.deleteOne({ slug: params.slug });
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Error deleting blog" }, { status: 500 });
  }
} 