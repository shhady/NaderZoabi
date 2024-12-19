'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-[#2C3E50] to-[#1a2530] py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            בלוג ועדכונים
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            מידע מקצועי, טיפים ועדכונים בתחום המיסים והחשבונאות
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100"
            >
              {post.coverImage && (
                <div className="relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <time className="text-sm text-gray-500" suppressHydrationWarning>
                    {new Date(post.createdAt).toLocaleDateString('he-IL')}
                  </time>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-[#B78628]">{post.category}</span>
                </div>
                <h2 className="text-xl font-semibold text-[#2C3E50] mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[#B78628] hover:text-[#96691E] font-medium"
                >
                  קרא עוד →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 