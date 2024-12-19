'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function BlogManagementPage() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle blog post creation
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">ניהול בלוג</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כותרת
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קטגוריה
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תוכן
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
          >
            פרסם פוסט
          </button>
        </form>
      </div>
    </div>
  );
} 