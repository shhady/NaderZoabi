import Image from 'next/image';
import Link from 'next/link';
import { getPosts } from '../../lib/posts';
import { BlogPost } from '../lib/types';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="gradient-bg py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Insights & Updates
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay informed with the latest financial news, tips, and expert insights
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <article 
              key={post._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="relative h-48">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <time className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
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
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 border rounded bg-[#B78628] text-white">
              1
            </button>
            <button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 