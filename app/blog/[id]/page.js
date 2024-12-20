'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import MDEditor from '@uiw/react-md-editor';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(post)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);
  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">הפוסט לא נמצא</h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white py-16" data-color-mode="light">
      <article className="max-w-3xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <time dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none blog-content">
          <MDEditor.Markdown source={post.content} />
        </div>
      </article>
    </div>
  );
  // ... rest of the component stays the same
} 