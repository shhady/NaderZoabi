'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const menuItems = isAdmin ? [
    { href: '/dashboard', label: 'לוח בקרה', icon: '📊' },
    { href: '/dashboard/documents', label: 'מסמכים', icon: '📄' },
    { href: '/dashboard/blog', label: 'ניהול בלוג', icon: '📝' },
    { href: '/dashboard/tax-inquiries', label: 'פניות להחזרי מס', icon: '💰' },
    { href: '/dashboard/users', label: 'משתמשים', icon: '👥' },
  ] : [
    { href: '/dashboard', label: 'אזור אישי', icon: '👤' },
    { href: '/dashboard/documents', label: 'המסמכים שלי', icon: '📄' },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="fixed top-20 right-4 z-40 md:hidden  bg-white p-2 rounded-md shadow-lg">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600 hover:text-[#B78628] focus:outline-none flex items-center gap-2"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isSidebarOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          {!isSidebarOpen && (
          <span className="text-gray-600 font-semibold">
            {isAdmin ? 'תפריט ניהול' : 'אזור אישי'}
          </span>
        )}
        </button>
       
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 right-0 h-screen bg-white shadow-xl z-30 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } md:relative md:top-0 md:h-screen md:w-64`}
      >
        <div className="h-full overflow-y-auto pt-8">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-[#2C3E50] my-6">
              {isAdmin ? 'תפריט ניהול' : 'אזור אישי'}
            </h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-[#B78628] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
} 