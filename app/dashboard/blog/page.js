'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

export default function BlogManagementPage() {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">אין גישה</h2>
        <p className="text-gray-600 mt-2">
          אין לך הרשאות לצפות בדף זה
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error creating blog post');
      }

      const blog = await response.json();
      router.push(`/blog/${blog.slug}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-color-mode="light">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">ניהול בלוג</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כותרת
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תקציר
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תמונת כיסוי (URL)
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תוכן
            </label>
            <MDEditor
              value={formData.content}
              onChange={handleContentChange}
              preview="edit"
              height={400}
              className="w-full"
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              style={{backgroundColor:'white', color:'black'}}
              dir='ltr'
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] 
              transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'מפרסם...' : 'פרסם פוסט'}
          </button>
        </form>
      </div>
    </div>
  );
} 