'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'בית' },
    { href: '/services', label: 'שירותים' },
    { href: '/blog', label: 'בלוג' },
    { href: '/contact', label: 'צור קשר' },
  ];

  const isActivePath = (path) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50" dir='ltr'>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center order-2 md:order-1">
            <Link href="/" className="text-2xl font-bold text-[#2C3E50]">
              <Image 
                src="/majd-logo.png" 
                alt="Logo" 
                width={50} 
                height={50}
                style={{ width: 'auto', height: '50px' }}
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center rtl:space-x-reverse order-1 md:order-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-base transition-colors ${
                  isActivePath(link.href)
                    ? 'text-[#B78628] border-b-2 border-[#B78628]'
                    : 'text-gray-600 hover:text-[#B78628]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 order-3">
            {isAdmin ? (
              <Link href="/dashboard" className="text-gray-600 hover:text-[#B78628]">
                לוח בקרה
              </Link>
            ) : user ? (
              <Link href="/dashboard" className="text-gray-600 hover:text-[#B78628]">
                אזור אישי
              </Link>
            ) : null}
            <UserButton afterSignOutUrl="/" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-[#B78628] focus:outline-none"
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
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 justify-center items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-base ${
                    isActivePath(link.href)
                      ? 'text-[#B78628] border-b border-[#B78628]'
                      : 'text-gray-600 hover:text-[#B78628]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 