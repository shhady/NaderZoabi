'use client'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const createOrGetUser = async () => {
      if (user) {
        try {
          // First try to get the user
          let response = await fetch(`/api/users/${user.id}`);
          
          // If user doesn't exist, create them
          if (response.status === 404) {
            response = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
              }),
            });
          }

          if (!response.ok && response.status !== 400) {
            console.error('Failed to create/get user');
          }
        } catch (error) {
          console.error('Error in user management:', error);
        }
      }
    };

    if (user) {
      createOrGetUser();
    }
  }, [user]);

  return (
    <nav className="bg-white shadow-sm" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-[#2C3E50]">
            פורטל רואה חשבון
          </Link>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/services" className="text-gray-600 hover:text-[#B78628]">
                שירותים
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-[#B78628]">
                בלוג
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#B78628]">
                צור קשר
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            {!isLoaded ? null : !user ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-gray-900">
                    התחברות
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#B78628] text-white px-4 py-2 rounded-md hover:bg-[#96691E]">
                    הרשמה
                  </button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  לוח בקרה
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 