'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CalendlyEmbed } from '../components/CalendlyEmbed';
import TaxRefundCalculator from '../components/TaxRefundCalculator';
export default function Home() {
  const [posts, setPosts] = useState([]);
 console.log(posts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.slice(0, 3)); // Show only 3 blogs on the home page
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const accountants = [
    {
      name: 'נאדר זועבי',
      experience: '35 שנה',
      description:
        'רואה חשבון עם ניסיון עשיר בתחומי ייעוץ מס, הנהלת חשבונות וליווי עסקי.',
      image: '/images/nader-icon.png',
    },
    {
      name: 'מגד זועבי',
      experience: '5 שנים',
      description:
        'רואה חשבון צעיר ומבטיח המתמחה בפתרונות פיננסיים לעסקים קטנים ובינוניים.',
      image: '/images/maged-icon.png',
    },
  ];

  const services = [
    {
      title: 'ייעוץ מס',
      description: 'ייעוץ מס מקצועי ותכנון מס לעסקים ויחידים.',
      icon: '📊',
    },
    {
      title: 'ביקורת דוחות כספיים',
      description: 'ביקורת דוחות שנתיים והכנת מאזנים מקצועיים.',
      icon: '📑',
    },
    {
      title: 'הנהלת חשבונות',
      description: 'ניהול שוטף של מערך הנהלת החשבונות.',
      icon: '📘',
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section 
        className="bg-[url('/hero-image.webp')] bg-cover bg-center text-white py-16 relative"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(44, 62, 80, 0.5), rgba(28, 28, 28, 0.5)), url("/hero-image.webp")'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">ברוכים הבאים למשרד זועבי</h1>
          <p className="text-xl mb-8">מומחים בייעוץ מס, הנהלת חשבונות וביקורת דוחות</p>
          <a
            href="/contact"
            className="bg-[#B78628] px-6 py-3 rounded-md text-white font-medium hover:bg-[#96691E] transition"
          >
            צור קשר
          </a>
        </div>
      </section>

      {/* Accountants Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
            צוות רואי החשבון שלנו
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {accountants.map((accountant, index) => (
              <div key={index} className="flex items-center space-x-6 bg-[#f0f0f0] p-6 rounded-lg shadow">
                <Image
                  src={'/user-avatar.png'}
                  alt={accountant.name}
                  width={120}
                  height={130}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{accountant.name}</h3>
                  <p className="text-gray-600 mb-2">{accountant.experience} ניסיון</p>
                  <p className="text-gray-600">{accountant.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-t from-[#F5F5F5] to-[#F4EDE5]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
            השירותים שלנו
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl text-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
<TaxRefundCalculator />
      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
            הבלוג שלנו
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
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
                  <div className='flex justify-end items-end'>
                  {post._id && (
                    <Link
                      href={`/blog/${post._id}`}
                      className="text-[#B78628] hover:text-[#96691E] font-medium"
                    >
                      קרא עוד ←  

                    </Link>
                  )}
                  </div>
                  
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/blog"
              className="inline-block px-6 py-3 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
            >
              כל הבלוגים
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#2C3E50] mb-6">
            קבעו פגישה
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            אנו מזמינים אתכם לקבוע פגישת ייעוץ ללא התחייבות ולהכיר את השירותים שלנו.
          </p>
          <CalendlyEmbed />
        </div>
      </section>
      {/* Footer */}
      {/* <footer className="bg-[#2C3E50] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-2">אכסאל 702, נצרת | טלפון: 04-6465875 | דוא"ל: info@accountant.co.il</p>
          <p className="text-sm">© 2024 משרד זועבי</p>
        </div>
      </footer> */}
    </main>
  );
}
